export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // Honeypot check — reject if hidden 'website' field is filled
  if (body.website && body.website.trim().length > 0) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
  }

  // Server-side validation
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Name is required' })
  }
  if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
    throw createError({ statusCode: 400, statusMessage: 'Valid email is required' })
  }
  if (!body.message || typeof body.message !== 'string' || body.message.trim().length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Message is required' })
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
      name: body.name.trim().slice(0, 255),
      email: body.email.trim().slice(0, 255),
      message: body.message.trim().slice(0, 10000),
      subject: body.subject?.trim().slice(0, 255) ?? '',
    },
  })

  return data
})
