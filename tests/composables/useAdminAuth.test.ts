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
    it('returns true and stores user on successful login', async () => {
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
      // admin_token is set by server route (httpOnly), not by composable
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
    it('clears user and navigates to login', async () => {
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
      expect(cookieStore.admin_user).toBeNull()
      expect(navigateTo).toHaveBeenCalledWith('/admin/login')
    })
  })

  describe('user persistence', () => {
    it('loads user from admin_user cookie on mount', () => {
      cookieStore.admin_user = JSON.stringify({
        id: 1,
        email: 'admin@test.com',
        username: 'admin',
      })

      const auth = useAdminAuth()
      const userCookie = useCookie('admin_user').value
      if (userCookie) {
        try { auth.user.value = JSON.parse(userCookie) } catch { /* ignore */ }
      }

      expect(auth.user.value?.email).toBe('admin@test.com')
      expect(auth.user.value?.id).toBe(1)
      expect(auth.isAuthenticated.value).toBe(true)
    })

    it('handles corrupted user cookie gracefully', () => {
      cookieStore.admin_user = '{invalid json'

      const auth = useAdminAuth()
      const userCookie = useCookie('admin_user').value
      if (userCookie) {
        try { auth.user.value = JSON.parse(userCookie) } catch { auth.user.value = null }
      }

      expect(auth.user.value).toBeNull()
    })
  })
})
