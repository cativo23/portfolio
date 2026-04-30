import { describe, it, expect, vi, beforeEach } from 'vitest'
import { computed, ref } from 'vue'

const cookieStore: Record<string, any> = {}

globalThis.computed = computed
globalThis.ref = ref
globalThis.useCookie = vi.fn((key: string) => ({
  get value() { return cookieStore[key] },
  set value(v: any) { cookieStore[key] = v },
}))
globalThis.navigateTo = vi.fn(() => {})

const { useAdminAuth } = await import('~/composables/useAdminAuth')

describe('useAdminAuth', () => {
  beforeEach(() => {
    Object.keys(cookieStore).forEach(k => delete cookieStore[k])
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('returns true and stores user on successful login', async () => {
      globalThis.$fetch = vi.fn(() => Promise.resolve({
        status: 'success',
        user: { id: 1, email: 'admin@test.com', username: 'admin' },
      }))

      const { isAuthenticated, login } = useAdminAuth()
      expect(isAuthenticated.value).toBe(false)

      const result = await login('admin@test.com', 'secret')

      expect(result).toBe(true)
      expect(isAuthenticated.value).toBe(true)
    })

    it('returns false on invalid credentials', async () => {
      globalThis.$fetch = vi.fn(() => Promise.resolve({
        status: 'error',
      }))

      const { login } = useAdminAuth()
      const result = await login('wrong@test.com', 'wrong')

      expect(result).toBe(false)
    })

    it('returns false on network error', async () => {
      globalThis.$fetch = vi.fn(() => Promise.reject(new Error('Network error')))

      const { login } = useAdminAuth()
      const result = await login('admin@test.com', 'secret')

      expect(result).toBe(false)
    })
  })

  describe('logout', () => {
    it('clears user and navigates to login', async () => {
      globalThis.$fetch = vi.fn(() => Promise.resolve({
        status: 'success',
        user: { id: 1, email: 'admin@test.com', username: 'admin' },
      }))

      const { login, logout, isAuthenticated } = useAdminAuth()
      await login('admin@test.com', 'secret')
      expect(isAuthenticated.value).toBe(true)

      logout()

      expect(isAuthenticated.value).toBe(false)
      expect(globalThis.navigateTo).toHaveBeenCalledWith('/admin/login')
    })
  })
})
