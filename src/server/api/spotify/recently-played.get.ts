import { fetchRecentlyPlayed } from '~/server/utils/spotify'

export default defineEventHandler(async (event) => {
  const { spotifyClientId, spotifyClientSecret, spotifyRefreshToken } = useRuntimeConfig(event)
  return fetchRecentlyPlayed(spotifyClientId, spotifyClientSecret, spotifyRefreshToken)
})
