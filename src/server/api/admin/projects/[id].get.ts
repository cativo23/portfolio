export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const cookie = getCookie(event, 'admin_token')

  const headers: Record<string, string> = {}
  if (cookie) {
    headers.Authorization = `Bearer ${cookie}`
  }

  return $fetch(`${config.apiBaseUrl}${config.apiBasePath}/projects/${id}`, {
    method: 'GET',
    headers,
  })
})
