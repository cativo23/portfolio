import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockConfig = {
  apiToken: 'test-token',
  apiBaseUrl: 'https://api.example.com',
}
vi.stubGlobal('useRuntimeConfig', () => mockConfig)

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)
vi.stubGlobal('getRequestIP', () => undefined) // client-IP forwarding is covered in tests/server/utils/api.test.ts
vi.stubGlobal('defineEventHandler', (handler: any) => handler)

describe('Health API - Live', () => {
  let handler: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const module = await import('~/server/api/health/live.get')
    handler = module.default
  })

  it('fetches live health status successfully', async () => {
    const mockHealthData = {
      status: 'up',
      info: { db: { status: 'up' } },
      error: {},
      details: {}
    }

    mockFetch.mockResolvedValue({
      status: 'success',
      data: mockHealthData,
      request_id: 'req-live'
    })

    const result = await handler({} as any)

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/health/live', {
      method: 'GET',
      headers: { 'x-api-key': 'test-token' }
    })

    expect(result).toEqual({
      status: 'success',
      data: mockHealthData,
      request_id: 'req-live'
    })
  })

  it('handles API errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Connection failed'))

    const result = await handler({} as any)

    expect(result).toEqual({
      status: 'error',
      data: {
        status: 'error',
        info: {},
        error: { backend: { status: 'down' } },
        details: {}
      }
    })
  })
})
