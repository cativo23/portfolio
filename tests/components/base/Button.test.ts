import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, resolveComponent } from 'vue'

vi.stubGlobal('computed', computed)
// Provide a basic mock for resolveComponent
vi.stubGlobal('resolveComponent', (name: string) => {
  if (name === 'NuxtLink') return 'a'
  return name
})

import Button from '~/components/base/Button.vue'

describe('Button', () => {
  it('renders as button by default', () => {
    const wrapper = mount(Button, { slots: { default: 'Click Me' } })
    expect(wrapper.element.tagName.toLowerCase()).toBe('button')
  })

  it('renders slot content', () => {
    const wrapper = mount(Button, { slots: { default: 'Hello' } })
    expect(wrapper.text()).toBe('Hello')
  })

  it('applies primary variant classes by default', () => {
    const wrapper = mount(Button)
    expect(wrapper.classes()).toContain('btn')
  })

  it('applies secondary variant classes', () => {
    const wrapper = mount(Button, { props: { variant: 'secondary' } })
    expect(wrapper.classes()).toContain('btn-ghost')
  })

  it('applies ghost variant classes', () => {
    const wrapper = mount(Button, { props: { variant: 'ghost' } })
    expect(wrapper.classes()).toContain('btn-ghost')
    expect(wrapper.classes()).toContain('border-transparent')
  })

  it('applies md size by default', () => {
    const wrapper = mount(Button)
    expect(wrapper.classes()).toContain('btn')
  })

  it('applies sm size classes', () => {
    const wrapper = mount(Button, { props: { size: 'sm' } })
    expect(wrapper.classes()).toContain('btn-sm')
  })

  it('applies lg size classes', () => {
    const wrapper = mount(Button, { props: { size: 'lg' } })
    expect(wrapper.classes()).toContain('px-6')
    expect(wrapper.classes()).toContain('py-3')
  })

  it('applies disabled classes when disabled', () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    expect(wrapper.classes()).toContain('opacity-50')
    expect(wrapper.classes()).toContain('pointer-events-none')
  })

  it('shows loading spinner when loading', () => {
    const wrapper = mount(Button, { props: { loading: true }, slots: { default: 'Submit' } })
    expect(wrapper.html()).toContain('animate-spin')
    expect(wrapper.html()).toContain('invisible')
  })

  it('emits click when clicked', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renders as anchor when href provided', () => {
    const wrapper = mount(Button, { props: { href: '/link' } })
    expect(wrapper.element.tagName.toLowerCase()).toBe('a')
  })

  it('sets target=_blank for external links', () => {
    const wrapper = mount(Button, { props: { href: 'https://example.com', external: true } })
    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.attributes('rel')).toBe('noopener noreferrer')
  })

  it('renders as NuxtLink when to provided', () => {
    const NuxtLinkMock = {
      template: '<a :href="to"><slot></slot></a>',
      props: ['to', 'prefetch']
    }
    const wrapper = mount(Button, {
      props: { to: '/about' },
      global: { components: { NuxtLink: NuxtLinkMock } }
    })
    expect(wrapper.find('a').exists()).toBe(true)
  })
})
