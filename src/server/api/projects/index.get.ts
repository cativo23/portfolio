export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const headers: Record<string, string> = {}
  if (config.apiToken) {
    headers.Authorization = `ApiKey ${config.apiToken}`
  }

  const data = await $fetch(`${config.apiBaseUrl}/projects`, {
    method: 'GET',
    headers,
    query,
  })

  return data
})
