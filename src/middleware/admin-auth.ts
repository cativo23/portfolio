export default defineNuxtRouteMiddleware(async (to) => {
  const isAdminLogin = to.path === '/admin/login'
  const isAdminRoute = to.path.startsWith('/admin')

  // SSR: read cookie from request headers (works with httpOnly)
  const isSSR = typeof window === 'undefined'
  let hasToken = false

  if (isSSR) {
    const headers = useRequestHeaders(['cookie'])
    hasToken = headers.cookie?.includes('admin_token=') ?? false
  }

  // If going to login and already authenticated, redirect to dashboard
  if (isAdminLogin) {
    if (hasToken) {
      return navigateTo('/admin', { redirectCode: 302 })
    }
    // On client, try validating against API
    if (typeof window !== 'undefined') {
      try {
        await $fetch('/api/admin/me')
        return navigateTo('/admin', { redirectCode: 302 })
      } catch {
        return
      }
    }
    return
  }

  // All other /admin routes require valid token
  if (isAdminRoute) {
    if (isSSR && !hasToken) {
      return navigateTo('/admin/login', { redirectCode: 302 })
    }

    // On client, validate token. Browser sends httpOnly cookie automatically.
    if (typeof window !== 'undefined') {
      try {
        await $fetch('/api/admin/me')
      } catch {
        return navigateTo('/admin/login', { redirectCode: 302 })
      }
    }
  }
})
