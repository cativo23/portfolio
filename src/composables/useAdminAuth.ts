import { ref, computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'

interface AdminUser {
  id: number
  email: string
  username: string
}

interface LoginResponse {
  access_token: string
  user: AdminUser
}

interface UseAdminAuthReturn {
  isAuthenticated: ComputedRef<boolean>
  user: Ref<AdminUser | null>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const user = ref<AdminUser | null>(null)

export function useAdminAuth(): UseAdminAuthReturn {
  async function login(email: string, password: string): Promise<boolean> {
    try {
      const response = await $fetch<{ status: string; data: LoginResponse }>('/api/admin/login', {
        method: 'POST',
        body: { email, password },
      })

      if (response.status === 'success' && response.data?.access_token) {
        user.value = response.data.user

        useCookie('admin_user', {
          maxAge: 60 * 60 * 24 * 7,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        }).value = JSON.stringify(user.value)

        return true
      }
      return false
    } catch {
      return false
    }
  }

  function logout() {
    user.value = null
    useCookie('admin_user').value = null
    // admin_token is httpOnly — cleared by calling the logout endpoint
    navigateTo('/admin/login')
  }

  return {
    isAuthenticated: computed(() => !!user.value),
    user,
    login,
    logout,
  }
}
