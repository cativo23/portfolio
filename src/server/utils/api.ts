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
 * Accepts the request `event` so the real client IP can be forwarded to the
 * backend (wired up separately) — without it, every visitor's request reaches
 * the API from the BFF container's IP and the backend's per-IP rate limit
 * collapses into a single shared bucket.
 */
export function apiFetch<T = unknown>(
  _event: H3Event,
  path: string,
  opts: ApiFetchOptions = {},
) {
  const config = useRuntimeConfig()
  const { basePath = true, headers, ...rest } = opts
  const base = basePath
    ? `${config.apiBaseUrl}${config.apiBasePath}`
    : config.apiBaseUrl

  return $fetch<T>(`${base}${path}`, { ...rest, headers })
}
