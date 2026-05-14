import { fetchNowPlaying } from '~/server/utils/spotify'

export default defineEventHandler(async (event) => {
  const { spotifyClientId, spotifyClientSecret, spotifyRefreshToken } = useRuntimeConfig(event)
  return fetchNowPlaying(spotifyClientId, spotifyClientSecret, spotifyRefreshToken)
})
