import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------- Nuxt auto-import stubs ----------
const runtimeConfig = {
  apiBaseUrl: 'http://localhost:3001',
  apiBasePath: '/api/v1',
}

vi.stubGlobal('useRuntimeConfig', () => runtimeConfig)
vi.stubGlobal('getQuery', vi.fn(() => ({})))
vi.stubGlobal('getCookie', vi.fn(() => undefined))
vi.stubGlobal('createError', vi.fn((opts: any) => {
  const err: any = new Error(opts.statusMessage ?? 'Error')
  err.statusCode = opts.statusCode
  return err
}))
vi.stubGlobal('defineEventHandler', vi.fn((handler: Function) => handler))
vi.stubGlobal('getRequestIP', () => undefined) // client-IP forwarding is covered in tests/server/utils/api.test.ts
vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve({ data: [] })))

// ---------- Import handler after stubs are set up ----------
const { default: handler } = await import('~/server/api/admin/projects.get')

describe('GET /api/admin/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should forward request with Authorization header when auth cookie is present', async () => {
    const token = 'valid-jwt-token'
    vi.mocked(getCookie).mockReturnValue(token)
    vi.mocked(getQuery).mockReturnValue({ status: 'active' })
    vi.mocked($fetch).mockResolvedValue({ data: [{ id: 1, title: 'Project' }] })

    const event = { path: '/api/admin/projects', node: { req: { method: 'GET' } } } as any
    const result = await handler(event)

    expect(getCookie).toHaveBeenCalledWith(event, 'admin_token')
    expect($fetch).toHaveBeenCalledWith(
      `${runtimeConfig.apiBaseUrl}${runtimeConfig.apiBasePath}/projects`,
      expect.objectContaining({
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        query: { status: 'active' },
      }),
    )
    expect(result).toEqual({ data: [{ id: 1, title: 'Project' }] })
  })

  // HIGH #1: When no cookie is present the handler omits the Authorization
  // header entirely. Auth enforcement is delegated to the admin-auth
  // middleware which rejects unauthenticated requests with 401 before this
  // handler executes.
  it('should omit Authorization header when cookie is absent (auth delegated to middleware)', async () => {
    vi.mocked(getCookie).mockReturnValue(undefined)
    vi.mocked($fetch).mockResolvedValue({ data: [] })

    const event = { path: '/api/admin/projects', node: { req: { method: 'GET' } } } as any
    await handler(event)

    expect($fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {},
      }),
    )
  })

  it('should propagate upstream API errors', async () => {
    vi.mocked(getCookie).mockReturnValue('token')
    vi.mocked($fetch).mockRejectedValue(new Error('Upstream 500'))

    const event = { path: '/api/admin/projects', node: { req: { method: 'GET' } } } as any
    await expect(handler(event)).rejects.toThrow('Upstream 500')
  })

  it('should forward query parameters to upstream API', async () => {
    vi.mocked(getCookie).mockReturnValue('token')
    vi.mocked(getQuery).mockReturnValue({ page: '1', limit: '20' })
    vi.mocked($fetch).mockResolvedValue({ data: [] })

    const event = { path: '/api/admin/projects', node: { req: { method: 'GET' } } } as any
    await handler(event)

    expect($fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        query: { page: '1', limit: '20' },
      }),
    )
  })
})
