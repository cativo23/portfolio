import { apiFetch } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing contact ID' })
  const cookie = getCookie(event, 'admin_token')

  return apiFetch(event, `/contacts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${cookie ?? ''}` },
  })
})
