export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  try {
    const info = await $fetch<{ status: string; data: { name: string; version: string; description: string; environment: string; documentation: string; health: string; status: string; timestamp: string } }>(`${config.apiBaseUrl}${config.apiBasePath}/`, {
      method: 'GET',
    })

    return {
      status: 'success' as const,
      data: info.data,
    }
  } catch (error) {
    return {
      status: 'error' as const,
      data: null,
      error: 'Failed to fetch API info',
    }
  }
})
