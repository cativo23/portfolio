import { apiFetch } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, 'admin_token')
  const id = getRouterParam(event, 'id')

  if (!id) throw createError({ statusCode: 400, statusMessage: 'User ID required' })

  const headers: Record<string, string> = {}
  if (cookie) headers.Authorization = `Bearer ${cookie}`

  return apiFetch(event, `/admin/users/${id}`, {
    method: 'DELETE',
    headers,
  })
})
