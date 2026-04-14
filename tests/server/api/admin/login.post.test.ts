import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockConfig = {
  apiBaseUrl: 'https://api.example.com',
  apiBasePath: '/v1'
}
vi.stubGlobal('useRuntimeConfig', () => mockConfig)

let mockBody: any = {}
vi.stubGlobal('readBody', () => Promise.resolve(mockBody))

const mockSetCookie = vi.fn()
vi.stubGlobal('setCookie', mockSetCookie)

const mockCreateError = vi.fn((err) => err)
vi.stubGlobal('createError', mockCreateError)

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)
vi.stubGlobal('defineEventHandler', (handler: any) => handler)

describe('Admin API - Login', () => {
  let handler: any

  beforeEach(async () => {
    vi.clearAllMocks()
    mockBody = {}

    // We need to set NODE_ENV for the tests to behave predictably
    process.env.NODE_ENV = 'test'

    const module = await import('~/server/api/admin/login.post')
    handler = module.default
  })

  it('successfully logs in and sets secure cookie', async () => {
    mockBody = { email: 'admin@example.com', password: 'secure_password' }

    mockFetch.mockResolvedValue({
      access_token: 'new-token',
      user: { id: 1, email: 'admin@example.com' }
    })

    const event = {} as any
    const result = await handler(event)

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'admin@example.com', password: 'secure_password' }
    })

    expect(mockSetCookie).toHaveBeenCalledWith(event, 'admin_token', 'new-token', expect.objectContaining({
      httpOnly: true,
      secure: false, // false because we forced NODE_ENV='test'
      sameSite: 'lax',
      path: '/'
    }))

    // Access token is deliberately omitted from return value
    expect(result).toEqual({
      status: 'success',
      user: { id: 1, email: 'admin@example.com' }
    })
  })

  it('handles nested token/user data structures', async () => {
    mockBody = { email: 'admin@example.com', password: 'secure_password' }

    // Test the data.data wrapper format
    mockFetch.mockResolvedValue({
      data: {
        access_token: 'nested-token',
        user: { id: 2 }
      }
    })

    const event = {} as any
    const result = await handler(event)

    expect(mockSetCookie).toHaveBeenCalledWith(
      event,
      'admin_token',
      'nested-token',
      expect.any(Object)
    )

    expect(result.user).toEqual({ id: 2 })
  })

  it('rejects missing credentials', async () => {
    mockBody = { email: 'admin@example.com' } // missing password

    try {
      await handler({} as any)
      expect.fail('Should have thrown')
    } catch (err: any) {
      expect(err.statusCode).toBe(400)
      expect(err.statusMessage).toBe('Email and password are required')
    }
  })

  it('rejects non-string credentials', async () => {
    mockBody = { email: 'admin@example.com', password: 12345 }

    try {
      await handler({} as any)
      expect.fail('Should have thrown')
    } catch (err: any) {
      expect(err.statusCode).toBe(400)
      expect(err.statusMessage).toBe('Invalid credentials format')
    }
  })

  it('rejects invalid email formats', async () => {
    mockBody = { email: 'notanemail', password: 'pwd' }

    try {
      await handler({} as any)
      expect.fail('Should have thrown')
    } catch (err: any) {
      expect(err.statusCode).toBe(400)
      expect(err.statusMessage).toBe('Invalid email address')
    }
  })

  it('trims whitespace from email', async () => {
    mockBody = { email: '  admin@example.com  ', password: 'pwd' }
    mockFetch.mockResolvedValue({})

    await handler({} as any)

    expect(mockFetch.mock.calls[0][1].body.email).toBe('admin@example.com')
  })
})
