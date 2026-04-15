import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockConfig = {
  apiToken: 'test-token',
  apiBaseUrl: 'https://api.example.com',
  apiBasePath: '/v1'
}
vi.stubGlobal('useRuntimeConfig', () => mockConfig)

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)
vi.stubGlobal('defineEventHandler', (handler: any) => handler)

describe('Profile API', () => {
  let handler: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const module = await import('~/server/api/profile.get')
    handler = module.default
  })

  it('fetches profile data successfully', async () => {
    const mockData = { data: { name: 'Carlos Cativo' } }
    mockFetch.mockResolvedValue(mockData)

    const result = await handler({} as any)

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/v1/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'test-token'
      }
    })

    expect(result).toEqual(mockData)
  })

  it('returns fallback data when API fails', async () => {
    // Prevent console.error from spamming test output
    const originalError = console.error
    console.error = vi.fn()

    mockFetch.mockRejectedValue(new Error('API Down'))

    const result = await handler({} as any)

    // Should return fallback data
    expect(result.status).toBe('success')
    expect(result.data.name).toBe('Carlos Cativo')
    expect(result.data.skills).toBeDefined()
    expect(result.data.experience).toBeDefined()

    console.error = originalError
  })
})
