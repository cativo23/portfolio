export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const headers: Record<string, string> = {}
  if (config.apiToken) {
    headers['x-api-key'] = config.apiToken
  }

  const data = await $fetch<{ data?: Array<Record<string, unknown>>; [key: string]: unknown }>(`${config.apiBaseUrl}${config.apiBasePath}/projects`, {
    method: 'GET',
    headers,
    query,
  })

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
