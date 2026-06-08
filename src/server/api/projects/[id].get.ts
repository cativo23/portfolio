import { apiFetch } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { id } = getRouterParams(event)

  const headers: Record<string, string> = {}
  if (config.apiToken) {
    headers['x-api-key'] = config.apiToken
  }

  const data = await apiFetch<{ status?: string; data?: Record<string, unknown> }>(event, `/projects/${id}`, {
    method: 'GET',
    headers,
  })

  // Normalize techStack to always be string[]
  if (data?.data) {
    const project = data.data
    project.techStack = Array.isArray(project.techStack)
      ? project.techStack
      : project.techStack ? [String(project.techStack)] : []
  }

  return data
})
