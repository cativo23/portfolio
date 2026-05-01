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

  it('applies advanced (danger) class', () => {
    const wrapper = mount(SkillPill, { props: { name: 'Vue', level: 'advanced' } })
    expect(wrapper.classes()).toContain('tag-danger')
  })

  it('applies intermediate (warning) class', () => {
    const wrapper = mount(SkillPill, { props: { name: 'Python', level: 'intermediate' } })
    expect(wrapper.classes()).toContain('tag-warning')
  })

  it('applies beginner (success) class', () => {
    const wrapper = mount(SkillPill, { props: { name: 'Rust', level: 'beginner' } })
    expect(wrapper.classes()).toContain('tag-success')
  })
})
