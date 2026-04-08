export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const authHeader = getRequestHeader(event, 'authorization')
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) throw createError({ statusCode: 400, statusMessage: 'User ID required' })

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authHeader) headers.Authorization = authHeader

  const result = await $fetch(`${config.apiBaseUrl}${config.apiBasePath}/admin/users/${id}`, {
    method: 'PUT',
    headers,
    body,
  })

  return result
})
