export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing contact ID' })
  const cookie = getCookie(event, 'admin_token')

  return $fetch(`${config.apiBaseUrl}${config.apiBasePath}/contacts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${cookie ?? ''}` },
  })
})
