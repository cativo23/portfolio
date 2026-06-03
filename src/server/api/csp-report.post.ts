/**
 * CSP violation report sink (referenced by `report-uri` in the CSP).
 *
 * While the policy runs in report-only mode, browsers POST a violation report
 * here for anything the policy WOULD have blocked. We log them so we can refine
 * the directives before flipping `contentSecurityPolicyReportOnly` to false.
 * Browsers fire-and-forget these, so always answer 204 with no body.
 */
export default defineEventHandler(async (event) => {
  // report-uri sends `application/csp-report`: { "csp-report": { ... } }.
  const body = await readBody(event).catch(() => null)
  const report = body?.['csp-report'] ?? body

  if (report) {
    const { 'violated-directive': directive, 'blocked-uri': blocked } = report
    console.warn('[CSP] violation:', directive ?? '?', '->', blocked ?? '?', report)
  }

  setResponseStatus(event, 204)
  return null
})
