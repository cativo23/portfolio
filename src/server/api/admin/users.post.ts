export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const authHeader = getRequestHeader(event, 'authorization')
  const body = await readBody(event)

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authHeader) headers.Authorization = authHeader

  const result = await $fetch(`${config.apiBaseUrl}${config.apiBasePath}/admin/users`, {
    method: 'POST',
    headers,
    body,
  })

  return result
})
