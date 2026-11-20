import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import Footer from '~/components/main/Footer.vue'

// Auto-imported composables and components
vi.stubGlobal('useNowPlaying', () => ({ nowPlaying: ref(null) }))

const stubs = {
  NuxtLink: { template: '<a><slot /></a>', props: ['to'] },
  NowPlayingBars: true,
}

const healthy = { status: 'success', data: { components: { db: { status: 'up' } } } }
const degraded = { status: 'success', data: { components: { db: { status: 'down' } } } }
const info = { status: 'success', data: { version: '1.0.0' } }

async function mountWithApi(health: unknown) {
  vi.stubGlobal('$fetch', vi.fn((url: string) =>
    url === '/api/health' ? (health ? Promise.resolve(health) : Promise.reject(new Error('down'))) : Promise.resolve(info)
  ))
  const wrapper = mount(Footer, { global: { stubs } })
  // import.meta.client is false in tests, so onMounted never fetches: trigger it by hand
  await (wrapper.vm as any).fetchApiStatus()
  await flushPromises()
  return wrapper
}

const led = (wrapper: ReturnType<typeof mount>) => wrapper.find('.led')

describe('Footer', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    vi.stubGlobal('useNowPlaying', () => ({ nowPlaying: ref(null) }))
  })

  it('should_have_no_data_state_while_the_api_status_is_loading', () => {
    vi.stubGlobal('$fetch', vi.fn(() => new Promise(() => {})))
    const wrapper = mount(Footer, { global: { stubs } })

    expect(led(wrapper).attributes()).not.toHaveProperty('data-state')
  })

  it('should_set_data_state_ok_and_blink_when_the_api_is_operational', async () => {
    const wrapper = await mountWithApi(healthy)

    expect(led(wrapper).attributes('data-state')).toBe('ok')
    expect(led(wrapper).classes()).toContain('blink')
  })

  it('should_set_data_state_warn_and_blink_when_the_api_is_degraded', async () => {
    const wrapper = await mountWithApi(degraded)

    expect(led(wrapper).attributes('data-state')).toBe('warn')
    expect(led(wrapper).classes()).toContain('blink')
  })

  it('should_set_data_state_error_without_blink_when_the_api_is_down', async () => {
    const wrapper = await mountWithApi(null)

    expect(led(wrapper).attributes('data-state')).toBe('error')
    expect(led(wrapper).classes()).not.toContain('blink')
  })

  it('should_not_use_v2_colour_classes_on_the_led', async () => {
    for (const health of [healthy, degraded, null]) {
      const wrapper = await mountWithApi(health)
      for (const colour of ['green', 'yellow', 'red', 'blue']) {
        expect(led(wrapper).classes()).not.toContain(colour)
      }
    }
  })
})
