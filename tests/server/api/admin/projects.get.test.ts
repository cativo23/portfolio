import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockConfig = {
  apiBaseUrl: 'https://api.example.com',
  apiBasePath: '/v1'
}
vi.stubGlobal('useRuntimeConfig', () => mockConfig)

const mockGetCookie = vi.fn()
vi.stubGlobal('getCookie', mockGetCookie)
vi.stubGlobal('getQuery', () => ({ page: 1 }))

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)
vi.stubGlobal('defineEventHandler', (handler: any) => handler)

describe('Admin API - Projects', () => {
  let handler: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const module = await import('~/server/api/admin/projects.get')
    handler = module.default
  })

  it('fetches admin projects with auth cookie', async () => {
    mockGetCookie.mockReturnValue('valid-token')
    mockFetch.mockResolvedValue({ data: [] })

    const event = {} as any
    const result = await handler(event)

    expect(mockGetCookie).toHaveBeenCalledWith(event, 'admin_token')
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/v1/projects', {
      method: 'GET',
      headers: { Authorization: 'Bearer valid-token' },
      query: { page: 1 }
    })
    expect(result).toEqual({ data: [] })
  })

  it('fetches admin projects without auth cookie', async () => {
    mockGetCookie.mockReturnValue(undefined)
    mockFetch.mockResolvedValue({ data: [] })

    const event = {} as any
    await handler(event)

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/v1/projects', {
      method: 'GET',
      headers: {}, // No authorization header
      query: { page: 1 }
    })
  })
})
