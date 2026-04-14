// User management proxy — auth is enforced by server middleware on all /api/admin/* routes.
// The upstream API should enforce role-level checks (e.g., super-admin) for user management.
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // Forward the httpOnly cookie as Bearer token for upstream validation
  const cookie = getCookie(event, 'admin_token')
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (cookie) headers.Authorization = `Bearer ${cookie}`

  return $fetch(`${config.apiBaseUrl}${config.apiBasePath}/admin/users`, {
    method: 'POST',
    headers,
    body,
  })
})
