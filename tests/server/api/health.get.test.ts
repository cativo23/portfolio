import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies
const mockConfig = {
  apiToken: 'test-token',
  apiBaseUrl: 'https://api.example.com',
}
vi.stubGlobal('useRuntimeConfig', () => mockConfig)

const mockGetQuery = vi.fn()
vi.stubGlobal('getQuery', mockGetQuery)

const mockSetResponseStatus = vi.fn()
vi.stubGlobal('setResponseStatus', mockSetResponseStatus)

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

// Mock event handler definition
vi.stubGlobal('defineEventHandler', (handler: any) => handler)

describe('Health API - Basic', () => {
  let handler: any

  beforeEach(async () => {
    vi.clearAllMocks()
    mockGetQuery.mockReturnValue({})

    // Import dynamically after mocks are set up
    const module = await import('~/server/api/health.get')
    handler = module.default
  })

  it('fetches basic health status successfully', async () => {
    const mockHealthData = {
      status: 'up',
      components: { db: { status: 'up' } }
    }

    mockFetch.mockResolvedValue({
      status: 'success',
      data: mockHealthData,
      request_id: 'req-123'
    })

    const result = await handler({} as any)

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/health', {
      method: 'GET',
      headers: { 'x-api-key': 'test-token' }
    })

    expect(result).toEqual({
      status: 'success',
      data: mockHealthData,
      request_id: 'req-123'
    })
  })

  it('handles specific health types via query params', async () => {
    mockGetQuery.mockReturnValue({ type: 'live' })
    mockFetch.mockResolvedValue({ status: 'success', data: {} })

    await handler({} as any)

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/health/live', expect.any(Object))
  })

  it('sanitizes invalid health types to basic', async () => {
    mockGetQuery.mockReturnValue({ type: '../../../etc/passwd' }) // Path traversal attempt
    mockFetch.mockResolvedValue({ status: 'success', data: {} })

    await handler({} as any)

    // Should fall back to basic health endpoint
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/health', expect.any(Object))
  })

  it('handles API errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Connection failed'))

    const event = {} as any
    const result = await handler(event)

    expect(mockSetResponseStatus).toHaveBeenCalledWith(event, 503)
    expect(result).toEqual({
      status: 'error',
      data: {
        status: 'error',
        components: {}
      }
    })
  })
})
