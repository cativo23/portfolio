export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const type = query.type || 'basic'

  const headers: Record<string, string> = {}
  if (config.apiToken) {
    headers['x-api-key'] = config.apiToken
  }

  const endpoint = `${config.apiBaseUrl}/health${type !== 'basic' ? `/${type}` : ''}`

  try {
    const health = await $fetch<{
      status: string
      data: {
        status: string
        info?: Record<string, { status: string }>
        error?: Record<string, { status: string; message?: string }>
        details?: Record<string, { status: string }>
        components?: Record<string, { status: string; latency?: number; used?: number; total?: number; usagePercent?: number; message?: string }>
        version?: string
        environment?: string
        timestamp?: string
        uptime?: number
      }
      request_id?: string
    }>(endpoint, {
      method: 'GET',
      headers,
    })

    return {
      status: 'success' as const,
      data: health.data,
      request_id: health.request_id,
    }
  } catch (error) {
    console.error(error)
    return {
      status: 'error' as const,
      data: {
        status: 'error',
        info: {},
        error: { backend: { status: 'down', message: 'Backend unavailable' } },
        details: {},
      },
    }
  }
})
