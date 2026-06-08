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

describe('Health API - Detailed', () => {
  let handler: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const module = await import('~/server/api/health/detailed.get')
    handler = module.default
  })

  it('fetches detailed health status successfully', async () => {
    const mockHealthData = {
      status: 'up',
      version: '1.0.0',
      environment: 'production',
      timestamp: '2023-01-01T00:00:00Z',
      uptime: 3600,
      components: {
        db: { status: 'up', latency: 10 }
      }
    }

    mockFetch.mockResolvedValue({
      status: 'success',
      data: mockHealthData,
      request_id: 'req-detailed'
    })

    const result = await handler({} as any)

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/health/detailed', {
      method: 'GET',
      headers: { 'x-api-key': 'test-token' }
    })

    expect(result).toEqual({
      status: 'success',
      data: mockHealthData,
      request_id: 'req-detailed'
    })
  })

  it('handles API errors gracefully with fallback data', async () => {
    // Mock Date to ensure deterministic timestamp
    const mockDate = new Date('2023-01-01T00:00:00Z')
    vi.setSystemTime(mockDate)

    mockFetch.mockRejectedValue(new Error('Connection failed'))

    const result = await handler({} as any)

    expect(result.status).toBe('error')
    expect(result.data).toEqual({
      status: 'error',
      version: 'unknown',
      environment: 'unknown',
      timestamp: mockDate.toISOString(),
      uptime: 0,
      components: {}
    })

    vi.useRealTimers()
  })
})
