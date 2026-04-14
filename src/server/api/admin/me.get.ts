export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cookie = getCookie(event, 'admin_token')

  if (!cookie) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cookie}`,
  }

  return $fetch(`${config.apiBaseUrl}${config.apiBasePath}/auth/profile`, {
    method: 'GET',
    headers,
  })
})
