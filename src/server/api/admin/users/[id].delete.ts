export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const authHeader = getRequestHeader(event, 'authorization')
  const id = getRouterParam(event, 'id')

  if (!id) throw createError({ statusCode: 400, statusMessage: 'User ID required' })

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authHeader) headers.Authorization = authHeader

  await $fetch(`${config.apiBaseUrl}${config.apiBasePath}/admin/users/${id}`, {
    method: 'DELETE',
    headers,
  })

  return { deleted: id }
})
