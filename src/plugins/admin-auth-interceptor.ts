export default defineNuxtPlugin((nuxtApp) => {
  const apiFetch = $fetch.create({
    onResponseError({ response, request }) {
      const urlString = typeof request === 'string' ? request : request?.toString?.() ?? ''
      if (response?.status === 401 && urlString.includes('/api/admin/')) {
        const tokenCookie = useCookie('admin_token')
        tokenCookie.value = null
        if (typeof window !== 'undefined') {
          navigateTo('/admin/login', { replace: true })
        }
      }
    },
  })

  // Replace global $fetch so all useFetch/$fetch calls get the interceptor
  nuxtApp.$fetch = apiFetch
})
