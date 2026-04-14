export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cookie = getCookie(event, 'admin_token')
  const body = await readBody(event)

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (cookie) headers.Authorization = `Bearer ${cookie}`

  return $fetch(`${config.apiBaseUrl}${config.apiBasePath}/admin/users`, {
    method: 'POST',
    headers,
    body,
  })
})
