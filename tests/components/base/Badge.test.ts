import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '~/components/base/Badge.vue'

describe('Badge', () => {
  it('renders slot content', () => {
    const wrapper = mount(Badge, { slots: { default: 'Test Badge' } })
    expect(wrapper.text()).toBe('Test Badge')
  })

  it('has cyan color by default', () => {
    const wrapper = mount(Badge, { slots: { default: 'Cyan' } })
    expect(wrapper.classes()).toContain('bg-tokyo-night-cyan/10')
    expect(wrapper.classes()).toContain('text-tokyo-night-cyan')
  })

  it('applies magenta color', () => {
    const wrapper = mount(Badge, { props: { color: 'magenta' }, slots: { default: 'Magenta' } })
    expect(wrapper.classes()).toContain('bg-tokyo-night-magenta/10')
    expect(wrapper.classes()).toContain('text-tokyo-night-magenta')
  })

  it('applies green color', () => {
    const wrapper = mount(Badge, { props: { color: 'green' }, slots: { default: 'Green' } })
    expect(wrapper.classes()).toContain('bg-tokyo-night-green/10')
  })

  it('applies yellow color', () => {
    const wrapper = mount(Badge, { props: { color: 'yellow' }, slots: { default: 'Yellow' } })
    expect(wrapper.classes()).toContain('bg-tokyo-night-yellow/10')
  })

  it('applies muted color', () => {
    const wrapper = mount(Badge, { props: { color: 'muted' }, slots: { default: 'Muted' } })
    expect(wrapper.classes()).toContain('bg-tokyo-night-gray/10')
  })

  it('has md size by default', () => {
    const wrapper = mount(Badge, { slots: { default: 'MD' } })
    expect(wrapper.classes()).toContain('px-3')
    expect(wrapper.classes()).toContain('py-1')
    expect(wrapper.classes()).toContain('text-sm')
  })

  it('applies sm size', () => {
    const wrapper = mount(Badge, { props: { size: 'sm' }, slots: { default: 'SM' } })
    expect(wrapper.classes()).toContain('px-2')
    expect(wrapper.classes()).toContain('py-0.5')
    expect(wrapper.classes()).toContain('text-xs')
  })

  it('is a span element', () => {
    const wrapper = mount(Badge, { slots: { default: 'Span' } })
    expect(wrapper.element.tagName.toLowerCase()).toBe('span')
  })
})
