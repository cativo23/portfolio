import { Vibrant } from 'node-vibrant/node'

export interface SpotifyNowPlaying {
  isPlaying: boolean
  track?: string
  artist?: string
  album?: string
  albumArt?: string
  spotifyUrl?: string
  progressMs?: number
  durationMs?: number
  accentColor?: string
}

interface SpotifyTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface SpotifyArtist {
  name: string
}

interface SpotifyImage {
  url: string
  height: number
  width: number
}

interface SpotifyCurrentlyPlayingResponse {
  is_playing: boolean
  progress_ms: number
  item: {
    name: string
    duration_ms: number
    artists: SpotifyArtist[]
    album: {
      name: string
      images: SpotifyImage[]
    }
    external_urls: {
      spotify: string
    }
  } | null
}

export interface SpotifyRecentlyPlayedItem {
  track: string
  artist: string
  album: string
  albumArt?: string
  spotifyUrl?: string
  playedAt: string
}

interface SpotifyRecentlyPlayedResponse {
  items: {
    played_at: string
    track: {
      name: string
      artists: SpotifyArtist[]
      album: {
        name: string
        images: SpotifyImage[]
      }
      external_urls: {
        spotify: string
      }
    }
  }[]
}

let cachedToken: { token: string; expiresAt: number } | null = null
let cachedState: { data: SpotifyNowPlaying; fetchedAt: number } | null = null
let cachedRecentlyPlayed: { data: SpotifyRecentlyPlayedItem[]; fetchedAt: number } | null = null
let lastAccent: { albumArt: string; color: string | undefined } | null = null
let rateLimitedUntil = 0

// In-flight dedupe promises
let inFlightToken: Promise<string> | null = null
let inFlightNowPlaying: Promise<SpotifyNowPlaying> | null = null
let inFlightRecentlyPlayed: Promise<SpotifyRecentlyPlayedItem[]> | null = null

// For testing purposes
export function _clearSpotifyCache() {
  cachedToken = null
  cachedState = null
  cachedRecentlyPlayed = null
  lastAccent = null
  rateLimitedUntil = 0
  inFlightToken = null
  inFlightNowPlaying = null
  inFlightRecentlyPlayed = null
}

const POLL_INTERVAL = 5_000
const RECENTLY_PLAYED_POLL_INTERVAL = 60_000
const RECENTLY_PLAYED_LIMIT = 5
const MAX_CACHE_BYTES = 200_000
const INFLIGHT_TIMEOUT_MS = 10_000

const ACCENT_MIN_LIGHTNESS = 0.4
const ACCENT_TARGET_LIGHTNESS = 0.55
const ACCENT_EXTRACTION_TIMEOUT_MS = 3_000

function lightenHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const hueDeg = h * 360
    const k = (n + hueDeg / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export async function extractAccentColor(albumArtUrl: string): Promise<string | undefined> {
  try {
    const palette = await Promise.race([
      Vibrant.from(albumArtUrl).getPalette(),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error('accent color extraction timeout')), ACCENT_EXTRACTION_TIMEOUT_MS)),
    ])

    const swatch = palette.Vibrant ?? palette.LightVibrant ?? palette.Muted ?? palette.DarkVibrant ?? palette.LightMuted ?? palette.DarkMuted

    if (!swatch) {
      return undefined
    }

    const [h, s, l] = swatch.hsl
    if (l < ACCENT_MIN_LIGHTNESS) {
      return lightenHex(h, s, ACCENT_TARGET_LIGHTNESS)
    }

    return swatch.hex
  } catch (err: any) {
    console.warn('[Spotify] failed to extract accent color:', err?.message || err)
    return undefined
  }
}

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  // If a token request is already in flight, reuse it (with timeout)
  if (inFlightToken) {
    try {
      return await Promise.race([inFlightToken, new Promise<string>((_, rej) => setTimeout(() => rej(new Error('token timeout')), INFLIGHT_TIMEOUT_MS))])
    } catch (e) {
      inFlightToken = null
      // fall through to start a new request
    }
  }

  inFlightToken = (async () => {
    const res = await $fetch<SpotifyTokenResponse>('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    })

    cachedToken = {
      token: res.access_token,
      expiresAt: Date.now() + (res.expires_in - 60) * 1000,
    }

    return res.access_token
  })()

  try {
    return await inFlightToken
  } finally {
    inFlightToken = null
  }
}

