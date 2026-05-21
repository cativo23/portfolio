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

// Singletons so multiple components sharing this composable don't create duplicate intervals
let _fetchInterval: ReturnType<typeof setInterval> | null = null
let _progressInterval: ReturnType<typeof setInterval> | null = null
let _activeConsumers = 0

export function useNowPlaying() {
  const data = useState<NowPlayingData>('now-playing', () => ({ isPlaying: false }))

  async function fetchNowPlaying() {
    try {
      const result = await $fetch<NowPlayingData>('/api/spotify/now-playing')
      data.value = result
    } catch {
      data.value = { isPlaying: false }
    }
  }

  if (import.meta.client) {
    onMounted(() => {
      _activeConsumers++
      if (_activeConsumers === 1) {
        fetchNowPlaying()
        _fetchInterval = setInterval(fetchNowPlaying, 5_000)

        // Interpolate progress between API polls (runs once, shared across all consumers)
        _progressInterval = setInterval(() => {
          if (data.value.isPlaying && data.value.progressMs !== undefined && data.value.durationMs !== undefined) {
            data.value.progressMs = Math.min(data.value.progressMs + 1000, data.value.durationMs)
          }
        }, 1000)
      }
    })

    onUnmounted(() => {
      _activeConsumers--
      if (_activeConsumers === 0) {
        if (_fetchInterval) { clearInterval(_fetchInterval); _fetchInterval = null }
        if (_progressInterval) { clearInterval(_progressInterval); _progressInterval = null }
      }
    })
  }

  return { nowPlaying: data }
}
