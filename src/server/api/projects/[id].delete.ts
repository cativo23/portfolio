import { apiFetch } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const cookie = getCookie(event, 'admin_token')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing project ID' })
  }

  return apiFetch(event, `/projects/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${cookie ?? ''}` },
  })
})