export async function fetchNowPlaying(clientId: string, clientSecret: string, refreshToken: string): Promise<SpotifyNowPlaying> {
  if (!clientId || !clientSecret || !refreshToken) {
    return { isPlaying: false }
  }

  // If we're rate limited, return cached or empty
  if (Date.now() < rateLimitedUntil) {
    return cachedState?.data ?? { isPlaying: false }
  }

  // Fast path: respect POLL_INTERVAL
  if (cachedState && Date.now() - cachedState.fetchedAt < POLL_INTERVAL) {
    return cachedState.data
  }

  // Dedupe in-flight now-playing requests
  if (inFlightNowPlaying) {
    try {
      return await Promise.race([inFlightNowPlaying, new Promise<SpotifyNowPlaying>((_, rej) => setTimeout(() => rej(new Error('now-playing timeout')), INFLIGHT_TIMEOUT_MS))])
    } catch (e) {
      inFlightNowPlaying = null
      // continue to start a new fetch
    }
  }

  inFlightNowPlaying = (async () => {
    try {
      const token = await getAccessToken(clientId, clientSecret, refreshToken)

      const res = await $fetch<SpotifyCurrentlyPlayingResponse>('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      }).catch((err) => {
        console.error('[Spotify API] Request failed:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?._data,
        })
        if (err?.response?.status !== 429) {
          console.warn('[Spotify API] Error fetching now playing:', err.message || err)
        }
        throw err
      })

      const data: SpotifyNowPlaying = (!res || !res.item)
        ? { isPlaying: false }
        : {
            isPlaying: res.is_playing ?? false,
            track: res.item.name,
            artist: res.item.artists?.map((a: any) => a.name).join(', '),
            album: res.item.album?.name,
            albumArt: res.item.album?.images?.[0]?.url,
            spotifyUrl: res.item.external_urls?.spotify,
            progressMs: res.progress_ms ?? 0,
            durationMs: res.item.duration_ms ?? 0,
          }

      if (data.isPlaying && data.albumArt) {
        if (lastAccent && lastAccent.albumArt === data.albumArt) {
          data.accentColor = lastAccent.color
        } else {
          const color = await extractAccentColor(data.albumArt)
          lastAccent = { albumArt: data.albumArt, color }
          if (color) {
            data.accentColor = color
          }
        }
      }

      // Defensive cache-size guard
      try {
        const approxSize = JSON.stringify(data).length
        if (approxSize <= MAX_CACHE_BYTES) {
          cachedState = { data, fetchedAt: Date.now() }
        } else {
          console.warn('[Spotify] response too large to cache (%d bytes), skipping cache', approxSize)
        }
      } catch (e) {
        // If serialization fails for some reason, skip caching
        console.warn('[Spotify] failed to serialize now-playing data for caching', e)
      }

      return data
    } catch (err: any) {
      if (err?.response?.status === 429) {
        const retryAfter = parseInt(err.response.headers?.get?.('retry-after') || '30', 10)
        rateLimitedUntil = Date.now() + retryAfter * 1000
      }
      return cachedState?.data ?? { isPlaying: false }
    } finally {
      inFlightNowPlaying = null
    }
  })()

  return inFlightNowPlaying
}

export async function fetchRecentlyPlayed(clientId: string, clientSecret: string, refreshToken: string): Promise<SpotifyRecentlyPlayedItem[]> {
  if (!clientId || !clientSecret || !refreshToken) {
    return []
  }

  // If we're rate limited, return cached or empty
  if (Date.now() < rateLimitedUntil) {
    return cachedRecentlyPlayed?.data ?? []
  }

  // Fast path: respect the (longer) recently-played poll interval
  if (cachedRecentlyPlayed && Date.now() - cachedRecentlyPlayed.fetchedAt < RECENTLY_PLAYED_POLL_INTERVAL) {
    return cachedRecentlyPlayed.data
  }

  // Dedupe in-flight recently-played requests
  if (inFlightRecentlyPlayed) {
    try {
      return await Promise.race([inFlightRecentlyPlayed, new Promise<SpotifyRecentlyPlayedItem[]>((_, rej) => setTimeout(() => rej(new Error('recently-played timeout')), INFLIGHT_TIMEOUT_MS))])
    } catch (e) {
      inFlightRecentlyPlayed = null
      // continue to start a new fetch
    }
  }

  inFlightRecentlyPlayed = (async () => {
    try {
      const token = await getAccessToken(clientId, clientSecret, refreshToken)

      const res = await $fetch<SpotifyRecentlyPlayedResponse>(`https://api.spotify.com/v1/me/player/recently-played?limit=${RECENTLY_PLAYED_LIMIT}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      }).catch((err) => {
        console.error('[Spotify API] Request failed:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?._data,
        })
        if (err?.response?.status !== 429) {
          console.warn('[Spotify API] Error fetching recently played:', err.message || err)
        }
        throw err
      })

      const data: SpotifyRecentlyPlayedItem[] = (res?.items ?? []).map(({ played_at, track }) => ({
        track: track.name,
        artist: track.artists?.map((a: any) => a.name).join(', '),
        album: track.album?.name,
        albumArt: track.album?.images?.[0]?.url,
        spotifyUrl: track.external_urls?.spotify,
        playedAt: played_at,
      }))

      // Defensive cache-size guard (same bound as now-playing)
      try {
        const approxSize = JSON.stringify(data).length
        if (approxSize <= MAX_CACHE_BYTES) {
          cachedRecentlyPlayed = { data, fetchedAt: Date.now() }
        } else {
          console.warn('[Spotify] recently-played response too large to cache (%d bytes), skipping cache', approxSize)
        }
      } catch (e) {
        console.warn('[Spotify] failed to serialize recently-played data for caching', e)
      }

      return data
    } catch (err: any) {
      if (err?.response?.status === 429) {
        const retryAfter = parseInt(err.response.headers?.get?.('retry-after') || '30', 10)
        rateLimitedUntil = Date.now() + retryAfter * 1000
      }
      return cachedRecentlyPlayed?.data ?? []
    } finally {
      inFlightRecentlyPlayed = null
    }
  })()

  return inFlightRecentlyPlayed
}
