export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie('admin_token').value

  // If going to login and already authenticated, redirect to dashboard
  if (to.path === '/admin/login') {
    if (token && typeof window !== 'undefined') {
      try {
        await $fetch('/api/admin/me')
        return navigateTo('/admin', { redirectCode: 302 })
      } catch {
        useCookie('admin_token').value = null
        useCookie('admin_user').value = null
        return
      }
    }
    return
  }

  // All other /admin routes require valid token
  if (to.path.startsWith('/admin')) {
    if (!token) {
      return navigateTo('/admin/login', { redirectCode: 302 })
    }

    // Validate token against API only on client-side
    if (typeof window !== 'undefined') {
      try {
        await $fetch('/api/admin/me')
      } catch {
        useCookie('admin_token').value = null
        useCookie('admin_user').value = null
        return navigateTo('/admin/login', { redirectCode: 302 })
      }
    }
  }
})
