import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const headers: Record<string, string> = {}
  if (config.apiToken) {
    headers['x-api-key'] = config.apiToken
  }

  const response = await $fetch.raw(`${config.apiBaseUrl}/projects`, {
    method: 'GET',
    headers,
    query,
  })

  console.log('=== RESPONSE HEADERS ===')
  const allHeaders = Object.fromEntries(response.headers.entries())
  const rateLimitHeaders = Object.fromEntries(
    Object.entries(allHeaders).filter(([key]) =>
      key.toLowerCase().includes('rate') || key.toLowerCase().includes('limit') || key.toLowerCase().includes('retry')
    )
  )
  console.log('Rate Limit Headers:', rateLimitHeaders)
  console.log('All Headers:', allHeaders)
  console.log('========================')

  let data = response._data

  // Normalize techStack to always be string[]
  if (data?.data && Array.isArray(data.data)) {
    data.data = data.data.map((project: any) => ({
      ...project,
      techStack: Array.isArray(project.techStack)
        ? project.techStack
        : project.techStack ? [String(project.techStack)] : [],
    }))
  }

  return data
})
