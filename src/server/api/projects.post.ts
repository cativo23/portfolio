export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cookie = getCookie(event, 'admin_token')

  const body = await readBody(event)

  return $fetch(`${config.apiBaseUrl}${config.apiBasePath}/projects`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cookie ?? ''}` },
    body,
  })
})
