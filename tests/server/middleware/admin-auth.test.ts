import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetCookie = vi.fn()
vi.stubGlobal('getCookie', mockGetCookie)

const mockCreateError = vi.fn((err) => err)
vi.stubGlobal('createError', mockCreateError)

vi.stubGlobal('defineEventHandler', (handler: any) => handler)

describe('Admin Auth Middleware', () => {
  let handler: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const module = await import('~/server/middleware/admin-auth')
    handler = module.default
  })

  it('ignores non-admin routes', async () => {
    const event = { path: '/api/projects' } as any
    const result = await handler(event)

    expect(result).toBeUndefined()
    expect(mockGetCookie).not.toHaveBeenCalled()
  })

  it('ignores admin login route', async () => {
    const event = { path: '/api/admin/login' } as any
    const result = await handler(event)

    expect(result).toBeUndefined()
    expect(mockGetCookie).not.toHaveBeenCalled()
  })

  it('allows access to admin routes when token is present', async () => {
    mockGetCookie.mockReturnValue('valid-token')
    const event = { path: '/api/admin/projects' } as any

    const result = await handler(event)

    expect(mockGetCookie).toHaveBeenCalledWith(event, 'admin_token')
    expect(result).toBeUndefined() // Doesn't throw error
  })

  it('throws 401 when accessing admin routes without token', async () => {
    mockGetCookie.mockReturnValue(undefined)
    const event = { path: '/api/admin/users' } as any

    try {
      await handler(event)
      expect.fail('Should have thrown')
    } catch (err: any) {
      expect(mockCreateError).toHaveBeenCalledWith({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
      expect(err.statusCode).toBe(401)
    }
  })
})
