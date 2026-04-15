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
vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve({ data: [] })))

// ---------- Import handler after stubs are set up ----------
const { default: handler } = await import('~/server/api/admin/contacts.get')

describe('GET /api/admin/contacts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should forward request with Bearer token when auth cookie is present', async () => {
    const token = 'valid-jwt-token'
    vi.mocked(getCookie).mockReturnValue(token)
    vi.mocked(getQuery).mockReturnValue({ page: '1' })
    vi.mocked($fetch).mockResolvedValue({ data: [{ id: 1, name: 'Test' }] })

    const event = { path: '/api/admin/contacts', node: { req: { method: 'GET' } } } as any
    const result = await handler(event)

    expect(getCookie).toHaveBeenCalledWith(event, 'admin_token')
    expect($fetch).toHaveBeenCalledWith(
      `${runtimeConfig.apiBaseUrl}${runtimeConfig.apiBasePath}/contacts`,
      expect.objectContaining({
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        query: { page: '1' },
      }),
    )
    expect(result).toEqual({ data: [{ id: 1, name: 'Test' }] })
  })

  // HIGH #1: Verify that when no cookie is present, the handler sends an
  // empty Bearer token to the upstream API. Authentication enforcement is
  // delegated to the admin-auth middleware (tested separately) which runs
  // before this handler and rejects unauthenticated requests with 401.
  // The handler itself does NOT perform auth — it just proxies.
  it('should send empty Bearer token when cookie is absent (auth delegated to middleware)', async () => {
    vi.mocked(getCookie).mockReturnValue(undefined)
    vi.mocked($fetch).mockResolvedValue({ data: [] })

    const event = { path: '/api/admin/contacts', node: { req: { method: 'GET' } } } as any
    await handler(event)

    expect($fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { Authorization: 'Bearer ' },
      }),
    )
  })

  it('should propagate upstream API errors', async () => {
    vi.mocked(getCookie).mockReturnValue('token')
    vi.mocked($fetch).mockRejectedValue(new Error('Upstream 500'))

    const event = { path: '/api/admin/contacts', node: { req: { method: 'GET' } } } as any
    await expect(handler(event)).rejects.toThrow('Upstream 500')
  })

  it('should forward query parameters to upstream API', async () => {
    vi.mocked(getCookie).mockReturnValue('token')
    vi.mocked(getQuery).mockReturnValue({ page: '2', limit: '10' })
    vi.mocked($fetch).mockResolvedValue({ data: [] })

    const event = { path: '/api/admin/contacts', node: { req: { method: 'GET' } } } as any
    await handler(event)

    expect($fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        query: { page: '2', limit: '10' },
      }),
    )
  })
})
