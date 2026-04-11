import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MetaInfoPair from '~/components/ui/MetaInfoPair.vue'

describe('MetaInfoPair', () => {
  it('renders default props correctly', () => {
    const wrapper = mount(MetaInfoPair, {
      props: {
        label: 'Status',
        value: 'Active'
      }
    })
    
    // Check texts
    expect(wrapper.text()).toContain('Status')
    expect(wrapper.text()).toContain('Active')
    
    // Check default vertical layout
    expect(wrapper.classes()).toContain('flex-col')
    expect(wrapper.classes()).not.toContain('flex-row')
    
    // Check default text color
    const valueSpan = wrapper.findAll('span')[1]
    expect(valueSpan.classes()).toContain('text-tokyo-night-text')
  })

  it('renders horizontally when horizontal prop is true', () => {
    const wrapper = mount(MetaInfoPair, {
      props: {
        label: 'Memory',
        value: '512MB',
        horizontal: true
      }
    })
    
    expect(wrapper.classes()).toContain('flex-row')
    expect(wrapper.classes()).toContain('justify-between')
    expect(wrapper.classes()).toContain('items-center')
    expect(wrapper.classes()).not.toContain('flex-col')
  })

  it('applies correct text colors based on color prop', async () => {
    const wrapper = mount(MetaInfoPair, {
      props: {
        label: 'Status',
        value: 'OK',
        color: 'success'
      }
    })
    
    let valueSpan = wrapper.findAll('span')[1]
    expect(valueSpan.classes()).toContain('text-tokyo-night-green')
    
    await wrapper.setProps({ color: 'error' })
    valueSpan = wrapper.findAll('span')[1]
    expect(valueSpan.classes()).toContain('text-tokyo-night-red')
    
    await wrapper.setProps({ color: 'warning' })
    valueSpan = wrapper.findAll('span')[1]
    expect(valueSpan.classes()).toContain('text-tokyo-night-yellow')
    
    await wrapper.setProps({ color: 'info' })
    valueSpan = wrapper.findAll('span')[1]
    expect(valueSpan.classes()).toContain('text-tokyo-night-cyan')
  })
  
  it('renders label slot content', () => {
    const wrapper = mount(MetaInfoPair, {
      props: {
        label: 'Default Label',
        value: 'Value'
      },
      slots: {
        label: '<span class="custom-label">Custom Label</span>'
      }
    })
    
    expect(wrapper.find('.custom-label').exists()).toBe(true)
    expect(wrapper.find('.custom-label').text()).toBe('Custom Label')
  })
  
  it('renders default slot content for value', () => {
    const wrapper = mount(MetaInfoPair, {
      props: {
        label: 'Label',
        value: 'Default Value'
      },
      slots: {
        default: '<span class="custom-value">Custom Value</span>'
      }
    })
    
    expect(wrapper.find('.custom-value').exists()).toBe(true)
    expect(wrapper.find('.custom-value').text()).toBe('Custom Value')
  })
})
