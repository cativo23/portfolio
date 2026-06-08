import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------- Nuxt auto-import stubs ----------
const runtimeConfig = {
  apiBaseUrl: 'http://localhost:3001',
  apiBasePath: '/api/v1',
}

vi.stubGlobal('useRuntimeConfig', () => runtimeConfig)
vi.stubGlobal('getCookie', vi.fn(() => undefined))
vi.stubGlobal('readBody', vi.fn(() => Promise.resolve({})))
vi.stubGlobal('createError', vi.fn((opts: any) => {
  const err: any = new Error(opts.statusMessage ?? 'Error')
  err.statusCode = opts.statusCode
  return err
}))
vi.stubGlobal('defineEventHandler', vi.fn((handler: Function) => handler))
vi.stubGlobal('getRequestIP', () => undefined) // client-IP forwarding is covered in tests/server/utils/api.test.ts
vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve({ data: {} })))

// ---------- Import handler after stubs are set up ----------
// Note: the public projects.post handler lives at ~/server/api/projects.post
// There is no admin-specific projects.post handler; the public one is used
// with auth delegated to middleware for admin paths.
const { default: handler } = await import('~/server/api/projects.post')

describe('POST /api/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should forward body and auth header to upstream API', async () => {
    const token = 'valid-jwt-token'
    const body = { title: 'New Project', description: 'A test project', url: 'https://example.com' }

    vi.mocked(getCookie).mockReturnValue(token)
    vi.mocked(readBody).mockResolvedValue(body)
    vi.mocked($fetch).mockResolvedValue({ data: { id: 1, ...body } })

    const event = { path: '/api/projects', node: { req: { method: 'POST' } } } as any
    const result = await handler(event)

    expect(readBody).toHaveBeenCalledWith(event)
    expect($fetch).toHaveBeenCalledWith(
      `${runtimeConfig.apiBaseUrl}${runtimeConfig.apiBasePath}/projects`,
      expect.objectContaining({
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      }),
    )
    expect(result).toEqual({ data: { id: 1, ...body } })
  })

  // HIGH #1: When no cookie is present, the handler sends an empty Bearer
  // token. Auth enforcement is delegated to the admin-auth middleware which
  // rejects unauthenticated requests with 401 before this handler executes.
  it('should send empty Bearer token when cookie is absent (auth delegated to middleware)', async () => {
    vi.mocked(getCookie).mockReturnValue(undefined)
    vi.mocked(readBody).mockResolvedValue({ title: 'Test' })
    vi.mocked($fetch).mockResolvedValue({ data: {} })

    const event = { path: '/api/projects', node: { req: { method: 'POST' } } } as any
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
    vi.mocked(readBody).mockResolvedValue({ title: 'Test' })
    vi.mocked($fetch).mockRejectedValue(new Error('Upstream 422'))

    const event = { path: '/api/projects', node: { req: { method: 'POST' } } } as any
    await expect(handler(event)).rejects.toThrow('Upstream 422')
  })

  // MEDIUM #11: Missing required fields — the handler proxies the body
  // as-is, so validation is upstream. Verify the body is forwarded intact.
  it('should forward empty body to upstream API (validation is upstream)', async () => {
    vi.mocked(getCookie).mockReturnValue('token')
    vi.mocked(readBody).mockResolvedValue({})
    vi.mocked($fetch).mockResolvedValue({ data: {} })

    const event = { path: '/api/projects', node: { req: { method: 'POST' } } } as any
    await handler(event)

    expect($fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: {},
      }),
    )
  })

  it('should forward body with missing optional fields', async () => {
    vi.mocked(getCookie).mockReturnValue('token')
    vi.mocked(readBody).mockResolvedValue({ title: 'Minimal' })
    vi.mocked($fetch).mockResolvedValue({ data: { id: 2, title: 'Minimal' } })

    const event = { path: '/api/projects', node: { req: { method: 'POST' } } } as any
    const result = await handler(event)

    expect($fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: { title: 'Minimal' },
      }),
    )
    expect(result).toEqual({ data: { id: 2, title: 'Minimal' } })
  })

  it('should forward null body when readBody returns null', async () => {
    vi.mocked(getCookie).mockReturnValue('token')
    vi.mocked(readBody).mockResolvedValue(null)
    vi.mocked($fetch).mockResolvedValue({ data: {} })

    const event = { path: '/api/projects', node: { req: { method: 'POST' } } } as any
    await handler(event)

    expect($fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: null,
      }),
    )
  })
})
