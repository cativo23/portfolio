import type { H3Event } from 'h3'

type ApiFetchOptions = NonNullable<Parameters<typeof $fetch>[1]> & {
  /**
   * Prepend the versioned API base path (`config.apiBasePath`, e.g. `/api/v1`).
   * Defaults to `true`; pass `false` for unversioned endpoints such as `/` and
   * `/health`.
   */
  basePath?: boolean
}

/**
 * Centralized fetch for every BFF → backend API call.
 *
 * Composes the upstream URL from runtime config (`apiBaseUrl` + optional
 * `apiBasePath`) so the base location lives in exactly one place instead of
 * being duplicated across every server route.
 *
 * Forwards the real client IP to the backend so its per-IP rate limit keys on
 * the visitor instead of this BFF container's IP — without it every visitor's
 * request reaches the API from one address and the throttle collapses into a
 * single shared bucket.
 */
export function apiFetch<T = unknown>(
  event: H3Event,
  path: string,
  opts: ApiFetchOptions = {},
): Promise<T> {
  const config = useRuntimeConfig()
  const { basePath = true, headers, ...rest } = opts
  const base = basePath
    ? `${config.apiBaseUrl}${config.apiBasePath}`
    : config.apiBaseUrl

  // getRequestIP returns the leftmost X-Forwarded-For entry, which is the true
  // client ONLY because the edge proxy (Traefik) strips client-supplied XFF and
  // rewrites it with the real connection IP. The BFF→API hop is internal and
  // bypasses Traefik, so this single clean value is what the backend reads
  // (trust proxy = 1 hop). LOAD-BEARING: do not enable forwardedHeaders/insecure
  // on the Traefik edge without re-checking this — it would make XFF spoofable.
  const clientIp = getRequestIP(event, { xForwardedFor: true })
  const mergedHeaders: Record<string, string> = {
    ...(headers as Record<string, string> | undefined),
    ...(clientIp ? { 'x-forwarded-for': clientIp } : {}),
  }

  // $fetch in the Nitro server context returns Nitro's TypedInternalResponse
  // wrapper; for our external JSON calls that resolves to T at runtime.
  return $fetch<T>(`${base}${path}`, { ...rest, headers: mergedHeaders }) as Promise<T>
}
