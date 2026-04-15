import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockConfig = {
  apiToken: 'test-token',
  apiBaseUrl: 'https://api.example.com',
  apiBasePath: '/v1'
}
vi.stubGlobal('useRuntimeConfig', () => mockConfig)
vi.stubGlobal('getQuery', () => ({}))

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)
vi.stubGlobal('defineEventHandler', (handler: any) => handler)

describe('Projects API (GET)', () => {
  let handler: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const module = await import('~/server/api/projects.get')
    handler = module.default
  })

  it('fetches projects and normalizes techStack string to array', async () => {
    mockFetch.mockResolvedValue({
      data: [
        { id: 1, name: 'Project 1', techStack: 'Vue' }, // String tech stack
      ]
    })

    const result = await handler({} as any)

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/v1/projects', {
      method: 'GET',
      headers: { 'x-api-key': 'test-token' },
      query: {}
    })

    // Assert techStack was normalized to an array
    expect(result.data[0].techStack).toEqual(['Vue'])
  })

  it('leaves already array techStack unchanged', async () => {
    mockFetch.mockResolvedValue({
      data: [
        { id: 2, name: 'Project 2', techStack: ['React', 'Node'] },
      ]
    })

    const result = await handler({} as any)
    expect(result.data[0].techStack).toEqual(['React', 'Node'])
  })

  it('handles null/undefined techStack', async () => {
    mockFetch.mockResolvedValue({
      data: [
        { id: 3, name: 'Project 3' }, // No tech stack
      ]
    })

    const result = await handler({} as any)
    expect(result.data[0].techStack).toEqual([])
  })

  it('handles empty data response gracefully', async () => {
    mockFetch.mockResolvedValue({ data: [] })
    const result = await handler({} as any)
    expect(result.data).toEqual([])
  })

  it('handles non-array data response', async () => {
    mockFetch.mockResolvedValue({ data: null })
    const result = await handler({} as any)
    expect(result.data).toBeNull()
  })
})
