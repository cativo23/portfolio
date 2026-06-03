/**
 * CSP violation report sink (referenced by `report-uri` in the CSP).
 *
 * While the policy runs in report-only mode, browsers POST a violation report
 * here for anything the policy WOULD have blocked. We log them so we can refine
 * the directives before flipping `contentSecurityPolicyReportOnly` to false.
 *
 * Browsers send these as `Content-Type: application/csp-report`, which H3's
 * `readBody` will not auto-parse as JSON — so read the raw body and parse it
 * ourselves. Browsers fire-and-forget, so always answer 204 with no body.
 */
export default defineEventHandler(async (event) => {
  const raw = await readRawBody(event).catch(() => null)

  let report: Record<string, unknown> | null = null
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      // report-uri wraps it as { "csp-report": {...} }; report-to does not.
      report = (parsed['csp-report'] ?? parsed) as Record<string, unknown>
    } catch {
      report = null
    }
  }

  if (report) {
    const directive =
      report['violated-directive'] ?? report['effective-directive'] ?? '?'
    const blocked = report['blocked-uri'] ?? '?'
    // Log only the path of document-uri to avoid logging query strings.
    let docPath: string = String(report['document-uri'] ?? '?')
    try {
      docPath = new URL(docPath).pathname
    } catch {
      /* leave as-is */
    }
    console.warn('[CSP] violation:', directive, '-> blocked', blocked, '@', docPath)
  }

  setResponseStatus(event, 204)
  return null
})
