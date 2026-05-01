import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SkillsGrid from '~/components/about/SkillsGrid.vue'

const TerminalMock = { template: '<svg />' }

describe('SkillsGrid', () => {
  const categories = [
    {
      name: 'Languages',
      skills: [
        { name: 'TypeScript', level: 'advanced' as const },
        { name: 'Python', level: 'intermediate' as const },
      ],
    },
    {
      name: 'Databases',
      skills: [
        { name: 'PostgreSQL', level: 'advanced' as const },
        { name: 'Redis', level: 'basic' as const },
      ],
    },
  ]

  it('renders category names', () => {
    const wrapper = mount(SkillsGrid, {
      props: { categories },
      global: { components: { LucideTerminal: TerminalMock } }
    })
    expect(wrapper.text()).toContain('Languages')
    expect(wrapper.text()).toContain('Databases')
  })

  it('renders skill names', () => {
    const wrapper = mount(SkillsGrid, {
      props: { categories },
      global: { components: { LucideTerminal: TerminalMock } }
    })
    expect(wrapper.text()).toContain('TypeScript')
    expect(wrapper.text()).toContain('Python')
    expect(wrapper.text()).toContain('PostgreSQL')
    expect(wrapper.text()).toContain('Redis')
  })

  it('renders correct number of skill pills', () => {
    const wrapper = mount(SkillsGrid, {
      props: { categories },
      global: { components: { LucideTerminal: TerminalMock } }
    })
    const pills = wrapper.findAll('span.inline-flex')
    expect(pills).toHaveLength(4)
  })

  it('applies advanced level styling', () => {
    const wrapper = mount(SkillsGrid, {
      props: { categories },
      global: { components: { LucideTerminal: TerminalMock } }
    })
    expect(wrapper.html()).toContain('bg-nw-red/20')
  })

  it('applies basic level styling', () => {
    const wrapper = mount(SkillsGrid, {
      props: { categories },
      global: { components: { LucideTerminal: TerminalMock } }
    })
    expect(wrapper.html()).toContain('bg-nw-green/20')
  })
})
