import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusIndicator from '~/components/ui/StatusIndicator.vue'

describe('StatusIndicator', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(StatusIndicator, {
      props: {
        status: 'success'
      }
    })

    const indicator = wrapper.find('[role="status"] > span:first-child')
    expect(indicator.classes()).toContain('led')
    expect(indicator.classes()).toContain('green')

    expect(wrapper.text()).toBe('')
  })

  it('renders with specific status colors', async () => {
    const wrapper = mount(StatusIndicator, {
      props: {
        status: 'error'
      }
    })

    let indicator = wrapper.find('[role="status"] > span:first-child')
    expect(indicator.classes()).toContain('red')

    await wrapper.setProps({ status: 'warning' })
    indicator = wrapper.find('[role="status"] > span:first-child')
    expect(indicator.classes()).toContain('yellow')

    await wrapper.setProps({ status: 'info' })
    indicator = wrapper.find('[role="status"] > span:first-child')
    expect(indicator.classes()).toContain('blue')

    await wrapper.setProps({ status: 'unknown' })
    indicator = wrapper.find('[role="status"] > span:first-child')
    expect(indicator.classes()).toContain('led')
  })

  it('renders text when provided via prop', () => {
    const wrapper = mount(StatusIndicator, {
      props: {
        status: 'success',
        text: 'All systems operational'
      }
    })

    expect(wrapper.text()).toBe('All systems operational')
  })

  it('renders text when provided via default slot', () => {
    const wrapper = mount(StatusIndicator, {
      props: {
        status: 'success'
      },
      slots: {
        default: 'System OK'
      }
    })

    expect(wrapper.text()).toBe('System OK')
  })

  it('adds blink class when pulse prop is true', () => {
    const wrapper = mount(StatusIndicator, {
      props: {
        status: 'success',
        pulse: true
      }
    })

    const indicator = wrapper.find('[role="status"] > span:first-child')
    expect(indicator.classes()).toContain('blink')
  })

  it('renders different sizes correctly', async () => {
    const wrapper = mount(StatusIndicator, {
      props: {
        status: 'success',
        size: 'sm'
      }
    })

    let indicator = wrapper.find('[role="status"] > span:first-child')
    expect(indicator.classes()).toContain('!w-1.5')
    expect(indicator.classes()).toContain('!h-1.5')

    await wrapper.setProps({ size: 'lg' })
    indicator = wrapper.find('[role="status"] > span:first-child')
    expect(indicator.classes()).toContain('!w-3')
    expect(indicator.classes()).toContain('!h-3')
  })

  it('sets aria-label correctly based on props', async () => {
    const wrapper = mount(StatusIndicator, {
      props: {
        status: 'warning'
      }
    })
    expect(wrapper.attributes('aria-label')).toBe('warning')

    await wrapper.setProps({ ariaLabel: 'Custom alert' })
    expect(wrapper.attributes('aria-label')).toBe('Custom alert')

    await wrapper.setProps({ ariaLabel: undefined, text: 'Alert text' })
    expect(wrapper.attributes('aria-label')).toBeUndefined()
  })
})
