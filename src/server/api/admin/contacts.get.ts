export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const cookie = getCookie(event, 'admin_token')

  const headers: Record<string, string> = {}
  if (cookie) {
    headers.Authorization = `Bearer ${cookie}`
  }

  return $fetch(`${config.apiBaseUrl}${config.apiBasePath}/contacts`, {
    method: 'GET',
    headers,
    query,
  })
})
