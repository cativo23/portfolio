import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockConfig = {
  apiBaseUrl: 'https://api.example.com',
  apiBasePath: '/api/v1',
}
vi.stubGlobal('useRuntimeConfig', () => mockConfig)

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

const mockGetRequestIP = vi.fn()
vi.stubGlobal('getRequestIP', mockGetRequestIP)

describe('apiFetch helper', () => {
  let apiFetch: (typeof import('~/server/utils/api'))['apiFetch']
  const event = { __isEvent: true } as never

  beforeEach(async () => {
    vi.clearAllMocks()
    mockGetRequestIP.mockReturnValue('203.0.113.7')
    mockFetch.mockResolvedValue({ ok: true })
    apiFetch = (await import('~/server/utils/api')).apiFetch
  })

  it('composes the versioned URL by default and forwards the client IP', async () => {
    await apiFetch(event, '/projects', {
      method: 'GET',
      headers: { 'x-api-key': 'k' },
    })

    expect(mockGetRequestIP).toHaveBeenCalledWith(event, { xForwardedFor: true })
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/api/v1/projects', {
      method: 'GET',
      headers: { 'x-api-key': 'k', 'x-forwarded-for': '203.0.113.7' },
    })
  })

  it('omits the base path when basePath is false', async () => {
    await apiFetch(event, '/health', { method: 'GET', basePath: false })

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/health', {
      method: 'GET',
      headers: { 'x-forwarded-for': '203.0.113.7' },
    })
  })

  it('forwards a single X-Forwarded-For value and never leaks the basePath flag downstream', async () => {
    await apiFetch(event, '/chat', { method: 'POST', body: { q: 1 } })

    const [, opts] = mockFetch.mock.calls[0]
    expect(opts).not.toHaveProperty('basePath')
    expect(opts.headers['x-forwarded-for']).toBe('203.0.113.7')
  })

  it('omits X-Forwarded-For when the client IP cannot be resolved', async () => {
    mockGetRequestIP.mockReturnValue(undefined)

    await apiFetch(event, '/profile', { method: 'GET', headers: { foo: 'bar' } })

    const [, opts] = mockFetch.mock.calls[0]
    expect(opts.headers).toEqual({ foo: 'bar' })
    expect(opts.headers).not.toHaveProperty('x-forwarded-for')
  })
})
