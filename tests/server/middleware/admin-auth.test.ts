import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------- Nuxt auto-import stubs ----------
vi.stubGlobal('defineEventHandler', vi.fn((handler: Function) => handler))
vi.stubGlobal('getCookie', vi.fn(() => undefined))
vi.stubGlobal('createError', vi.fn((opts: any) => {
  const err: any = new Error(opts.statusMessage ?? 'Error')
  err.statusCode = opts.statusCode
  return err
}))

// ---------- Import middleware after stubs are set up ----------
const { default: middleware } = await import('~/server/middleware/admin-auth')

function createEvent(path: string) {
  return { path } as any
}

describe('admin-auth middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ---------- Pass-through for non-admin routes ----------

  it('should skip non-admin routes', async () => {
    const event = createEvent('/api/projects')
    const result = await middleware(event)

    expect(result).toBeUndefined()
    expect(getCookie).not.toHaveBeenCalled()
  })

  it('should skip the login endpoint', async () => {
    const event = createEvent('/api/admin/login')
    const result = await middleware(event)

    expect(result).toBeUndefined()
    expect(getCookie).not.toHaveBeenCalled()
  })

  // ---------- Auth enforcement ----------

  it('should throw 401 when admin_token cookie is missing', async () => {
    vi.mocked(getCookie).mockReturnValue(undefined)
    const event = createEvent('/api/admin/contacts')

    await expect(middleware(event)).rejects.toThrow('Unauthorized')

    expect(createError).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 }),
    )
  })

  it('should allow request when admin_token cookie is present', async () => {
    vi.mocked(getCookie).mockReturnValue('valid-token')
    const event = createEvent('/api/admin/contacts')

    const result = await middleware(event)

    expect(result).toBeUndefined()
    expect(getCookie).toHaveBeenCalledWith(event, 'admin_token')
  })

  it('should throw 401 for nested admin routes without cookie', async () => {
    vi.mocked(getCookie).mockReturnValue(undefined)
    const event = createEvent('/api/admin/users/42')

    await expect(middleware(event)).rejects.toThrow('Unauthorized')
  })

  // ---------- LOW #14: Malformed / empty token scenarios ----------
  // The current middleware only checks for cookie presence (truthy check).
  // These tests document that malformed tokens are accepted at this layer —
  // actual JWT validation happens upstream. If JWT verification is added to
  // this middleware in the future, these tests should be updated to expect 401.

  it('should allow request with malformed token (validation is upstream)', async () => {
    vi.mocked(getCookie).mockReturnValue('invalidjwt')
    const event = createEvent('/api/admin/contacts')

    const result = await middleware(event)

    // Middleware only checks presence, not validity — request passes through
    expect(result).toBeUndefined()
    expect(getCookie).toHaveBeenCalledWith(event, 'admin_token')
  })

  it('should throw 401 when token is an empty string', async () => {
    vi.mocked(getCookie).mockReturnValue('')
    const event = createEvent('/api/admin/contacts')

    // Empty string is falsy, so middleware treats it as missing
    await expect(middleware(event)).rejects.toThrow('Unauthorized')
    expect(createError).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 }),
    )
  })

  // ---------- HIGH #3: Path-confusion bypass scenarios ----------

  describe('path-confusion bypass prevention', () => {
    it('should reject path traversal: /api/admin/../admin/users', async () => {
      // The middleware checks event.path with startsWith('/api/admin/').
      // A path like /api/admin/../admin/users still starts with /api/admin/
      // so the middleware WILL run and enforce auth.
      vi.mocked(getCookie).mockReturnValue(undefined)
      const event = createEvent('/api/admin/../admin/users')

      await expect(middleware(event)).rejects.toThrow('Unauthorized')
    })

    it('should not intercept URL-encoded admin path: /api/admin%2Fusers', async () => {
      // URL-encoded slash (%2F) means the path is literally "/api/admin%2Fusers"
      // which does NOT start with "/api/admin/" — the middleware skips it.
      // This is safe because the Nitro router won't match it to an admin
      // handler either; no admin handler is exposed.
      vi.mocked(getCookie).mockReturnValue(undefined)
      const event = createEvent('/api/admin%2Fusers')

      const result = await middleware(event)

      // Middleware skips — no cookie check, no error thrown
      expect(result).toBeUndefined()
      expect(getCookie).not.toHaveBeenCalled()
    })

    it('should enforce auth for trailing-slash admin path: /api/admin/', async () => {
      // "/api/admin/" starts with "/api/admin/" so the middleware runs.
      vi.mocked(getCookie).mockReturnValue(undefined)
      const event = createEvent('/api/admin/')

      await expect(middleware(event)).rejects.toThrow('Unauthorized')
    })

    it('should enforce auth for /api/admin/Users (case variation in segment)', async () => {
      // "/api/admin/Users" starts with "/api/admin/" so the middleware runs.
      vi.mocked(getCookie).mockReturnValue(undefined)
      const event = createEvent('/api/admin/Users')

      await expect(middleware(event)).rejects.toThrow('Unauthorized')
    })

    it('should not intercept /api/ADMIN/users (case variation in "admin")', async () => {
      // startsWith is case-sensitive: "/api/ADMIN/users" does NOT match
      // "/api/admin/". This is safe because Nitro's file-based routing is
      // also case-sensitive, so /api/ADMIN/users won't resolve to any
      // admin handler.
      vi.mocked(getCookie).mockReturnValue(undefined)
      const event = createEvent('/api/ADMIN/users')

      const result = await middleware(event)

      expect(result).toBeUndefined()
      expect(getCookie).not.toHaveBeenCalled()
    })

    it('should not intercept paths that share a prefix: /api/admin-panel', async () => {
      // "/api/admin-panel" does NOT start with "/api/admin/" (note the
      // trailing slash check) so it correctly skips.
      vi.mocked(getCookie).mockReturnValue(undefined)
      const event = createEvent('/api/admin-panel')

      const result = await middleware(event)

      expect(result).toBeUndefined()
      expect(getCookie).not.toHaveBeenCalled()
    })

    it('should enforce auth for double-slash path: /api/admin//users', async () => {
      // "/api/admin//users" starts with "/api/admin/" so middleware runs.
      vi.mocked(getCookie).mockReturnValue(undefined)
      const event = createEvent('/api/admin//users')

      await expect(middleware(event)).rejects.toThrow('Unauthorized')
    })
  })
})
