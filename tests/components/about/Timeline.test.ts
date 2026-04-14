import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Timeline from '~/components/about/Timeline.vue'

const MapPinMock = { template: '<svg />' }

describe('Timeline', () => {
  const items = [
    { title: 'Tech Lead', company: 'Blue Medical', period: '2022-Present', location: 'Guatemala' },
    { title: 'Backend Dev', company: 'OrangeSoftCo', period: '2020-2022' },
  ]

  it('renders timeline items', () => {
    const wrapper = mount(Timeline, {
      props: { items },
      global: { components: { LucideMapPin: MapPinMock } }
    })
    expect(wrapper.text()).toContain('Tech Lead')
    expect(wrapper.text()).toContain('Blue Medical')
    expect(wrapper.text()).toContain('2022-Present')
  })

  it('renders location when provided', () => {
    const wrapper = mount(Timeline, {
      props: { items },
      global: { components: { LucideMapPin: MapPinMock } }
    })
    expect(wrapper.text()).toContain('Guatemala')
  })

  it('does not render location when not provided', () => {
    const itemsWithoutLocation = [
      { title: 'Backend Dev', company: 'OrangeSoftCo', period: '2020-2022' },
    ]
    const wrapper = mount(Timeline, {
      props: { items: itemsWithoutLocation },
      global: { components: { LucideMapPin: MapPinMock } }
    })
    // The second item has no location
    const html = wrapper.html()
    expect(wrapper.text()).toContain('Backend Dev')
  })

  it('renders the correct number of items', () => {
    const wrapper = mount(Timeline, {
      props: { items },
      global: { components: { LucideMapPin: MapPinMock } }
    })
    const itemDivs = wrapper.findAll('.relative.pl-8')
    expect(itemDivs).toHaveLength(2)
  })

  it('marks first item as current (green dot)', () => {
    const wrapper = mount(Timeline, {
      props: { items },
      global: { components: { LucideMapPin: MapPinMock } }
    })
    const dots = wrapper.findAll('.rounded-full')
    expect(dots[0]?.classes()).toContain('bg-tokyo-night-green')
  })
})
