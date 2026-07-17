/**
 * Same-origin proxy for the Umami tracker script.
 *
 * Serving the tracker from cativo.dev itself (instead of analytics.cativo.dev)
 * keeps the site's strict CSP `connect-src 'self'` intact and makes the request
 * first-party, so ad-blockers that target known analytics hosts don't drop it.
 * The browser derives the event-collector origin from this script's own URL, so
 * it POSTs to `/api/send` on cativo.dev — proxied to Umami by `api/send.post.ts`.
 *
 * Degrades to an empty (200) script if Umami is unreachable (e.g. local dev,
 * where the `umami` container isn't on the network) so the page never errors.
 */
export default defineEventHandler(async (event) => {
  const { umamiUrl } = useRuntimeConfig(event)
  setResponseHeader(event, 'content-type', 'application/javascript; charset=utf-8')
  // Modest cache; the tracker changes only on an Umami upgrade.
  setResponseHeader(event, 'cache-control', 'public, max-age=3600')

  try {
    const script = await $fetch<string>(`${umamiUrl}/script.js`, {
      responseType: 'text',
      timeout: 5000,
    })
    return script
  } catch {
    // No tracker rather than a 500 — analytics is decorative, never load-bearing.
    return '/* analytics unavailable */'
  }
})
