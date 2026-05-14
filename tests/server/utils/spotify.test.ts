import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchNowPlaying, _clearSpotifyCache } from '../../../src/server/utils/spotify'

// Mock the global $fetch
const viFetch = vi.fn()
global.$fetch = viFetch as any

describe('fetchNowPlaying', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.useFakeTimers()
    _clearSpotifyCache()
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
})