export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // Honeypot check — reject if hidden 'website' field is filled
  if (body.website && body.website.trim().length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (config.apiToken) {
    headers.Authorization = `ApiKey ${config.apiToken}`
  }

  const data = await $fetch(`${config.apiBaseUrl}${config.apiBasePath}/contacts`, {
    method: 'POST',
    headers,
    body: {
      name: body.name,
      email: body.email,
      message: body.message,
      subject: body.subject,
    },
  })

  return data
})
