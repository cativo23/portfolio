import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockConfig = {
  apiToken: 'test-token',
  apiBaseUrl: 'https://api.example.com',
  apiBasePath: '/v1'
}
vi.stubGlobal('useRuntimeConfig', () => mockConfig)

let mockBody: any = {}
vi.stubGlobal('readBody', () => Promise.resolve(mockBody))

const mockCreateError = vi.fn((err) => err)
vi.stubGlobal('createError', mockCreateError)

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)
vi.stubGlobal('defineEventHandler', (handler: any) => handler)

describe('Contacts API (POST)', () => {
  let handler: any

  beforeEach(async () => {
    vi.clearAllMocks()
    mockBody = {}
    const module = await import('~/server/api/contacts.post')
    handler = module.default
  })

  it('successfully submits valid contact form', async () => {
    mockBody = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello there!',
      subject: 'Inquiry'
    }

    mockFetch.mockResolvedValue({ status: 'success' })

    const result = await handler({} as any)

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/v1/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'ApiKey test-token'
      },
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello there!',
        subject: 'Inquiry'
      }
    })

    expect(result).toEqual({ status: 'success' })
  })

  it('rejects submissions with honeypot field filled', async () => {
    mockBody = {
      name: 'Bot',
      email: 'bot@example.com',
      message: 'Spam',
      website: 'http://spam.com' // Honeypot
    }

    await expect(handler({} as any)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Bad Request'
    })

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('validates required name', async () => {
    mockBody = { email: 'john@example.com', message: 'Hi' }

    await expect(handler({} as any)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Name is required'
    })
  })

  it('validates required email format', async () => {
    mockBody = { name: 'John', email: 'notanemail', message: 'Hi' }

    await expect(handler({} as any)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Valid email is required'
    })
  })

  it('validates required message', async () => {
    mockBody = { name: 'John', email: 'john@example.com', message: '   ' }

    await expect(handler({} as any)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Message is required'
    })
  })

  it('trims and truncates long inputs to prevent abuse', async () => {
    const longString = 'A'.repeat(15000)
    mockBody = {
      name: '   John Doe   ',
      email: 'john@example.com',
      message: longString,
      subject: '   Subject   '
    }

    mockFetch.mockResolvedValue({ status: 'success' })

    await handler({} as any)

    const callArgs = mockFetch.mock.calls[0][1]
    expect(callArgs.body.name).toBe('John Doe')
    expect(callArgs.body.message.length).toBe(10000) // Truncated to 10k
    expect(callArgs.body.subject).toBe('Subject')
  })
})
