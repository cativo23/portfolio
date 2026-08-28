import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchNowPlaying, fetchRecentlyPlayed, extractAccentColor, _clearSpotifyCache } from '../../../src/server/utils/spotify'
import { Vibrant } from 'node-vibrant/node'

vi.mock('node-vibrant/node', () => ({
  Vibrant: {
    from: vi.fn(),
  },
}))

// Mock the global $fetch
const viFetch = vi.fn()
global.$fetch = viFetch as any

// Default: no usable swatch — tests that don't care about color extraction
// (i.e. every existing fetchNowPlaying/fetchRecentlyPlayed test) get accentColor: undefined.
function defaultVibrantMock() {
  vi.mocked(Vibrant.from).mockReturnValue({
    getPalette: () => Promise.resolve({
      Vibrant: null,
      LightVibrant: null,
      Muted: null,
      DarkVibrant: null,
      LightMuted: null,
      DarkMuted: null,
    }),
  } as any)
}

describe('fetchNowPlaying', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.useFakeTimers()
    _clearSpotifyCache()
    defaultVibrantMock()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return isPlaying: false if credentials are missing', async () => {
    const res = await fetchNowPlaying('', '', '')
    expect(res).toEqual({ isPlaying: false })
  })

  it('should get a token and fetch currently playing track', async () => {
    // Mock token response
    viFetch.mockResolvedValueOnce({
      access_token: 'mock-token',
      expires_in: 3600,
    })

    // Mock Spotify API response
    viFetch.mockResolvedValueOnce({
      is_playing: true,
      progress_ms: 1000,
      item: {
        name: 'Test Track',
        duration_ms: 3000,
        artists: [{ name: 'Test Artist' }],
        album: {
          name: 'Test Album',
          images: [{ url: 'test-art.jpg', height: 300, width: 300 }],
        },
        external_urls: {
          spotify: 'https://spotify.com/track',
        },
      },
    })

    const res = await fetchNowPlaying('client', 'secret', 'refresh')

    expect(res).toEqual({
      isPlaying: true,
      track: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      albumArt: 'test-art.jpg',
      spotifyUrl: 'https://spotify.com/track',
      progressMs: 1000,
      durationMs: 3000,
    })

    // Verify token request
    expect(viFetch).toHaveBeenNthCalledWith(1, 'https://accounts.spotify.com/api/token', expect.any(Object))
    // Verify API request
    expect(viFetch).toHaveBeenNthCalledWith(2, 'https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: 'Bearer mock-token' },
      timeout: 5000,
    })
  })

  it('should return isPlaying: false if nothing is playing', async () => {
    // Return cached token to skip token request
    // Set time to be within cached token validity
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))

    // Token call
    viFetch.mockResolvedValueOnce({
      access_token: 'mock-token-2',
      expires_in: 3600,
    })

    // Nothing playing API response
    viFetch.mockResolvedValueOnce(null)

    const res = await fetchNowPlaying('client', 'secret', 'refresh')
    expect(res).toEqual({ isPlaying: false })
  })

  it('should return cached data if called within POLL_INTERVAL', async () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))

    // Initial call
    viFetch.mockResolvedValueOnce({ access_token: 'token', expires_in: 3600 })
    viFetch.mockResolvedValueOnce({
      is_playing: true,
      item: { name: 'Track A', artists: [] },
    })

    await fetchNowPlaying('c', 's', 'r')

    // Advance time by 2 seconds (less than POLL_INTERVAL of 5s)
    vi.advanceTimersByTime(2000)

    const res2 = await fetchNowPlaying('c', 's', 'r')

    // Should return cached track A, and $fetch should only have been called twice total
    expect(res2.track).toBe('Track A')
    expect(viFetch).toHaveBeenCalledTimes(2)
  })

  it('should respect rate limits via Retry-After', async () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    viFetch.mockResolvedValueOnce({ access_token: 'token', expires_in: 3600 })

    // Force a 429 error
    const error429 = new Error('Rate Limited') as any
    error429.response = {
      status: 429,
      headers: {
        get: () => '10' // 10 seconds retry-after
      }
    }
    viFetch.mockRejectedValueOnce(error429)

    // Should gracefully fail to isPlaying: false
    const res1 = await fetchNowPlaying('c', 's', 'r')
    expect(res1.isPlaying).toBe(false)

    // Clear mock counts
    viFetch.mockClear()

    // Advance time by 5 seconds (POLL_INTERVAL has passed, but still rate limited)
    vi.advanceTimersByTime(5000)

    const res2 = await fetchNowPlaying('c', 's', 'r')
    expect(res2.isPlaying).toBe(false)
    // Should NOT have made an API call because it's rate limited
    expect(viFetch).not.toHaveBeenCalled()

    // Advance time past the 10s rate limit
    vi.advanceTimersByTime(6000)

    // We don't need a token mock because cachedToken is still valid (expires in 3600s)
    viFetch.mockResolvedValueOnce({
      is_playing: true,
      item: { name: 'Track B', artists: [] }
    })

    const res3 = await fetchNowPlaying('c', 's', 'r')
    expect(res3.track).toBe('Track B')
  })

  it('should dedupe concurrent calls to fetchNowPlaying and only call $fetch once per endpoint', async () => {
    vi.useRealTimers()
    _clearSpotifyCache()

    // Track calls
    const fetchSpy = vi.spyOn(global as any, '$fetch')

    // First call: token then now-playing
    fetchSpy.mockResolvedValueOnce({ access_token: 'concurrent-token', expires_in: 3600 })
    fetchSpy.mockResolvedValueOnce({ is_playing: true, item: { name: 'Concurrent Track', duration_ms: 1000, artists: [], album: { images: [] }, external_urls: { spotify: 'u' }}, progress_ms: 0 })

    // Fire two concurrent callers
    const [r1, r2] = await Promise.all([
      fetchNowPlaying('c', 's', 'r'),
      fetchNowPlaying('c', 's', 'r')
    ])

    expect(r1.track).toBe('Concurrent Track')
    expect(r2.track).toBe('Concurrent Track')

    // Expect exactly two fetch calls (one token, one now-playing)
    expect(fetchSpy).toHaveBeenCalledTimes(2)

    fetchSpy.mockRestore()
  })

  it('should skip caching for very large now-playing payloads', async () => {
    _clearSpotifyCache()
    const bigArtwork = 'a'.repeat(300_000)

    // token response
    viFetch.mockResolvedValueOnce({ access_token: 'big-token', expires_in: 3600 })
    // now-playing with giant albumArt (to produce large serialized payload)
    viFetch.mockResolvedValueOnce({ is_playing: true, progress_ms: 0, item: { name: 'Big Track', duration_ms: 1000, artists: [{ name: 'X' }], album: { name: 'Big Album', images: [{ url: bigArtwork, height: 1, width: 1 }] }, external_urls: { spotify: 'u' } } })

    const res = await fetchNowPlaying('c', 's', 'r')
    expect(res.track).toBe('Big Track')

    // Immediately call again; since we skipped caching, it should attempt to fetch again
    viFetch.mockResolvedValueOnce({ access_token: 'big-token-2', expires_in: 3600 })
    viFetch.mockResolvedValueOnce(null)

    const res2 = await fetchNowPlaying('c', 's', 'r')
    // res2 should be whatever the second call returned (nothing playing -> false)
    expect(res2.isPlaying).toBe(false)
  })

  it('should attach accentColor extracted from the current track album art', async () => {
    vi.mocked(Vibrant.from).mockReturnValueOnce({
      getPalette: () => Promise.resolve({
        Vibrant: { hex: '#ff6a3d', hsl: [0.05, 0.8, 0.6] },
        LightVibrant: null,
        Muted: null,
        DarkVibrant: null,
        LightMuted: null,
        DarkMuted: null,
      }),
    } as any)

    viFetch.mockResolvedValueOnce({ access_token: 'token', expires_in: 3600 })
    viFetch.mockResolvedValueOnce({
      is_playing: true,
      progress_ms: 0,
      item: {
        name: 'Accent Track',
        duration_ms: 1000,
        artists: [{ name: 'Artist' }],
        album: { name: 'Album', images: [{ url: 'https://i.scdn.co/image/accent', height: 300, width: 300 }] },
        external_urls: { spotify: 'u' },
      },
    })

    const res = await fetchNowPlaying('c', 's', 'r')
    expect(res.accentColor).toBe('#ff6a3d')
  })

  it('should not re-extract accentColor when the track has not changed', async () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    vi.mocked(Vibrant.from).mockClear()
    vi.mocked(Vibrant.from).mockReturnValueOnce({
      getPalette: () => Promise.resolve({
        Vibrant: { hex: '#66ddff', hsl: [0.55, 0.8, 0.6] },
        LightVibrant: null,
        Muted: null,
        DarkVibrant: null,
        LightMuted: null,
        DarkMuted: null,
      }),
    } as any)

    const sameItem = {
      is_playing: true,
      progress_ms: 0,
      item: {
        name: 'Same Track',
        duration_ms: 1000,
        artists: [{ name: 'Artist' }],
        album: { name: 'Album', images: [{ url: 'https://i.scdn.co/image/same', height: 300, width: 300 }] },
        external_urls: { spotify: 'u' },
      },
    }

    viFetch.mockResolvedValueOnce({ access_token: 'token', expires_in: 3600 })
    viFetch.mockResolvedValueOnce(sameItem)
    const res1 = await fetchNowPlaying('c', 's', 'r')
    expect(res1.accentColor).toBe('#66ddff')

    // Advance past the 5s now-playing POLL_INTERVAL so the *outer* cache expires and
    // a real fetch happens again — this is what actually exercises the accent-reuse
    // logic (lastAccent), instead of short-circuiting on the outer cache.
    vi.advanceTimersByTime(6_000)

    // Cached token is still valid (only 6s passed, expires in 3600s) — no token mock needed.
    viFetch.mockResolvedValueOnce(sameItem)
    const res2 = await fetchNowPlaying('c', 's', 'r')

    expect(res2.accentColor).toBe('#66ddff')
    expect(vi.mocked(Vibrant.from)).toHaveBeenCalledTimes(1)
  })
})

