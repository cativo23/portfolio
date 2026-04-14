import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Textarea from '~/components/base/Textarea.vue'

describe('Textarea', () => {
  it('renders with default props', () => {
    const wrapper = mount(Textarea)
    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
    expect(textarea.attributes('rows')).toBe('4')
  })

  it('binds modelValue to textarea', () => {
    const wrapper = mount(Textarea, { props: { modelValue: 'Some text' } })
    expect(wrapper.find('textarea').attributes('value')).toBe('Some text')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(Textarea)
    await wrapper.find('textarea').setValue('new text')
    expect(wrapper.emitted('update:modelValue')).toEqual([['new text']])
  })

  it('renders label when provided', () => {
    const wrapper = mount(Textarea, { props: { label: 'Message' } })
    expect(wrapper.text()).toContain('Message')
  })

  it('sets rows attribute', () => {
    const wrapper = mount(Textarea, { props: { rows: 8 } })
    expect(wrapper.find('textarea').attributes('rows')).toBe('8')
  })

  it('sets required attribute', () => {
    const wrapper = mount(Textarea, { props: { required: true } })
    expect(wrapper.find('textarea').attributes('aria-required')).toBe('true')
  })

  it('sets disabled attribute', () => {
    const wrapper = mount(Textarea, { props: { disabled: true } })
    expect(wrapper.find('textarea').attributes('disabled')).toBe('')
  })

  it('shows error message and applies error styling', () => {
    const wrapper = mount(Textarea, { props: { error: 'Too short' } })
    expect(wrapper.text()).toContain('Too short')
    expect(wrapper.find('textarea').classes()).toContain('border-tokyo-night-red')
  })

  it('sets aria-invalid when there is an error', () => {
    const wrapper = mount(Textarea, { props: { error: 'Invalid' } })
    expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true')
  })

  it('generates id from label', () => {
    const wrapper = mount(Textarea, { props: { label: 'User Bio' } })
    expect(wrapper.find('textarea').attributes('id')).toBe('user-bio')
  })

  it('sets minlength and maxlength attributes', () => {
    const wrapper = mount(Textarea, { props: { minlength: 10, maxlength: 500 } })
    expect(wrapper.find('textarea').attributes('minlength')).toBe('10')
    expect(wrapper.find('textarea').attributes('maxlength')).toBe('500')
  })
})
