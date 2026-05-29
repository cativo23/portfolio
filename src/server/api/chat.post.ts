export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // Honeypot — reject if hidden 'website' field is filled
  if (body.website && String(body.website).trim().length > 0) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
  }

  const question = typeof body.question === 'string' ? body.question.trim() : ''
  if (question.length < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Question is required' })
  }

  try {
    // /chat is a public endpoint — no API key is attached.
    return await $fetch(`${config.apiBaseUrl}${config.apiBasePath}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { question: question.slice(0, 500) },
    })
  } catch (err) {
    const status =
      (err as { statusCode?: number; response?: { status?: number } })
        ?.statusCode ||
      (err as { response?: { status?: number } })?.response?.status ||
      502

    // Surface the meaningful states so the UI can react (rate limit, outage).
    if (status === 429) {
      throw createError({ statusCode: 429, statusMessage: 'Too Many Requests' })
    }
    if (status === 503) {
      throw createError({
        statusCode: 503,
        statusMessage: 'Assistant temporarily unavailable',
      })
    }
    throw createError({ statusCode: 502, statusMessage: 'Assistant error' })
  }
})
