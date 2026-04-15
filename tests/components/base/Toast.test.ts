import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'

// Create a shared reactive ref that the mock and tests both use
const mockToastsStore = ref<any[]>([])
const removeFn = vi.fn((id: string) => {
  mockToastsStore.value = mockToastsStore.value.filter(t => t.id !== id)
})

// Mock the module BEFORE importing the component
vi.mock('~/composables/useToast', () => ({
  useToast: vi.fn(() => ({
    toasts: mockToastsStore,
    remove: removeFn,
  })),
}))

// Import the component AFTER the mock is set up
const { default: ToastComponent } = await import('~/components/base/Toast.vue')

describe('Toast', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockToastsStore.value = []
  })

  it('renders nothing when no toasts', () => {
    const wrapper = mount(ToastComponent)
    expect(wrapper.findAll('[role="alert"]')).toHaveLength(0)
  })

  it('renders a toast message', async () => {
    mockToastsStore.value = [{ id: '1', message: 'Hello', type: 'info', duration: 5000 }]
    const wrapper = mount(ToastComponent)
    await flushPromises()

    expect(wrapper.text()).toContain('Hello')
  })

  it('calls remove when close button is clicked', async () => {
    mockToastsStore.value = [{ id: '1', message: 'Dismiss me', type: 'info', duration: 5000 }]
    const wrapper = mount(ToastComponent)
    await flushPromises()

    await wrapper.find('button[aria-label="Close notification"]').trigger('click')
    expect(removeFn).toHaveBeenCalledWith('1')
  })

  it('renders success toast with correct styling', async () => {
    mockToastsStore.value = [{ id: '2', message: 'Success', type: 'success', duration: 5000 }]
    const wrapper = mount(ToastComponent)
    await flushPromises()

    const alert = wrapper.find('[role="alert"]')
    expect(alert.classes()).toContain('border-tokyo-night-green')
  })

  it('renders error toast with correct styling', async () => {
    mockToastsStore.value = [{ id: '3', message: 'Error', type: 'error', duration: 0 }]
    const wrapper = mount(ToastComponent)
    await flushPromises()

    const alert = wrapper.find('[role="alert"]')
    expect(alert.classes()).toContain('border-tokyo-night-red')
  })

  it('renders warning toast with correct styling', async () => {
    mockToastsStore.value = [{ id: '4', message: 'Warning', type: 'warning', duration: 0 }]
    const wrapper = mount(ToastComponent)
    await flushPromises()

    const alert = wrapper.find('[role="alert"]')
    expect(alert.classes()).toContain('border-tokyo-night-yellow')
  })

  it('renders multiple toasts', async () => {
    mockToastsStore.value = [
      { id: '1', message: 'First', type: 'info', duration: 5000 },
      { id: '2', message: 'Second', type: 'success', duration: 5000 },
    ]
    const wrapper = mount(ToastComponent)
    await flushPromises()

    expect(wrapper.findAll('[role="alert"]')).toHaveLength(2)
  })

  it('has correct accessibility role', () => {
    const wrapper = mount(ToastComponent)
    expect(wrapper.find('[role="region"]').attributes('aria-label')).toBe('Notifications')
  })
})
