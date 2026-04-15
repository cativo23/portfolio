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

    // The root element has role="status"; the first child span is the indicator dot
    const indicator = wrapper.find('[role="status"] > span:first-child')
    expect(indicator.classes()).toContain('w-2')
    expect(indicator.classes()).toContain('h-2')
    expect(indicator.classes()).toContain('bg-tokyo-night-green')

    // No text rendered by default
    expect(wrapper.text()).toBe('')
  })

  it('renders with specific status colors', async () => {
    const wrapper = mount(StatusIndicator, {
      props: {
        status: 'error'
      }
    })
    
    let indicator = wrapper.find('[role="status"] > span:first-child')
    expect(indicator.classes()).toContain('bg-tokyo-night-red')
    
    await wrapper.setProps({ status: 'warning' })
    indicator = wrapper.find('[role="status"] > span:first-child')
    expect(indicator.classes()).toContain('bg-tokyo-night-yellow')
    
    await wrapper.setProps({ status: 'info' })
    indicator = wrapper.find('[role="status"] > span:first-child')
    expect(indicator.classes()).toContain('bg-tokyo-night-cyan')
    
    await wrapper.setProps({ status: 'unknown' })
    indicator = wrapper.find('[role="status"] > span:first-child')
    expect(indicator.classes()).toContain('bg-tokyo-night-muted')
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

  it('adds pulse animation class when pulse prop is true', () => {
    const wrapper = mount(StatusIndicator, {
      props: {
        status: 'success',
        pulse: true
      }
    })
    
    const indicator = wrapper.find('[role="status"] > span:first-child')
    expect(indicator.classes()).toContain('animate-pulse')
  })

  it('renders different sizes correctly', async () => {
    const wrapper = mount(StatusIndicator, {
      props: {
        status: 'success',
        size: 'sm'
      }
    })
    
    let indicator = wrapper.find('[role="status"] > span:first-child')
    expect(indicator.classes()).toContain('w-1.5')
    expect(indicator.classes()).toContain('h-1.5')
    
    await wrapper.setProps({ size: 'lg' })
    indicator = wrapper.find('[role="status"] > span:first-child')
    expect(indicator.classes()).toContain('w-3')
    expect(indicator.classes()).toContain('h-3')
  })
  
  it('sets aria-label correctly based on props', async () => {
    // Uses status when no text/ariaLabel provided
    const wrapper = mount(StatusIndicator, {
      props: {
        status: 'warning'
      }
    })
    expect(wrapper.attributes('aria-label')).toBe('warning')
    
    // Uses specific ariaLabel if provided
    await wrapper.setProps({ ariaLabel: 'Custom alert' })
    expect(wrapper.attributes('aria-label')).toBe('Custom alert')
    
    // Doesn't set ariaLabel based on status if text is provided
    await wrapper.setProps({ ariaLabel: undefined, text: 'Alert text' })
    expect(wrapper.attributes('aria-label')).toBeUndefined()
  })
})
