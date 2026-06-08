import { apiFetch } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const cookie = getCookie(event, 'admin_token')

  return apiFetch(event, `/contacts`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${cookie ?? ''}` },
    query,
  })
})
