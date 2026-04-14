import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockState = {
  toasts: [] as any[],
}

vi.stubGlobal('useToast', () => ({
  success: vi.fn((msg: string) => mockState.toasts.push({ type: 'success', message: msg })),
  error: vi.fn((msg: string) => mockState.toasts.push({ type: 'error', message: msg })),
  toasts: mockState.toasts,
}))

let lastFetchCall: { url: string; options: any } | null = null
vi.stubGlobal('$fetch', vi.fn((url: string, options?: any) => {
  lastFetchCall = { url, options }
  if (url === '/api/contacts') {
    if (mockState.contactsResponse) {
      return Promise.resolve(mockState.contactsResponse)
    }
    return Promise.resolve({ status: 'success' })
  }
  return Promise.reject(new Error('Not mocked'))
}))

const { useContactForm } = await import('~/composables/useContactForm')

describe('useContactForm', () => {
  beforeEach(() => {
    mockState.toasts = []
    lastFetchCall = null
    mockState.contactsResponse = undefined
  })

  describe('validateForm', () => {
    it('rejects empty form', () => {
      const { form, validateForm, error } = useContactForm()
      const result = validateForm()
      expect(result).toBe(false)
      expect(error.value).toContain('Name')
    })

    it('rejects name shorter than 2 chars', () => {
      const { form, validateForm, error } = useContactForm()
      form.value.name = 'A'
      form.value.email = 'test@test.com'
      form.value.message = 'This message is long enough to pass'
      expect(validateForm()).toBe(false)
      expect(error.value).toContain('Name must be between 2 and 100 characters')
    })

    it('rejects name longer than 100 chars', () => {
      const { form, validateForm, error } = useContactForm()
      form.value.name = 'A'.repeat(101)
      form.value.email = 'test@test.com'
      form.value.message = 'This message is long enough to pass'
      expect(validateForm()).toBe(false)
      expect(error.value).toContain('Name must be between 2 and 100 characters')
    })

    it('rejects invalid email', () => {
      const { form, validateForm, error } = useContactForm()
      form.value.name = 'Carlos'
      form.value.email = 'not-an-email'
      form.value.message = 'This message is long enough to pass'
      expect(validateForm()).toBe(false)
      expect(error.value).toContain('valid email')
    })

    it('rejects message shorter than 10 chars', () => {
      const { form, validateForm, error } = useContactForm()
      form.value.name = 'Carlos'
      form.value.email = 'test@test.com'
      form.value.message = 'Short'
      expect(validateForm()).toBe(false)
      expect(error.value).toContain('Message must be between 10 and 1000 characters')
    })

    it('rejects message longer than 1000 chars', () => {
      const { form, validateForm, error } = useContactForm()
      form.value.name = 'Carlos'
      form.value.email = 'test@test.com'
      form.value.message = 'A'.repeat(1001)
      expect(validateForm()).toBe(false)
      expect(error.value).toContain('Message must be between 10 and 1000 characters')
    })

    it('accepts valid form', () => {
      const { form, validateForm, error } = useContactForm()
      form.value.name = 'Carlos'
      form.value.email = 'carlos@example.com'
      form.value.message = 'This is a valid message long enough'
      expect(validateForm()).toBe(true)
      expect(error.value).toBeNull()
    })
  })

  describe('submitForm', () => {
    it('does not call API when validation fails', async () => {
      const { submitForm } = useContactForm()
      const result = await submitForm()
      expect(result.status).toBe('error')
      expect(lastFetchCall).toBeNull()
    })

    it('calls API with form data on valid submit', async () => {
      const { form, submitForm } = useContactForm()
      form.value.name = 'Carlos'
      form.value.email = 'carlos@example.com'
      form.value.message = 'This is a valid message long enough'
      form.value.subject = 'Test subject'

      await submitForm()

      expect(lastFetchCall).not.toBeNull()
      expect(lastFetchCall!.url).toBe('/api/contacts')
      expect(lastFetchCall!.options.method).toBe('POST')
      expect(lastFetchCall!.options.body).toEqual({
        name: 'Carlos',
        email: 'carlos@example.com',
        message: 'This is a valid message long enough',
        subject: 'Test subject',
      })
    })

    it('returns success and shows toast on successful submit', async () => {
      const { form, submitForm } = useContactForm()
      form.value.name = 'Carlos'
      form.value.email = 'carlos@example.com'
      form.value.message = 'This is a valid message long enough'

      const result = await submitForm()

      expect(result.status).toBe('success')
      expect(mockState.toasts).toHaveLength(1)
      expect(mockState.toasts[0].type).toBe('success')
    })

    it('resets form on successful submit', async () => {
      const { form, submitForm } = useContactForm()
      form.value.name = 'Carlos'
      form.value.email = 'carlos@example.com'
      form.value.message = 'This is a valid message long enough'

      await submitForm()

      expect(form.value.name).toBe('')
      expect(form.value.email).toBe('')
      expect(form.value.message).toBe('')
    })

    it('sets loading state during submit', async () => {
      mockState.contactsResponse = new Promise((resolve) => setTimeout(() => resolve({ status: 'success' }), 100))
      const { form, loading, submitForm } = useContactForm()
      form.value.name = 'Carlos'
      form.value.email = 'carlos@example.com'
      form.value.message = 'This is a valid message long enough'

      const promise = submitForm()
      expect(loading.value).toBe(true)

      await promise
      expect(loading.value).toBe(false)
    })

    it('handles API error gracefully', async () => {
      const originalFetch = (globalThis as any).$fetch
      ;(globalThis as any).$fetch = vi.fn(() => Promise.reject(new Error('Network error')))

      const { form, submitForm, error } = useContactForm()
      form.value.name = 'Carlos'
      form.value.email = 'carlos@example.com'
      form.value.message = 'This is a valid message long enough'

      const result = await submitForm()

      expect(result.status).toBe('error')
      expect(error.value).toContain('Network error')
      expect(mockState.toasts.some(t => t.type === 'error')).toBe(true)

      ;(globalThis as any).$fetch = originalFetch
    })

    it('handles API returning error status', async () => {
      mockState.contactsResponse = { status: 'error', error: { message: 'Rate limited' } }

      const { form, submitForm } = useContactForm()
      form.value.name = 'Carlos'
      form.value.email = 'carlos@example.com'
      form.value.message = 'This is a valid message long enough'

      const result = await submitForm()

      expect(result.status).toBe('error')
      expect(result.message).toBe('Rate limited')
      expect(mockState.toasts.some(t => t.type === 'error')).toBe(true)
    })
  })

  describe('resetForm', () => {
    it('clears all form fields', () => {
      const { form, resetForm } = useContactForm()
      form.value.name = 'Carlos'
      form.value.email = 'carlos@example.com'
      form.value.message = 'Hello world this is long enough'

      resetForm()

      expect(form.value.name).toBe('')
      expect(form.value.email).toBe('')
      expect(form.value.message).toBe('')
    })
  })
})
