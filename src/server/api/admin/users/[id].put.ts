export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cookie = getCookie(event, 'admin_token')
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) throw createError({ statusCode: 400, statusMessage: 'User ID required' })

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (cookie) headers.Authorization = `Bearer ${cookie}`

  return $fetch(`${config.apiBaseUrl}${config.apiBasePath}/admin/users/${id}`, {
    method: 'PUT',
    headers,
    body,
  })
})
