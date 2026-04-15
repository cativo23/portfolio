import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import HealthBadge from '~/components/ui/HealthBadge.vue'
import { nextTick } from 'vue'

// Mock auto-imported components and composables
const StatusIndicatorMock = {
  template: '<div class="status-indicator-mock"><slot></slot></div>',
  props: ['status', 'text', 'pulse', 'size']
}

const NuxtLinkMock = {
  template: '<a :href="to" class="nuxt-link-mock"><slot></slot></a>',
  props: ['to']
}

const LucideActivityMock = {
  template: '<svg class="lucide-activity-mock"></svg>'
}

describe('HealthBadge', () => {
  let originalFetch: any
  let fetchMock: any
  let originalClient: any
  
  beforeEach(() => {
    // Save original global fetch if exists
    originalFetch = global.$fetch
    
    // Create mock for $fetch
    fetchMock = vi.fn()
    global.$fetch = fetchMock
    
    // Default to resolving so the component doesn't get stuck in loading
    fetchMock.mockResolvedValue(null)
    
    // Explicitly stub the client to ensure onMounted runs
    originalClient = Reflect.get(import.meta, 'client')
    Reflect.set(import.meta, 'client', true)
  })
  
  afterEach(() => {
    // Restore global fetch
    global.$fetch = originalFetch
    Reflect.set(import.meta, 'client', originalClient)
    vi.unstubAllGlobals()
  })

  it('renders initial loading state correctly', async () => {
    // For this test, make the fetch never resolve to test loading state
    let resolvePromise: any
    fetchMock.mockImplementation(() => new Promise((resolve) => {
        resolvePromise = resolve
    }))
    
    const wrapper = mount(HealthBadge, {
      global: {
        components: {
          StatusIndicator: StatusIndicatorMock,
          NuxtLink: NuxtLinkMock,
          LucideActivity: LucideActivityMock
        }
      }
    })
    
    expect(wrapper.text()).toContain('API Status:')
    
    const indicator = wrapper.findComponent(StatusIndicatorMock)
    expect(indicator.props('status')).toBe('unknown')
    expect(indicator.props('text')).toBe('Checking...')
    
    // Cleanup
    if (resolvePromise) resolvePromise(null)
  })

  it('renders healthy state correctly after successful fetch', async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url === '/api/health') {
        return Promise.resolve({
          status: 'success',
          data: {
            status: 'up',
            components: {
              db: { status: 'up' },
              cache: { status: 'up' }
            }
          }
        })
      }
      if (url === '/api') {
        return Promise.resolve({
          status: 'success',
          data: { version: '1.2.3', status: 'active' }
        })
      }
      return Promise.resolve(null)
    })
    
    const wrapper = mount(HealthBadge, {
      global: {
        components: {
          StatusIndicator: StatusIndicatorMock,
          NuxtLink: NuxtLinkMock,
          LucideActivity: LucideActivityMock
        }
      }
    })

    // Wait for the onMounted fetchHealth to complete
    await flushPromises()

    const indicator = wrapper.findComponent(StatusIndicatorMock)
    expect(indicator.props('status')).toBe('success')
    expect(indicator.props('text')).toBe('Operational')

    expect(wrapper.text()).toContain('v1.2.3')
  })

  it('renders degraded state when some components are degraded', async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url === '/api/health') {
        return Promise.resolve({
          status: 'success',
          data: {
            status: 'up',
            components: {
              db: { status: 'up' },
              cache: { status: 'degraded' }
            }
          }
        })
      }
      return Promise.resolve(null)
    })

    const wrapper = mount(HealthBadge, {
      global: {
        components: {
          StatusIndicator: StatusIndicatorMock,
          NuxtLink: NuxtLinkMock,
          LucideActivity: LucideActivityMock
        }
      }
    })

    // Wait for the onMounted fetchHealth to complete
    await flushPromises()

    const indicator = wrapper.findComponent(StatusIndicatorMock)
    expect(indicator.props('status')).toBe('warning')
    expect(indicator.props('text')).toBe('Degraded')
  })

  it('renders unavailable state when fetch fails', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'))

    const wrapper = mount(HealthBadge, {
      global: {
        components: {
          StatusIndicator: StatusIndicatorMock,
          NuxtLink: NuxtLinkMock,
          LucideActivity: LucideActivityMock
        }
      }
    })

    // Wait for the onMounted fetchHealth to complete
    await flushPromises()
    
    const indicator = wrapper.findComponent(StatusIndicatorMock)
    expect(indicator.props('status')).toBe('error')
    expect(indicator.props('text')).toBe('Unavailable')
  })
})
