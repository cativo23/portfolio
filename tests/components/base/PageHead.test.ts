import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageHead from '~/components/base/PageHead.vue'

const props = { idx: '01', label: 'Signal', kanji: '証', title: 'Proof of work.' }

describe('PageHead', () => {
  it('renders the section head with the index and the kanji in the right slot', () => {
    const wrapper = mount(PageHead, { props })
    const head = wrapper.get('.nw-section-head')
    expect(head.attributes('data-idx')).toBe('01')
    expect(head.text()).toContain('Signal')
    expect(head.get('.kanji').text()).toBe('証')
  })

  it('renders the title as an h2 .nw-display by default', () => {
    const wrapper = mount(PageHead, { props })
    const h = wrapper.get('h2.nw-display')
    expect(h.text()).toBe('Proof of work.')
  })

  it('renders the title as an h1 when level is 1', () => {
    const wrapper = mount(PageHead, { props: { ...props, level: 1 } })
    expect(wrapper.find('h1.nw-display').exists()).toBe(true)
    expect(wrapper.find('h2').exists()).toBe(false)
  })

  it('renders the default slot as a .nw-lede paragraph only when given', () => {
    expect(mount(PageHead, { props }).find('.nw-lede').exists()).toBe(false)
    const wrapper = mount(PageHead, { props, slots: { default: 'Live from the APIs.' } })
    expect(wrapper.get('p.nw-lede').text()).toBe('Live from the APIs.')
  })
})
