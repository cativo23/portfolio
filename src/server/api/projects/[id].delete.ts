export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const cookie = getCookie(event, 'admin_token')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing project ID' })
  }

  return $fetch(`${config.apiBaseUrl}${config.apiBasePath}/projects/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${cookie ?? ''}` },
  })
})
