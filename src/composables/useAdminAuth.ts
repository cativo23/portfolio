import { ref, computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'

interface AdminUser {
  id: number
  email: string
  username: string
}

interface UseAdminAuthReturn {
  isAuthenticated: ComputedRef<boolean>
  user: Ref<AdminUser | null>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const user = ref<AdminUser | null>(null)

// Fix #1: Rehydrate user from cookie on init — after page refresh the module-scoped ref is lost
let initialized = false
async function ensureInitialized() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  try {
    const me = await $fetch<AdminUser>('/api/admin/me')
    if (me) user.value = me
  } catch {
    // No valid session — leave user as null
  }
}

// Run init check once on client side
if (typeof window !== 'undefined') {
  ensureInitialized()
}

export function useAdminAuth(): UseAdminAuthReturn {
  async function login(email: string, password: string): Promise<boolean> {
    try {
      const response = await $fetch<{ status: string; user: AdminUser }>('/api/admin/login', {
        method: 'POST',
        body: { email, password },
      })

      if (response.status === 'success' && response.user) {
        user.value = response.user
        return true
      }
      return false
    } catch {
      return false
    }
  }

  async function logout() {
    user.value = null
    // Fix #2: Call server logout to clear httpOnly cookie before redirecting
    try {
      await $fetch('/api/admin/logout', { method: 'POST' })
    } catch {
      // Continue redirect even if logout call fails
    }
    navigateTo('/admin/login')
  }

  return {
    isAuthenticated: computed(() => !!user.value),
    user,
    login,
    logout,
  }
}
