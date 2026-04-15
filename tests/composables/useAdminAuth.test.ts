import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('login', () => {
    it('returns true and stores user on successful login', async () => {
      vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve({
        status: 'success',
        user: { id: 1, email: 'admin@test.com', username: 'admin' },
      })))

      const { isAuthenticated, login } = useAdminAuth()
      expect(isAuthenticated.value).toBe(false)

      const result = await login('admin@test.com', 'secret')

      expect(result).toBe(true)
      expect(isAuthenticated.value).toBe(true)
    })

    it('returns false on invalid credentials', async () => {
      vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve({
        status: 'error',
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
        user: { id: 1, email: 'admin@test.com', username: 'admin' },
      })))

      const { login, logout, isAuthenticated } = useAdminAuth()
      await login('admin@test.com', 'secret')
      expect(isAuthenticated.value).toBe(true)

      logout()

      expect(isAuthenticated.value).toBe(false)
      expect(navigateTo).toHaveBeenCalledWith('/admin/login')
    })
  })
})
