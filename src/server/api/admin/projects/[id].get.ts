import { apiFetch } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const cookie = getCookie(event, 'admin_token')

  const headers: Record<string, string> = {}
  if (cookie) {
    headers.Authorization = `Bearer ${cookie}`
  }

  return apiFetch(event, `/projects/${id}`, {
    method: 'GET',
    headers,
  })
})
