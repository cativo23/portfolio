export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  try {
    const health = await $fetch<{ status: string; data: { summary: string; checks: Record<string, { status: string }>; checkedAt: string } }>(`${config.apiBaseUrl}/health`, {
      method: 'GET',
    })

    return {
      status: 'success' as const,
      data: health.data,
    }
  } catch (error) {
    return {
      status: 'error' as const,
      data: {
        summary: 'Backend unavailable',
        checks: {},
        checkedAt: new Date().toISOString(),
      },
    }
  }
})
