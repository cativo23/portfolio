export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const authHeader = getRequestHeader(event, 'authorization')
  const cookie = getCookie(event, 'admin_token')

  const headers: Record<string, string> = {}
  if (authHeader) {
    headers.Authorization = authHeader
  } else if (cookie) {
    headers.Authorization = `Bearer ${cookie}`
  }

  const body = await readBody(event)

  return $fetch(`${config.apiBaseUrl}${config.apiBasePath}/projects`, {
    method: 'POST',
    headers,
    body,
  })
})
