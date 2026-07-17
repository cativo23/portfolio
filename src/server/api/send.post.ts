/**
 * Same-origin proxy for Umami's event collector (`/api/send`).
 *
 * The tracker (served first-party from `/u.js`) POSTs events here; we forward
 * them to the internal Umami container. Two headers are LOAD-BEARING for Umami:
 *   - `user-agent`: Umami rejects events with no UA (400) and uses it, together
 *     with the IP, to derive the visitor/session hash. Must be the real client's.
 *   - `x-forwarded-for`: the real client IP (same leftmost-XFF reasoning as
 *     `server/utils/api.ts` — Traefik strips client XFF at the edge, so the value
 *     getRequestIP returns is trustworthy). Without it every visitor collapses
 *     into this container's IP and unique/session counts break.
 *
 * Degrades quietly (204) if Umami is unreachable so a tracking blip never
 * surfaces an error to the visitor.
 */
export default defineEventHandler(async (event) => {
  const { umamiUrl } = useRuntimeConfig(event)
  const body = await readRawBody(event)
  const clientIp = getRequestIP(event, { xForwardedFor: true })
  const userAgent = getHeader(event, 'user-agent')

  const headers: Record<string, string> = { 'content-type': 'application/json' }
  if (userAgent) headers['user-agent'] = userAgent
  if (clientIp) headers['x-forwarded-for'] = clientIp

  try {
    const res = await $fetch<string>(`${umamiUrl}/api/send`, {
      method: 'POST',
      headers,
      body,
      responseType: 'text',
      timeout: 5000,
    })
    return res
  } catch {
    setResponseStatus(event, 204)
    return null
  }
})
