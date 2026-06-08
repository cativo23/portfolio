import { apiFetch } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
  }

  // Honeypot — reject if hidden 'website' field is filled
  if (body.website && String(body.website).trim().length > 0) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
  }

  const question = typeof body.question === 'string' ? body.question.trim() : ''
  if (question.length < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Question is required' })
  }

  // Multi-turn context: keep only well-formed user/assistant turns, cap content
  // length and turn count to the API's limits. The backend re-validates and
  // sanitizes, so this is just to avoid forwarding obvious junk.
  // Bound the array length BEFORE iterating, so a client can't force a large
  // filter pass with a giant array (the backend's ArrayMaxSize is a separate
  // validation layer, not an upstream size guard). Keep the most recent.
  const rawHistory = (Array.isArray(body.history) ? body.history : []).slice(-20)
  const history = rawHistory
    .filter(
      (m: unknown): m is { role: string; content: string } =>
        !!m &&
        typeof m === 'object' &&
        ((m as { role?: unknown }).role === 'user' ||
          (m as { role?: unknown }).role === 'assistant') &&
        typeof (m as { content?: unknown }).content === 'string',
    )
    .slice(-6)
    .map((m: { role: string; content: string }) => ({ role: m.role, content: m.content.slice(0, 2000) }))

  try {
    // /chat is a public endpoint — no API key is attached.
    return await apiFetch(event, `/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { question: question.slice(0, 500), history },
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
