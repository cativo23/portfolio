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

// Cached handler wrapper — ignore cache options, return the raw handler.
vi.stubGlobal('defineCachedEventHandler', (handler: any) => handler)

/** Default happy-path routing for every upstream signal.get talks to. */
function defaultRoute(url: string) {
  if (url.includes('/infra/stats')) {
    return Promise.resolve({ status: 'success', data: { containers: 20, stacks: 12 } })
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
    mockFetch.mockImplementation((url: string) => defaultRoute(url))
    const module = await import('~/server/api/signal.get')
    handler = module.default
  })

  it('exposes the live npm package count from the registry', async () => {
    const result = await handler({} as any)
    expect(result.data.npm.packages).toBe(4)
  })

  it('exposes live container/stack counts from portfolio-api', async () => {
    const result = await handler({} as any)
    expect(result.data.infra).toEqual({ containers: 20, stacks: 12 })
  })

  it('degrades infra counts to null when the endpoint fails', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/infra/stats')) return Promise.reject(new Error('ECONNREFUSED'))
      return defaultRoute(url)
    })
    const result = await handler({} as any)
    expect(result.data.infra).toEqual({ containers: null, stacks: null })
  })

  it('falls back to 0 packages when the registry search fails', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('registry.npmjs.org/-/v1/search')) {
        return Promise.reject(new Error('timeout'))
      }
      return defaultRoute(url)
    })
    const result = await handler({} as any)
    expect(result.data.npm.packages).toBe(0)
  })
})
