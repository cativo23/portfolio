import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

// Mock Nuxt's useState
const mockState = ref<any[]>([])
vi.stubGlobal('useState', (_key: string, init: () => any[]) => {
  if (mockState.value.length === 0 && init) {
    mockState.value = init()
  }
  return mockState
})

// Import after mocking
const { useToast } = await import('~/composables/useToast')

describe('useToast', () => {
  beforeEach(() => {
    mockState.value = []
  })

  it('starts with empty toasts', () => {
    const { toasts } = useToast()
    expect(toasts.value).toEqual([])
  })

  it('adds a toast via show()', () => {
    const { toasts, show } = useToast()
    const id = show({ message: 'Hello' })

    expect(id).toBeTruthy()
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0]?.message).toBe('Hello')
    expect(toasts.value[0]?.type).toBe('info') // default type
    expect(toasts.value[0]?.duration).toBe(5000) // info default
  })

  it('success() creates a success toast with 5000ms duration', () => {
    const { toasts, success } = useToast()
    success('It worked!')

    expect(toasts.value[0]?.type).toBe('success')
    expect(toasts.value[0]?.duration).toBe(5000)
    expect(toasts.value[0]?.message).toBe('It worked!')
  })

  it('error() creates an error toast with 0 duration (persistent)', () => {
    const { toasts, error } = useToast()
    error('Something broke')

    expect(toasts.value[0]?.type).toBe('error')
    expect(toasts.value[0]?.duration).toBe(0)
  })

  it('warning() creates a warning toast with 0 duration (persistent)', () => {
    const { toasts, warning } = useToast()
    warning('Watch out')

    expect(toasts.value[0]?.type).toBe('warning')
    expect(toasts.value[0]?.duration).toBe(0)
  })

  it('info() creates an info toast with 5000ms duration', () => {
    const { toasts, info } = useToast()
    info('FYI')

    expect(toasts.value[0]?.type).toBe('info')
    expect(toasts.value[0]?.duration).toBe(5000)
  })

  it('allows custom duration override', () => {
    const { toasts, success } = useToast()
    success('Quick one', 2000)

    expect(toasts.value[0]?.duration).toBe(2000)
  })

  it('remove() removes a toast by id', () => {
    const { toasts, success, remove } = useToast()
    const id = success('To remove')
    expect(toasts.value).toHaveLength(1)

    remove(id)
    expect(toasts.value).toHaveLength(0)
  })

  it('clear() removes all toasts', () => {
    const { toasts, success, error, clear } = useToast()
    success('One')
    error('Two')
    expect(toasts.value).toHaveLength(2)

    clear()
    expect(toasts.value).toHaveLength(0)
  })

  it('generates unique ids', () => {
    const { success } = useToast()
    const id1 = success('First')
    const id2 = success('Second')

    expect(id1).not.toBe(id2)
  })

  it('stacks multiple toasts', () => {
    const { toasts, success, error, warning, info } = useToast()
    success('A')
    error('B')
    warning('C')
    info('D')

    expect(toasts.value).toHaveLength(4)
    expect(toasts.value.map(t => t.type)).toEqual(['success', 'error', 'warning', 'info'])
  })
})
