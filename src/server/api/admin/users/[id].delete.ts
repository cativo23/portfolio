export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cookie = getCookie(event, 'admin_token')
  const id = getRouterParam(event, 'id')

  if (!id) throw createError({ statusCode: 400, statusMessage: 'User ID required' })

  const headers: Record<string, string> = {}
  if (cookie) headers.Authorization = `Bearer ${cookie}`

  return $fetch(`${config.apiBaseUrl}${config.apiBasePath}/admin/users/${id}`, {
    method: 'DELETE',
    headers,
  })
})
