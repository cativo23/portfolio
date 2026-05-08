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

  async function fetchNowPlaying() {
    try {
      data.value = await $fetch<NowPlayingData>('/api/spotify/now-playing')
    } catch {
      data.value = { isPlaying: false }
    }
  }

  if (import.meta.client) {
    let interval: ReturnType<typeof setInterval> | null = null

    onMounted(() => {
      fetchNowPlaying()
      interval = setInterval(fetchNowPlaying, 5_000)
    })

    onUnmounted(() => {
      if (interval) clearInterval(interval)
    })
  }

  return { nowPlaying: data }
}
