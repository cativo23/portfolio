import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockConfig = {
  apiBaseUrl: 'https://api.example.com',
}
vi.stubGlobal('useRuntimeConfig', () => mockConfig)

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)
vi.stubGlobal('getRequestIP', () => undefined) // client-IP forwarding is covered in tests/server/utils/api.test.ts
vi.stubGlobal('defineEventHandler', (handler: any) => handler)

describe('Index API', () => {
  let handler: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const module = await import('~/server/api/index.get')
    handler = module.default
  })

  it('fetches index/info data successfully', async () => {
    const mockData = {
      status: 'success',
      data: { name: 'Portfolio API', version: '1.0.0' }
    }
    mockFetch.mockResolvedValue(mockData)

    const result = await handler({} as any)

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/', {
      method: 'GET',
      // apiFetch always passes a headers object (empty here: no auth, IP unresolved in test)
      headers: {}
    })

    expect(result).toEqual({
      status: 'success',
      data: mockData.data
    })
  })

  it('handles errors when fetching index info', async () => {
    mockFetch.mockRejectedValue(new Error('Connection timeout'))

    const result = await handler({} as any)

    expect(result).toEqual({
      status: 'error',
      data: null,
      error: 'Failed to fetch API info'
    })
  })
})
