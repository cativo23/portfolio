export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const cookie = getCookie(event, 'admin_token')

  return $fetch(`${config.apiBaseUrl}${config.apiBasePath}/contacts`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${cookie ?? ''}` },
    query,
  })
})
