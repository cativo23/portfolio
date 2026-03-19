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
        info: Record<string, { status: string }>
        error: Record<string, { status: string }>
        details: Record<string, { status: string }>
      }
      request_id?: string
    }>(`${config.apiBaseUrl}/health/ready`, {
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
        info: {},
        error: { backend: { status: 'down' } },
        details: {},
      },
    }
  }
})
