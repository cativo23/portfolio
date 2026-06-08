import { apiFetch } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const headers: Record<string, string> = {}
  if (config.apiToken) {
    headers['x-api-key'] = config.apiToken
  }

  try {
    const health = await apiFetch<{
      status: string
      data: {
        status: string
        info: Record<string, { status: string }>
        error: Record<string, { status: string }>
        details: Record<string, { status: string }>
      }
      request_id?: string
    }>(event, `/health/live`, {
      method: 'GET',
      headers,
      basePath: false,
    })

    return {
      status: 'success' as const,
      data: health.data,
      request_id: health.request_id,
    }
  } catch (error) {
    return {
      status: 'error' as const,
      data: {
        status: 'error',
        info: {},
        error: { backend: { status: 'down' } },
        details: {},
      },
    }
  }
})
