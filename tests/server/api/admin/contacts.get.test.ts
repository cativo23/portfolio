import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockConfig = {
  apiBaseUrl: 'https://api.example.com',
  apiBasePath: '/v1'
}
vi.stubGlobal('useRuntimeConfig', () => mockConfig)

const mockGetCookie = vi.fn()
vi.stubGlobal('getCookie', mockGetCookie)
vi.stubGlobal('getQuery', () => ({ search: 'test' }))

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)
vi.stubGlobal('defineEventHandler', (handler: any) => handler)

describe('Admin API - Contacts', () => {
  let handler: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const module = await import('~/server/api/admin/contacts.get')
    handler = module.default
  })

  it('fetches contacts with auth cookie', async () => {
    mockGetCookie.mockReturnValue('valid-token')
    mockFetch.mockResolvedValue({ data: [] })

    const event = {} as any
    const result = await handler(event)

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/v1/contacts', {
      method: 'GET',
      headers: { Authorization: 'Bearer valid-token' },
      query: { search: 'test' }
    })
    expect(result).toEqual({ data: [] })
  })

  it('fetches contacts with empty auth cookie if not present', async () => {
    mockGetCookie.mockReturnValue(undefined)
    mockFetch.mockResolvedValue({ data: [] })

    const event = {} as any
    await handler(event)

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/v1/contacts', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' },
      query: { search: 'test' }
    })
  })
})
