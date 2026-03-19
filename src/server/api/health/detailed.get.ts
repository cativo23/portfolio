export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const headers: Record<string, string> = {}
  if (config.apiToken) {
    headers['x-api-key'] = config.apiToken
  }

  try {
    const health = await $fetch<{
      status: string
      data: {
        status: string
        version: string
        environment: string
        timestamp: string
        uptime: number
        components: Record<string, {
          status: string
          latency?: number
          used?: number
          total?: number
          usagePercent?: number
          message?: string
        }>
      }
      request_id?: string
    }>(`${config.apiBaseUrl}${config.apiBasePath}/health/detailed`, {
      method: 'GET',
      headers,
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
        version: 'unknown',
        environment: 'unknown',
        timestamp: new Date().toISOString(),
        uptime: 0,
        components: {},
      },
    }
  }
})
