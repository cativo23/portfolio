import { onMounted, onUnmounted } from 'vue'

interface RecentlyPlayedItem {
  track: string
  artist: string
  album: string
  albumArt?: string
  spotifyUrl?: string
  playedAt: string
}

// Singleton so multiple components sharing this composable don't create duplicate intervals
let _fetchInterval: ReturnType<typeof setInterval> | null = null
let _activeConsumers = 0

// Recently-played changes slowly — poll far less often than now-playing
const FETCH_INTERVAL_MS = 60_000

export function useRecentlyPlayed() {
  const data = useState<RecentlyPlayedItem[]>('recently-played', () => [])

  async function fetchRecentlyPlayed() {
    try {
      data.value = await $fetch<RecentlyPlayedItem[]>('/api/spotify/recently-played')
    } catch {
      data.value = []
    }
  }

  if (import.meta.client) {
    onMounted(() => {
      _activeConsumers++
      if (_activeConsumers === 1) {
        fetchRecentlyPlayed()
        _fetchInterval = setInterval(fetchRecentlyPlayed, FETCH_INTERVAL_MS)
      }
    })

    onUnmounted(() => {
      _activeConsumers--
      if (_activeConsumers === 0 && _fetchInterval) {
        clearInterval(_fetchInterval)
        _fetchInterval = null
      }
    })
  }

  return { recentlyPlayed: data }
}
