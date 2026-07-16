import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockConfig = {
  githubToken: '',
  apiBaseUrl: 'https://api.example.com',
  apiBasePath: '/api/v1',
}
vi.stubGlobal('useRuntimeConfig', () => mockConfig)
vi.stubGlobal('getRequestIP', () => undefined)

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

// Cached handler wrapper — capture the cache options (asserted below), return the raw handler.
let cachedOpts: Record<string, unknown> | undefined
vi.stubGlobal('defineCachedEventHandler', (handler: any, opts: Record<string, unknown>) => {
  cachedOpts = opts
  return handler
})

/** Default happy-path routing for every upstream signal.get talks to. */
function defaultRoute(url: string) {
  if (url.includes('/infra/stats')) {
    return Promise.resolve({ status: 'success', data: { services: 17, stacks: 12 } })
  }
  if (url.includes('registry.npmjs.org/-/v1/search')) {
    return Promise.resolve({ objects: [{}, {}, {}, {}] }) // 4 packages
  }
  if (url.includes('api.npmjs.org/downloads')) {
    return Promise.resolve({ downloads: 0 })
  }
  if (url.includes('api.github.com/graphql')) {
    return Promise.resolve({ data: { user: null } })
  }
  if (url.includes('api.github.com/users')) {
    return Promise.resolve({ public_repos: 42 })
  }
  // api health root
  return Promise.resolve({ data: { version: '2.13.0', status: 'operational' } })
}

describe('Signal API', () => {
  let handler: any

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules() // isolate the dynamic import so no module state leaks between tests
    mockFetch.mockImplementation((url: string) => defaultRoute(url))
    const module = await import('~/server/api/signal.get')
    handler = module.default
  })

  it('exposes the live npm package count from the registry', async () => {
    const result = await handler({} as any)
    expect(result.data.npm.packages).toBe(4)
  })

  it('caches server-side for an hour but uses SWR so the browser is not pinned to a stale copy', async () => {
    // swr:true makes Nitro emit `s-maxage` + `stale-while-revalidate` (shared-cache
    // only) instead of a private `max-age`, so returning visitors revalidate rather
    // than replaying a stale payload for an hour. Guards the LIVE-freshness fix.
    expect(cachedOpts).toMatchObject({ maxAge: 60 * 60, swr: true })
  })

  it('exposes live service/stack counts from portfolio-api', async () => {
    const result = await handler({} as any)
    expect(result.data.infra).toEqual({ services: 17, stacks: 12 })
  })

  it('requests the infra endpoint under the versioned /api/v1 prefix', async () => {
    await handler({} as any)
    // The endpoint lives behind portfolio-api's global /api/v1 prefix; a bare
    // /infra/stats 404s in prod. Assert the composed URL includes the prefix.
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/api/v1/infra/stats',
      expect.anything()
    )
  })

  it('degrades infra counts to null when the endpoint fails', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/infra/stats')) return Promise.reject(new Error('ECONNREFUSED'))
      return defaultRoute(url)
    })
    const result = await handler({} as any)
    expect(result.data.infra).toEqual({ services: null, stacks: null })
  })

  it('degrades package count to null when the registry search fails', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('registry.npmjs.org/-/v1/search')) {
        return Promise.reject(new Error('timeout'))
      }
      return defaultRoute(url)
    })
    const result = await handler({} as any)
    expect(result.data.npm.packages).toBeNull()
  })

  it('degrades package count to null on a malformed registry response', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('registry.npmjs.org/-/v1/search')) {
        return Promise.resolve({ objects: null }) // no usable objects array
      }
      return defaultRoute(url)
    })
    const result = await handler({} as any)
    expect(result.data.npm.packages).toBeNull()
  })
})
