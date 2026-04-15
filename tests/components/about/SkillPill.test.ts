import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'

vi.stubGlobal('computed', computed)

import SkillPill from '~/components/about/SkillPill.vue'


describe('SkillPill', () => {
  it('renders skill name', () => {
    const wrapper = mount(SkillPill, { props: { name: 'TypeScript', level: 'advanced' } })
    expect(wrapper.text()).toBe('TypeScript')
  })

  it('applies advanced (red) class', () => {
    const wrapper = mount(SkillPill, { props: { name: 'Vue', level: 'advanced' } })
    expect(wrapper.classes()).toContain('bg-tokyo-night-red')
  })

  it('applies intermediate (yellow) class', () => {
    const wrapper = mount(SkillPill, { props: { name: 'Python', level: 'intermediate' } })
    expect(wrapper.classes()).toContain('bg-tokyo-night-yellow')
  })

  it('applies beginner (green) class', () => {
    const wrapper = mount(SkillPill, { props: { name: 'Rust', level: 'beginner' } })
    expect(wrapper.classes()).toContain('bg-tokyo-night-green')
  })
})
