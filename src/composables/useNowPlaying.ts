import { onMounted, onUnmounted } from 'vue'

interface NowPlayingData {
  isPlaying: boolean
  track?: string
  artist?: string
  album?: string
  albumArt?: string
  spotifyUrl?: string
  progressMs?: number
  durationMs?: number
}

export function useNowPlaying() {
  const data = useState<NowPlayingData>('now-playing', () => ({ isPlaying: false }))
  let lastFetchTime = 0

  async function fetchNowPlaying() {
    try {
      const result = await $fetch<NowPlayingData>('/api/spotify/now-playing')
      data.value = result
      lastFetchTime = Date.now()
    } catch {
      data.value = { isPlaying: false }
    }
  }

  if (import.meta.client) {
    let fetchInterval: ReturnType<typeof setInterval> | null = null
    let progressInterval: ReturnType<typeof setInterval> | null = null

    onMounted(() => {
      fetchNowPlaying()
      fetchInterval = setInterval(fetchNowPlaying, 5_000)

      // Interpolate progress smoothly between 5s polls
      progressInterval = setInterval(() => {
        if (data.value.isPlaying && data.value.progressMs !== undefined && data.value.durationMs !== undefined) {
          const elapsed = Date.now() - lastFetchTime
          // Add elapsed time to the base progress we got from the API, capping at duration
          data.value.progressMs = Math.min(data.value.progressMs + 1000, data.value.durationMs)
          // Update lastFetchTime so we only add 1s next tick
          lastFetchTime = Date.now()
        }
      }, 1000)
    })

    onUnmounted(() => {
      if (fetchInterval) clearInterval(fetchInterval)
      if (progressInterval) clearInterval(progressInterval)
    })
  }

  return { nowPlaying: data }
}
