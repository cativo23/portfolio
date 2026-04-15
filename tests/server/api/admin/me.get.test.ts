import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockConfig = {
  apiBaseUrl: 'https://api.example.com',
  apiBasePath: '/v1'
}
vi.stubGlobal('useRuntimeConfig', () => mockConfig)

const mockGetCookie = vi.fn()
vi.stubGlobal('getCookie', mockGetCookie)

const mockCreateError = vi.fn((err) => err)
vi.stubGlobal('createError', mockCreateError)

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)
vi.stubGlobal('defineEventHandler', (handler: any) => handler)

describe('Admin API - Me (Profile)', () => {
  let handler: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const module = await import('~/server/api/admin/me.get')
    handler = module.default
  })

  it('fetches profile successfully when authenticated', async () => {
    mockGetCookie.mockReturnValue('valid-token')
    mockFetch.mockResolvedValue({ id: 1, name: 'Admin' })

    const event = {} as any
    const result = await handler(event)

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/v1/auth/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer valid-token'
      }
    })
    expect(result).toEqual({ id: 1, name: 'Admin' })
  })

  it('throws 401 error when not authenticated', async () => {
    mockGetCookie.mockReturnValue(undefined)

    const event = {} as any

    // Wrap in try-catch to catch the error thrown directly by handler
    try {
      await handler(event)
      expect.fail('Should have thrown an error')
    } catch (err: any) {
      expect(mockCreateError).toHaveBeenCalledWith({
        statusCode: 401,
        statusMessage: 'Not authenticated'
      })
      expect(err.statusCode).toBe(401)
    }

    expect(mockFetch).not.toHaveBeenCalled()
  })
})
