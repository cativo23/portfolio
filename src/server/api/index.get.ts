import { apiFetch } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  try {
    const info = await apiFetch<{ status: string; data: { name: string; version: string; description: string; environment: string; documentation: string; health: string; status: string; timestamp: string } }>(event, `/`, {
      method: 'GET',
      basePath: false,
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