describe('fetchRecentlyPlayed', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.useFakeTimers()
    _clearSpotifyCache()
    defaultVibrantMock()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return an empty array if credentials are missing', async () => {
    const res = await fetchRecentlyPlayed('', '', '')
    expect(res).toEqual([])
  })

  it('should get a token and fetch recently played tracks', async () => {
    viFetch.mockResolvedValueOnce({
      access_token: 'mock-token',
      expires_in: 3600,
    })

    viFetch.mockResolvedValueOnce({
      items: [
        {
          played_at: '2026-08-27T10:00:00Z',
          track: {
            name: 'Recent Track',
            artists: [{ name: 'Recent Artist' }],
            album: {
              name: 'Recent Album',
              images: [{ url: 'recent-art.jpg', height: 300, width: 300 }],
            },
            external_urls: { spotify: 'https://spotify.com/recent-track' },
          },
        },
      ],
    })

    const res = await fetchRecentlyPlayed('client', 'secret', 'refresh')

    expect(res).toEqual([
      {
        track: 'Recent Track',
        artist: 'Recent Artist',
        album: 'Recent Album',
        albumArt: 'recent-art.jpg',
        spotifyUrl: 'https://spotify.com/recent-track',
        playedAt: '2026-08-27T10:00:00Z',
      },
    ])

    expect(viFetch).toHaveBeenNthCalledWith(1, 'https://accounts.spotify.com/api/token', expect.any(Object))
    expect(viFetch).toHaveBeenNthCalledWith(2, 'https://api.spotify.com/v1/me/player/recently-played?limit=5', {
      headers: { Authorization: 'Bearer mock-token' },
      timeout: 5000,
    })
  })

  it('should return an empty array on API error', async () => {
    viFetch.mockResolvedValueOnce({ access_token: 'mock-token', expires_in: 3600 })
    viFetch.mockRejectedValueOnce(new Error('boom'))

    const res = await fetchRecentlyPlayed('client', 'secret', 'refresh')
    expect(res).toEqual([])
  })

  it('should return cached data if called within the recently-played poll interval', async () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))

    viFetch.mockResolvedValueOnce({ access_token: 'token', expires_in: 3600 })
    viFetch.mockResolvedValueOnce({
      items: [{ played_at: 't', track: { name: 'Track A', artists: [], album: { images: [] }, external_urls: {} } }],
    })

    await fetchRecentlyPlayed('c', 's', 'r')

    vi.advanceTimersByTime(5_000)

    const res2 = await fetchRecentlyPlayed('c', 's', 'r')

    expect(res2[0].track).toBe('Track A')
    expect(viFetch).toHaveBeenCalledTimes(2)
  })
})

