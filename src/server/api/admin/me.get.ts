import { apiFetch } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, 'admin_token')

  if (!cookie) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cookie}`,
  }

  return apiFetch(event, `/auth/profile`, {
    method: 'GET',
    headers,
  })
})
