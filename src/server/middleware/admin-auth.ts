export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/admin/')) return

  // Login endpoint must remain public
  if (event.path === '/api/admin/login') return

  const cookie = getCookie(event, 'admin_token')
  if (!cookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
})
