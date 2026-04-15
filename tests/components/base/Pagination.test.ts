import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from '~/components/base/Pagination.vue'
import Button from '~/components/base/Button.vue'

const ChevronLeftMock = { template: '<svg class="lucide-chevron-left" />' }
const ChevronRightMock = { template: '<svg class="lucide-chevron-right" />' }

function makeWrapper(pagination: any) {
  return mount(Pagination, {
    props: { pagination },
    global: {
      components: {
        BaseButton: Button,
        LucideChevronLeft: ChevronLeftMock,
        LucideChevronRight: ChevronRightMock,
      }
    }
  })
}

describe('Pagination', () => {
  it('does not render when pagination is null', () => {
    const wrapper = mount(Pagination, { props: { pagination: null } })
    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('does not render when only one page', () => {
    const wrapper = makeWrapper({ page: 1, total_pages: 1, total_items: 5, limit: 5 })
    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('renders when more than one page', () => {
    const wrapper = makeWrapper({ page: 1, total_pages: 2, total_items: 15, limit: 10 })
    expect(wrapper.find('nav').exists()).toBe(true)
  })

  it('shows page info text', () => {
    const wrapper = makeWrapper({ page: 1, total_pages: 2, total_items: 15, limit: 10 })
    expect(wrapper.text()).toContain('1-10 of 15')
  })

  it('shows correct range on page 2', () => {
    const wrapper = makeWrapper({ page: 2, total_pages: 2, total_items: 15, limit: 10 })
    expect(wrapper.text()).toContain('11-15 of 15')
  })

  it('disables previous button on first page', async () => {
    const wrapper = makeWrapper({ page: 1, total_pages: 3, total_items: 30, limit: 10 })
    await wrapper.vm.$nextTick()

    // Find all buttons, the first one is Previous
    const buttons = wrapper.findAll('button')
    // Previous button should be disabled
    expect(buttons[0]?.attributes('disabled')).toBeDefined()
  })

  it('disables next button on last page', async () => {
    const wrapper = makeWrapper({ page: 3, total_pages: 3, total_items: 30, limit: 10 })
    await wrapper.vm.$nextTick()

    const buttons = wrapper.findAll('button')
    // Next button is the last one
    const nextButton = buttons[buttons.length - 1]
    expect(nextButton?.attributes('disabled')).toBeDefined()
  })

  it('emits page-change when clicking a page number', async () => {
    const wrapper = makeWrapper({ page: 1, total_pages: 3, total_items: 30, limit: 10 })
    await wrapper.vm.$nextTick()

    // Find the button with text "2"
    const buttons = wrapper.findAll('button')
    const page2Btn = buttons.find(btn => btn.text().trim() === '2')

    await page2Btn?.trigger('click')
    expect(wrapper.emitted('page-change')).toEqual([[2]])
  })

  it('shows ellipsis for many pages when near start', () => {
    const wrapper = makeWrapper({ page: 2, total_pages: 10, total_items: 100, limit: 10 })
    expect(wrapper.text()).toContain('...')
  })

  it('highlights current page', () => {
    const wrapper = makeWrapper({ page: 2, total_pages: 3, total_items: 30, limit: 10 })
    expect(wrapper.html()).toContain('aria-current="page"')
  })
})
