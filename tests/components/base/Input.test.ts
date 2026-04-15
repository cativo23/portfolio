import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from '~/components/base/Input.vue'

describe('Input', () => {
  it('renders with default props', () => {
    const wrapper = mount(Input)
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('text')
    expect(input.attributes('value')).toBe('')
  })

  it('renders label when provided', () => {
    const wrapper = mount(Input, { props: { label: 'Email' } })
    expect(wrapper.text()).toContain('Email')
  })

  it('binds modelValue to input', () => {
    const wrapper = mount(Input, { props: { modelValue: 'hello' } })
    expect(wrapper.find('input').attributes('value')).toBe('hello')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(Input)
    await wrapper.find('input').setValue('new value')
    expect(wrapper.emitted('update:modelValue')).toEqual([['new value']])
  })

  it('sets placeholder', () => {
    const wrapper = mount(Input, { props: { placeholder: 'Type here' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Type here')
  })

  it('sets required attribute', () => {
    const wrapper = mount(Input, { props: { required: true } })
    expect(wrapper.find('input').attributes('aria-required')).toBe('true')
  })

  it('sets disabled attribute', () => {
    const wrapper = mount(Input, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBe('')
  })

  it('shows error message and applies error styling', () => {
    const wrapper = mount(Input, { props: { error: 'This field is required' } })
    expect(wrapper.text()).toContain('This field is required')
    expect(wrapper.find('input').classes()).toContain('border-tokyo-night-red')
  })

  it('sets aria-invalid when there is an error', () => {
    const wrapper = mount(Input, { props: { error: 'Invalid' } })
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
  })

  it('generates id from label', () => {
    const wrapper = mount(Input, { props: { label: 'User Email' } })
    expect(wrapper.find('input').attributes('id')).toBe('user-email')
  })

  it('uses explicit id over label', () => {
    const wrapper = mount(Input, { props: { id: 'custom-id', label: 'Some Label' } })
    expect(wrapper.find('input').attributes('id')).toBe('custom-id')
  })

  it('sets minlength and maxlength attributes', () => {
    const wrapper = mount(Input, { props: { minlength: 2, maxlength: 50 } })
    expect(wrapper.find('input').attributes('minlength')).toBe('2')
    expect(wrapper.find('input').attributes('maxlength')).toBe('50')
  })

  it('sets different input types', () => {
    const wrapper = mount(Input, { props: { type: 'email' } })
    expect(wrapper.find('input').attributes('type')).toBe('email')
  })

  it('associates error with aria-describedby', () => {
    const wrapper = mount(Input, { props: { id: 'email', error: 'Invalid email' } })
    expect(wrapper.find('input').attributes('aria-describedby')).toBe('email-error')
  })
})
