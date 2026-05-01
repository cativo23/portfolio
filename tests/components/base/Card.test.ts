import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from '~/components/base/Card.vue'

const NuxtLinkMock = {
  template: '<a :href="to"><slot></slot></a>',
  props: ['to', 'prefetch']
}

function makeWrapper(options: any = {}) {
  return mount(Card, {
    ...options,
    global: {
      ...options.global,
      components: {
        NuxtLink: NuxtLinkMock,
        ...(options.global?.components || {})
      }
    }
  })
}

describe('Card', () => {
  it('renders as div by default', () => {
    const wrapper = makeWrapper({ slots: { default: 'Content' } })
    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
  })

  it('renders slot content', () => {
    const wrapper = makeWrapper({ slots: { default: 'Card Content' } })
    expect(wrapper.text()).toContain('Card Content')
  })

  it('applies default styling classes', () => {
    const wrapper = makeWrapper()
    expect(wrapper.classes()).toContain('card')
  })

  it('applies hover effect by default', () => {
    const wrapper = makeWrapper()
    expect(wrapper.classes()).toContain('hover:border-nw-primary-dim')
  })

  it('removes hover effect when hoverable is false', () => {
    const wrapper = makeWrapper({ props: { hoverable: false } })
    expect(wrapper.classes()).not.toContain('hover:border-nw-primary-dim')
  })

  it('applies padding by default', () => {
    const wrapper = makeWrapper({ slots: { default: 'Padded' } })
    expect(wrapper.text()).toContain('Padded')
    expect(wrapper.html()).toContain('card-body')
  })

  it('removes padding when padded is false', () => {
    const wrapper = makeWrapper({ props: { padded: false }, slots: { default: 'No Pad' } })
    expect(wrapper.html()).not.toContain('card-body')
  })

  it('renders as NuxtLink when to is provided', () => {
    const wrapper = makeWrapper({
      props: { to: '/about' },
      slots: { default: 'Link Card' }
    })
    expect(wrapper.find('a').exists()).toBe(true)
  })

  it('renders as anchor when href is provided', () => {
    const wrapper = makeWrapper({
      props: { href: 'https://example.com', external: true },
      slots: { default: 'External' }
    })
    expect(wrapper.element.tagName.toLowerCase()).toBe('a')
    expect(wrapper.attributes('target')).toBe('_blank')
  })

  it('renders badge slot when provided', () => {
    const wrapper = makeWrapper({
      slots: { default: 'Content', badge: 'New' }
    })
    expect(wrapper.text()).toContain('New')
  })

  it('renders header slot when provided', () => {
    const wrapper = makeWrapper({
      slots: { default: 'Content', header: 'Header' }
    })
    expect(wrapper.text()).toContain('Header')
  })

  it('renders footer slot when provided', () => {
    const wrapper = makeWrapper({
      slots: { default: 'Content', footer: 'Footer' }
    })
    expect(wrapper.text()).toContain('Footer')
  })
})
