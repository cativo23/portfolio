export default defineNuxtPlugin((nuxtApp) => {
  const apiFetch = $fetch.create({
    onResponseError({ response, request }) {
      const urlString = typeof request === 'string' ? request : request?.toString?.() ?? ''
      if (response?.status === 401 && urlString.includes('/api/admin/')) {
        // Fix #2 (Critical): Cannot delete httpOnly cookie from JS — call server endpoint instead
        if (typeof window !== 'undefined') {
          $fetch('/api/admin/logout', { method: 'POST' }).catch(() => {})
          navigateTo('/admin/login', { replace: true })
        }
      }
    },
  })

  // Replace global $fetch so all useFetch/$fetch calls get the interceptor
  nuxtApp.$fetch = apiFetch
})
