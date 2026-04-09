export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cookie = getCookie(event, 'admin_token')

  const headers: Record<string, string> = {}
  if (cookie) {
    headers.Authorization = `Bearer ${cookie}`
  }

  return $fetch(`${config.apiBaseUrl}${config.apiBasePath}/admin/users`, {
    method: 'GET',
    headers,
  })
})
