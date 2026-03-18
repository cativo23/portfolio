export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (config.apiToken) {
    headers.Authorization = `ApiKey ${config.apiToken}`
  }

  const data = await $fetch(`${config.apiBaseUrl}${config.apiBasePath}/contacts`, {
    method: 'POST',
    headers,
    body,
  })

  return data
})
