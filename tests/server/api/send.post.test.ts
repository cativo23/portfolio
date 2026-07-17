import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockConfig = { umamiUrl: 'http://umami:3000' }
vi.stubGlobal('useRuntimeConfig', () => mockConfig)
vi.stubGlobal('defineEventHandler', (fn: any) => fn)

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)
const mockReadRawBody = vi.fn()
vi.stubGlobal('readRawBody', mockReadRawBody)
const mockGetRequestIP = vi.fn()
vi.stubGlobal('getRequestIP', mockGetRequestIP)
const mockGetHeader = vi.fn()
vi.stubGlobal('getHeader', mockGetHeader)
const mockSetResponseStatus = vi.fn()
vi.stubGlobal('setResponseStatus', mockSetResponseStatus)

describe('POST /api/send — Umami collector proxy', () => {
  let handler: any
  const event = { __isEvent: true } as never

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()
    mockReadRawBody.mockResolvedValue('{"type":"event"}')
    mockGetRequestIP.mockReturnValue('203.0.113.7')
    mockGetHeader.mockReturnValue('Mozilla/5.0 (test)')
    mockFetch.mockResolvedValue('ok-token')
    handler = (await import('~/server/api/send.post')).default
  })

  it('forwards the event to Umami with the real client IP and user-agent', async () => {
    const res = await handler(event)

    expect(res).toBe('ok-token')
    expect(mockGetRequestIP).toHaveBeenCalledWith(event, { xForwardedFor: true })
    const [url, opts] = mockFetch.mock.calls[0]
    expect(url).toBe('http://umami:3000/api/send')
    expect(opts.method).toBe('POST')
    expect(opts.body).toBe('{"type":"event"}')
    expect(opts.headers['user-agent']).toBe('Mozilla/5.0 (test)')
    expect(opts.headers['x-forwarded-for']).toBe('203.0.113.7')
  })

  it('omits x-forwarded-for and user-agent when they cannot be resolved', async () => {
    mockGetRequestIP.mockReturnValue(undefined)
    mockGetHeader.mockReturnValue(undefined)

    await handler(event)

    const [, opts] = mockFetch.mock.calls[0]
    expect(opts.headers).not.toHaveProperty('x-forwarded-for')
    expect(opts.headers).not.toHaveProperty('user-agent')
    expect(opts.headers['content-type']).toBe('application/json')
  })

  it('degrades to 204 (never errors the visitor) when Umami is unreachable', async () => {
    mockFetch.mockRejectedValue(new Error('ECONNREFUSED'))

    const res = await handler(event)

    expect(res).toBeNull()
    expect(mockSetResponseStatus).toHaveBeenCalledWith(event, 204)
  })
})
