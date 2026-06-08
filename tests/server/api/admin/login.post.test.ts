import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ---------- Nuxt auto-import stubs ----------
const runtimeConfig = {
  apiBaseUrl: 'http://localhost:3001',
  apiBasePath: '/api/v1',
}

vi.stubGlobal('useRuntimeConfig', () => runtimeConfig)
vi.stubGlobal('readBody', vi.fn(() => Promise.resolve({})))
vi.stubGlobal('setCookie', vi.fn())
vi.stubGlobal('createError', vi.fn((opts: any) => {
  const err: any = new Error(opts.statusMessage ?? 'Error')
  err.statusCode = opts.statusCode
  return err
}))
vi.stubGlobal('defineEventHandler', vi.fn((handler: Function) => handler))
vi.stubGlobal('getRequestIP', () => undefined) // client-IP forwarding is covered in tests/server/utils/api.test.ts
vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve({})))

// ---------- Import handler after stubs are set up ----------
const { default: handler } = await import('~/server/api/admin/login.post')

describe('POST /api/admin/login', () => {
  const originalEnv = process.env.NODE_ENV

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  it('should return success and set cookie on valid login', async () => {
    const user = { id: 1, email: 'admin@test.com', username: 'admin' }
    vi.mocked(readBody).mockResolvedValue({ email: 'admin@test.com', password: 'secret' })
    vi.mocked($fetch).mockResolvedValue({ access_token: 'jwt-token', user })

    const event = { path: '/api/admin/login', node: { req: { method: 'POST' } } } as any
    const result = await handler(event)

    expect(result).toEqual({ status: 'success', user })
    expect(setCookie).toHaveBeenCalledWith(
      event,
      'admin_token',
      'jwt-token',
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      }),
    )
  })

  it('should throw 400 when email is missing', async () => {
    vi.mocked(readBody).mockResolvedValue({ password: 'secret' })

    const event = { path: '/api/admin/login', node: { req: { method: 'POST' } } } as any
    await expect(handler(event)).rejects.toThrow()
    expect(createError).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400 }),
    )
  })

  it('should throw 400 when password is missing', async () => {
    vi.mocked(readBody).mockResolvedValue({ email: 'admin@test.com' })

    const event = { path: '/api/admin/login', node: { req: { method: 'POST' } } } as any
    await expect(handler(event)).rejects.toThrow()
    expect(createError).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400 }),
    )
  })

  it('should throw 400 for invalid email format', async () => {
    vi.mocked(readBody).mockResolvedValue({ email: 'not-an-email', password: 'secret' })

    const event = { path: '/api/admin/login', node: { req: { method: 'POST' } } } as any
    await expect(handler(event)).rejects.toThrow()
    expect(createError).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, statusMessage: 'Invalid email address' }),
    )
  })

  it('should throw 400 for non-string credentials', async () => {
    vi.mocked(readBody).mockResolvedValue({ email: 123, password: true })

    const event = { path: '/api/admin/login', node: { req: { method: 'POST' } } } as any
    await expect(handler(event)).rejects.toThrow()
    expect(createError).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, statusMessage: 'Invalid credentials format' }),
    )
  })

  it('should propagate upstream API errors', async () => {
    vi.mocked(readBody).mockResolvedValue({ email: 'admin@test.com', password: 'wrong' })
    vi.mocked($fetch).mockRejectedValue(new Error('Unauthorized'))

    const event = { path: '/api/admin/login', node: { req: { method: 'POST' } } } as any
    await expect(handler(event)).rejects.toThrow('Unauthorized')
  })

  it('should not leak access_token in response body', async () => {
    vi.mocked(readBody).mockResolvedValue({ email: 'admin@test.com', password: 'secret' })
    vi.mocked($fetch).mockResolvedValue({
      access_token: 'jwt-token',
      user: { id: 1, email: 'admin@test.com' },
    })

    const event = { path: '/api/admin/login', node: { req: { method: 'POST' } } } as any
    const result = await handler(event)

    expect(result).not.toHaveProperty('access_token')
    expect(result).not.toHaveProperty('data')
  })

  // MEDIUM #10: Verify secure: true when NODE_ENV=production
  it('should set secure: true on cookie when NODE_ENV is production', async () => {
    process.env.NODE_ENV = 'production'

    vi.mocked(readBody).mockResolvedValue({ email: 'admin@test.com', password: 'secret' })
    vi.mocked($fetch).mockResolvedValue({
      access_token: 'jwt-token',
      user: { id: 1, email: 'admin@test.com' },
    })

    const event = { path: '/api/admin/login', node: { req: { method: 'POST' } } } as any
    await handler(event)

    expect(setCookie).toHaveBeenCalledWith(
      event,
      'admin_token',
      'jwt-token',
      expect.objectContaining({ secure: true }),
    )
  })

  it('should set secure: false on cookie when NODE_ENV is not production', async () => {
    process.env.NODE_ENV = 'test'

    vi.mocked(readBody).mockResolvedValue({ email: 'admin@test.com', password: 'secret' })
    vi.mocked($fetch).mockResolvedValue({
      access_token: 'jwt-token',
      user: { id: 1, email: 'admin@test.com' },
    })

    const event = { path: '/api/admin/login', node: { req: { method: 'POST' } } } as any
    await handler(event)

    expect(setCookie).toHaveBeenCalledWith(
      event,
      'admin_token',
      'jwt-token',
      expect.objectContaining({ secure: false }),
    )
  })
})
