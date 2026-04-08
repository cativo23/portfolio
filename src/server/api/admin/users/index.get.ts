export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const authHeader = getRequestHeader(event, 'authorization')

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authHeader) headers.Authorization = authHeader

  const users = await $fetch(`${config.apiBaseUrl}${config.apiBasePath}/admin/users`, {
    method: 'GET',
    headers,
  })

  return users
})