describe('extractAccentColor', () => {
  beforeEach(() => {
    vi.mocked(Vibrant.from).mockClear()
    defaultVibrantMock()
  })

  it('should return the Vibrant swatch hex when it is light enough', async () => {
    vi.mocked(Vibrant.from).mockReturnValueOnce({
      getPalette: () => Promise.resolve({
        Vibrant: { hex: '#ff6a3d', hsl: [0.05, 0.8, 0.6] },
        LightVibrant: null,
        Muted: null,
        DarkVibrant: null,
        LightMuted: null,
        DarkMuted: null,
      }),
    } as any)

    const color = await extractAccentColor('https://i.scdn.co/image/abc')
    expect(color).toBe('#ff6a3d')
  })

  it('should lighten a swatch that is too dark instead of returning it as-is', async () => {
    vi.mocked(Vibrant.from).mockReturnValueOnce({
      getPalette: () => Promise.resolve({
        Vibrant: { hex: '#1a0d08', hsl: [0.05, 0.8, 0.1] },
        LightVibrant: null,
        Muted: null,
        DarkVibrant: null,
        LightMuted: null,
        DarkMuted: null,
      }),
    } as any)

    const color = await extractAccentColor('https://i.scdn.co/image/dark')
    expect(color).not.toBe('#1a0d08')
    expect(color).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('should fall back through the swatch priority order when Vibrant is null', async () => {
    vi.mocked(Vibrant.from).mockReturnValueOnce({
      getPalette: () => Promise.resolve({
        Vibrant: null,
        LightVibrant: { hex: '#cceeff', hsl: [0.55, 0.6, 0.85] },
        Muted: null,
        DarkVibrant: null,
        LightMuted: null,
        DarkMuted: null,
      }),
    } as any)

    const color = await extractAccentColor('https://i.scdn.co/image/fallback')
    expect(color).toBe('#cceeff')
  })

  it('should return undefined when no swatch is usable', async () => {
    const color = await extractAccentColor('https://i.scdn.co/image/none')
    expect(color).toBeUndefined()
  })

  it('should return undefined instead of throwing when Vibrant rejects', async () => {
    vi.mocked(Vibrant.from).mockReturnValueOnce({
      getPalette: () => Promise.reject(new Error('decode failed')),
    } as any)

    const color = await extractAccentColor('https://i.scdn.co/image/broken')
    expect(color).toBeUndefined()
  })

  it('should refuse to extract from a URL not on Spotify\'s CDN, without calling Vibrant', async () => {
    vi.mocked(Vibrant.from).mockReturnValueOnce({
      getPalette: () => Promise.resolve({
        Vibrant: { hex: '#ff6a3d', hsl: [0.05, 0.8, 0.6] },
        LightVibrant: null,
        Muted: null,
        DarkVibrant: null,
        LightMuted: null,
        DarkMuted: null,
      }),
    } as any)

    const color = await extractAccentColor('https://evil.example.com/ssrf-probe')
    expect(color).toBeUndefined()
    expect(Vibrant.from).not.toHaveBeenCalled()
  })

  it('should refuse a non-https URL even on an allowed host', async () => {
    const color = await extractAccentColor('http://i.scdn.co/image/insecure')
    expect(color).toBeUndefined()
    expect(Vibrant.from).not.toHaveBeenCalled()
  })
})