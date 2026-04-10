export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<{ email: string; password: string }>(event)

  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required',
    })
  }

  if (typeof body.email !== 'string' || typeof body.password !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid credentials format',
    })
  }

  const trimmedEmail = body.email.trim()
  if (!trimmedEmail.includes('@') || trimmedEmail.length > 255) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email address',
    })
  }

  const data = await $fetch(`${config.apiBaseUrl}${config.apiBasePath}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: trimmedEmail, password: body.password },
  })

  const isSecure = process.env.NODE_ENV === 'production'

  setCookie(event, 'admin_token', (data as any).access_token ?? data?.data?.access_token ?? '', {
    httpOnly: false,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return data
})
