import { ref } from 'vue'
import type { ComputedRef } from 'vue'

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
  user: ComputedRef<AdminUser | null>
  token: ComputedRef<string | null>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loadFromCookie: () => void
}

const token = ref<string | null>(null)
const user = ref<AdminUser | null>(null)

export function useAdminAuth(): UseAdminAuthReturn {
  const isAuthenticated = computed(() => !!token.value)
  const userComputed = computed(() => user.value)
  const tokenComputed = computed(() => token.value)

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const response = await $fetch<{ status: string; data: LoginResponse }>('/api/admin/login', {
        method: 'POST',
        body: { email, password },
      })

      if (response.status === 'success' && response.data?.access_token) {
        token.value = response.data.access_token
        user.value = response.data.user

        useCookie('admin_token', { maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' }).value = token.value
        useCookie('admin_user', { maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' }).value = JSON.stringify(user.value)

        return true
      }
      return false
    } catch {
      return false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    useCookie('admin_token').value = null
    useCookie('admin_user').value = null
    navigateTo('/admin/login')
  }

  function loadFromCookie() {
    const tokenCookie = useCookie('admin_token').value
    const userCookie = useCookie('admin_user').value
    if (tokenCookie) token.value = tokenCookie
    if (userCookie) {
      try {
        user.value = JSON.parse(userCookie)
      } catch {
        user.value = null
      }
    }
  }

  return {
    isAuthenticated,
    user: userComputed,
    token: tokenComputed,
    login,
    logout,
    loadFromCookie,
  }
}