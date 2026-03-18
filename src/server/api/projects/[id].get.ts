export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  if (!id || !/^[\w-]+$/.test(id)) {
    throw createError({ statusCode: 400, message: 'Invalid project ID' })
  }

  const headers: Record<string, string> = {}
  if (config.apiToken) {
    headers.Authorization = `ApiKey ${config.apiToken}`
  }

  const data = await $fetch(`${config.apiBaseUrl}/projects/${id}`, {
    method: 'GET',
    headers,
  })

  return data
})
