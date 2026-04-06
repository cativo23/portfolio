export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('admin_token').value

  // If going to /admin and not authenticated, redirect to login
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    if (!token) {
      return navigateTo('/admin/login', { redirectCode: 302 })
    }
  }

  // If going to login and already authenticated, redirect to dashboard
  if (to.path === '/admin/login' && token) {
    return navigateTo('/admin', { redirectCode: 302 })
  }
})
