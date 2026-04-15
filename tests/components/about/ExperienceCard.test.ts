import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ExperienceCard from '~/components/about/ExperienceCard.vue'

// Mock BaseCard
const BaseCardMock = {
  template: '<div class="mock-base-card"><slot></slot></div>',
  props: ['hoverable']
}

const ChevronRightMock = { template: '<svg />' }
const MapPinMock = { template: '<svg />' }

describe('ExperienceCard', () => {
  const defaultProps = {
    company: 'Blue Medical',
    role: 'Tech Lead',
    period: 'Apr 2022 - Present',
    description: 'Leading development',
    achievements: ['Built API', 'Shipped product'],
    tech: ['NestJS', 'Vue'],
  }

  it('renders company and role', () => {
    const wrapper = mount(ExperienceCard, {
      props: defaultProps,
      global: { components: { BaseCard: BaseCardMock, LucideChevronRight: ChevronRightMock, LucideMapPin: MapPinMock } }
    })
    expect(wrapper.text()).toContain('Blue Medical')
    expect(wrapper.text()).toContain('Tech Lead')
  })

  it('renders period', () => {
    const wrapper = mount(ExperienceCard, {
      props: defaultProps,
      global: { components: { BaseCard: BaseCardMock, LucideChevronRight: ChevronRightMock, LucideMapPin: MapPinMock } }
    })
    expect(wrapper.text()).toContain('Apr 2022 - Present')
  })

  it('renders description', () => {
    const wrapper = mount(ExperienceCard, {
      props: { ...defaultProps, description: 'Building things' },
      global: { components: { BaseCard: BaseCardMock, LucideChevronRight: ChevronRightMock, LucideMapPin: MapPinMock } }
    })
    expect(wrapper.text()).toContain('Building things')
  })

  it('renders achievements when provided', () => {
    const wrapper = mount(ExperienceCard, {
      props: defaultProps,
      global: { components: { BaseCard: BaseCardMock, LucideChevronRight: ChevronRightMock, LucideMapPin: MapPinMock } }
    })
    expect(wrapper.text()).toContain('Built API')
    expect(wrapper.text()).toContain('Shipped product')
  })

  it('renders tech stack when provided', () => {
    const wrapper = mount(ExperienceCard, {
      props: defaultProps,
      global: { components: { BaseCard: BaseCardMock, LucideChevronRight: ChevronRightMock, LucideMapPin: MapPinMock } }
    })
    expect(wrapper.text()).toContain('NestJS')
    expect(wrapper.text()).toContain('Vue')
  })

  it('renders location when provided', () => {
    const wrapper = mount(ExperienceCard, {
      props: { ...defaultProps, location: 'Guatemala' },
      global: { components: { BaseCard: BaseCardMock, LucideChevronRight: ChevronRightMock, LucideMapPin: MapPinMock } }
    })
    expect(wrapper.text()).toContain('Guatemala')
  })

  it('does not render achievements section when empty', () => {
    const wrapper = mount(ExperienceCard, {
      props: { ...defaultProps, achievements: [] },
      global: { components: { BaseCard: BaseCardMock, LucideChevronRight: ChevronRightMock, LucideMapPin: MapPinMock } }
    })
    const ul = wrapper.find('ul')
    expect(ul.exists()).toBe(false)
  })

  it('does not render tech stack when empty', () => {
    const wrapper = mount(ExperienceCard, {
      props: { ...defaultProps, tech: [] },
      global: { components: { BaseCard: BaseCardMock, LucideChevronRight: ChevronRightMock, LucideMapPin: MapPinMock } }
    })
    // Check no tech tags rendered
    const techSpans = wrapper.findAll('span.text-xs.font-mono')
    expect(techSpans).toHaveLength(0)
  })
})
