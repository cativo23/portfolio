import { ref } from 'vue'

export interface ContactForm {
  name: string
  email: string
  message: string
  subject?: string
}

export interface ContactFormResult {
  status: 'success' | 'error'
  message?: string
}

interface UseContactFormReturn {
  form: Ref<ContactForm>
  loading: Ref<boolean>
  error: Ref<string | null>
  validateForm: () => boolean
  submitForm: () => Promise<ContactFormResult>
  resetForm: () => void
}

export function useContactForm(): UseContactFormReturn {
  const toast = useToast()
  const form = ref<ContactForm>({ name: '', email: '', message: '', subject: '' })
  const loading = ref(false)
  const error = ref<string | null>(null)

  function validateForm(): boolean {
    error.value = null
    const errors: string[] = []

    if (!form.value.name || form.value.name.length < 2 || form.value.name.length > 100) {
      errors.push('Name must be between 2 and 100 characters')
    }

    if (!form.value.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
      errors.push('Please enter a valid email')
    }

    if (!form.value.message || form.value.message.length < 10 || form.value.message.length > 1000) {
      errors.push('Message must be between 10 and 1000 characters')
    }

    if (errors.length) {
      error.value = errors.join('. ')
      return false
    }

    return true
  }

  async function submitForm(): Promise<ContactFormResult> {
    if (!validateForm()) {
      return { status: 'error', message: error.value || 'Validation failed' }
    }

    loading.value = true
    error.value = null

    try {
      const data = await $fetch<{ status: string; error?: { message: string } }>('/api/contacts', {
        method: 'POST',
        body: {
          name: form.value.name,
          email: form.value.email,
          message: form.value.message,
          subject: form.value.subject || undefined,
        },
      })

      if (data && typeof data === 'object' && 'status' in data && data.status === 'success') {
        toast.success('Message sent successfully!')
        resetForm()
        return { status: 'success' }
      } else {
        const msg = data.error?.message || 'Failed to send message'
        toast.error(msg)
        error.value = msg
        return { status: 'error', message: msg }
      }
    } catch (err) {
      const msg = 'Network error. Please try again.'
      toast.error(msg)
      error.value = msg
      return { status: 'error', message: msg }
    } finally {
      loading.value = false
    }
  }

  function resetForm() {
    form.value = { name: '', email: '', message: '', subject: '' }
  }

  return {
    form,
    loading,
    error,
    validateForm,
    submitForm,
    resetForm,
  }
}
