import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockConfig = {
  apiBaseUrl: 'https://api.example.com',
  apiBasePath: '/v1'
}
vi.stubGlobal('useRuntimeConfig', () => mockConfig)

const mockGetCookie = vi.fn()
vi.stubGlobal('getCookie', mockGetCookie)

let mockBody: any = {}
vi.stubGlobal('readBody', () => Promise.resolve(mockBody))

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)
vi.stubGlobal('getRequestIP', () => undefined) // client-IP forwarding is covered in tests/server/utils/api.test.ts
vi.stubGlobal('defineEventHandler', (handler: any) => handler)

describe('Projects API (POST)', () => {
  let handler: any

  beforeEach(async () => {
    vi.clearAllMocks()
    mockBody = { name: 'New Project', slug: 'new-project' }
    const module = await import('~/server/api/projects.post')
    handler = module.default
  })

  it('creates project with auth cookie', async () => {
    mockGetCookie.mockReturnValue('valid-admin-token')
    mockFetch.mockResolvedValue({ status: 'success', data: { id: 1 } })

    const event = {} as any
    const result = await handler(event)

    expect(mockGetCookie).toHaveBeenCalledWith(event, 'admin_token')
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/v1/projects', {
      method: 'POST',
      headers: { Authorization: 'Bearer valid-admin-token' },
      body: mockBody
    })
    expect(result).toEqual({ status: 'success', data: { id: 1 } })
  })

  it('creates project with empty auth cookie if not present', async () => {
    mockGetCookie.mockReturnValue(undefined)
    mockFetch.mockResolvedValue({ status: 'success' })

    const event = {} as any
    await handler(event)

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/v1/projects', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' },
      body: mockBody
    })
  })
})
