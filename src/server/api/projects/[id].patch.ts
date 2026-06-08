import { apiFetch } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const cookie = getCookie(event, 'admin_token')

  const body = await readBody(event)

  return apiFetch(event, `/projects/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${cookie ?? ''}` },
    body,
  })
})
