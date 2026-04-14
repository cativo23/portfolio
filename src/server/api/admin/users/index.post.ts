// Fix #5: RBAC gate — user management requires the same auth check as other admin routes.
// The upstream API should enforce role-level checks (e.g., super-admin) for user management.
// This proxy passes the httpOnly cookie for server-side validation.
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cookie = getCookie(event, 'admin_token')

  if (!cookie) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }

  const body = await readBody(event)

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  headers.Authorization = `Bearer ${cookie}`

  return $fetch(`${config.apiBaseUrl}${config.apiBasePath}/admin/users`, {
    method: 'POST',
    headers,
    body,
  })
})
