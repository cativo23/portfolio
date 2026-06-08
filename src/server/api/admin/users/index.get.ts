import { apiFetch } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, 'admin_token')

  const headers: Record<string, string> = {}
  if (cookie) {
    headers.Authorization = `Bearer ${cookie}`
  }

  return apiFetch(event, `/admin/users`, {
    method: 'GET',
    headers,
  })
})
