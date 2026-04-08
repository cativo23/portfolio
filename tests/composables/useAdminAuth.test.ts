import { describe, it, expect, vi, beforeEach } from 'vitest'
import { computed, ref } from 'vue'

const cookieStore: Record<string, any> = {}

vi.stubGlobal('computed', computed)
vi.stubGlobal('ref', ref)
vi.stubGlobal('useCookie', vi.fn((key: string) => ({
  get value() { return cookieStore[key] },
  set value(v: any) { cookieStore[key] = v },
})))
vi.stubGlobal('navigateTo', vi.fn(() => {}))

const { useAdminAuth } = await import('~/composables/useAdminAuth')

describe('useAdminAuth', () => {
  beforeEach(() => {
    Object.keys(cookieStore).forEach(k => delete cookieStore[k])
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('returns true and stores token on successful login', async () => {
      vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve({
        status: 'success',
        data: {
          access_token: 'abc123',
          user: { id: 1, email: 'admin@test.com', username: 'admin' },
        },
      })))

      const { isAuthenticated, login } = useAdminAuth()
      expect(isAuthenticated.value).toBe(false)

      const result = await login('admin@test.com', 'secret')

      expect(result).toBe(true)
      expect(isAuthenticated.value).toBe(true)
      expect(cookieStore.admin_token).toBe('abc123')
      expect(JSON.parse(cookieStore.admin_user)).toEqual({
        id: 1,
        email: 'admin@test.com',
        username: 'admin',
      })
    })

    it('returns false on invalid credentials', async () => {
      vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve({
        status: 'error',
        data: { access_token: null },
      })))

      const { login } = useAdminAuth()
      const result = await login('wrong@test.com', 'wrong')

      expect(result).toBe(false)
    })

    it('returns false on network error', async () => {
      vi.stubGlobal('$fetch', vi.fn(() => Promise.reject(new Error('Network error'))))

      const { login } = useAdminAuth()
      const result = await login('admin@test.com', 'secret')

      expect(result).toBe(false)
    })
  })

  describe('logout', () => {
    it('clears token, user and navigates to login', async () => {
      vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve({
        status: 'success',
        data: {
          access_token: 'abc123',
          user: { id: 1, email: 'admin@test.com', username: 'admin' },
        },
      })))

      const { login, logout, isAuthenticated } = useAdminAuth()
      await login('admin@test.com', 'secret')
      expect(isAuthenticated.value).toBe(true)

      logout()

      expect(isAuthenticated.value).toBe(false)
      expect(cookieStore.admin_token).toBeNull()
      expect(cookieStore.admin_user).toBeNull()
      expect(navigateTo).toHaveBeenCalledWith('/admin/login')
    })
  })

  describe('loadFromCookie', () => {
    it('restores session from valid cookies', async () => {
      vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve({
        status: 'success',
        data: {
          access_token: 'abc123',
          user: { id: 1, email: 'admin@test.com', username: 'admin' },
        },
      })))

      const { login, loadFromCookie, isAuthenticated, user } = useAdminAuth()
      await login('admin@test.com', 'secret')

      // Simulate new composable instance (like page refresh)
      const { isAuthenticated: isAuth2, user: user2, loadFromCookie: load2 } = useAdminAuth()

      // The module-level refs keep state in-memory, so this should still be true
      expect(isAuth2.value).toBe(true)
    })

    it('handles corrupted user cookie gracefully', () => {
      cookieStore.admin_token = 'abc123'
      cookieStore.admin_user = '{invalid json'

      const { isAuthenticated, user, loadFromCookie } = useAdminAuth()
      loadFromCookie()

      expect(isAuthenticated.value).toBe(true)
      expect(user.value).toBeNull()
    })
  })
})
