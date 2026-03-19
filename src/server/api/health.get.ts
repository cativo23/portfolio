
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const rawType = query.type as string || 'basic'

  // Validate type against allowlist to prevent SSRF path traversal
  const allowedTypes = ['basic', 'detailed', 'live', 'ready'] as const
  const type = allowedTypes.includes(rawType as any) ? rawType : 'basic'

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
        components: Record<string, { status: string; latency?: number; used?: number; total?: number; usagePercent?: number; message?: string }>
        version?: string
        environment?: string
        timestamp?: string
        uptime?: number
        process?: {
          pid: number
          nodeVersion: string
          platform: string
          cpuUsage: { user: number; system: number }
          memoryUsage: { rss: number; heapTotal: number; heapUsed: number; external: number }
        }
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
  } catch (_error) {
    setResponseStatus(event, 503)
    return {
      status: 'error' as const,
      data: {
        status: 'error',
        components: {},
      },
    }
  }
})
