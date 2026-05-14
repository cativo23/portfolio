export interface SpotifyNowPlaying {
  isPlaying: boolean
  track?: string
  artist?: string
  album?: string
  albumArt?: string
  spotifyUrl?: string
  progressMs?: number
  durationMs?: number
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

let cachedToken: { token: string; expiresAt: number } | null = null
let cachedState: { data: SpotifyNowPlaying; fetchedAt: number } | null = null
let rateLimitedUntil = 0

// In-flight dedupe promises
let inFlightToken: Promise<string> | null = null
let inFlightNowPlaying: Promise<SpotifyNowPlaying> | null = null

// For testing purposes
export function _clearSpotifyCache() {
  cachedToken = null
  cachedState = null
  rateLimitedUntil = 0
  inFlightToken = null
  inFlightNowPlaying = null
}

const POLL_INTERVAL = 5_000
const MAX_CACHE_BYTES = 200_000
const INFLIGHT_TIMEOUT_MS = 10_000

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
