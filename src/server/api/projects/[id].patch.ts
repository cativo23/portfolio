export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const cookie = getCookie(event, 'admin_token')

  const body = await readBody(event)

  return $fetch(`${config.apiBaseUrl}${config.apiBasePath}/projects/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${cookie ?? ''}` },
    body,
  })
})
