import { apiFetch } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, 'admin_token')

  const body = await readBody(event)

  return apiFetch(event, `/projects`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cookie ?? ''}` },
    body,
  })
})
