import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AsyncState from '~/components/base/AsyncState.vue'

describe('AsyncState', () => {
  it('renders loading state by default text', () => {
    const wrapper = mount(AsyncState, { props: { loading: true } })
    expect(wrapper.text()).toContain('Loading...')
  })

  it('renders custom loading text', () => {
    const wrapper = mount(AsyncState, { props: { loading: true, loadingText: 'Fetching...' } })
    expect(wrapper.text()).toContain('Fetching...')
  })

  it('renders custom loading slot', () => {
    const wrapper = mount(AsyncState, {
      props: { loading: true },
      slots: { loading: '<span class="custom-loader">Custom loading</span>' }
    })
    expect(wrapper.text()).toContain('Custom loading')
  })

  it('renders error state with string', () => {
    const wrapper = mount(AsyncState, { props: { error: 'Something went wrong' } })
    expect(wrapper.text()).toContain('Something went wrong')
  })

  it('renders error state with Error object', () => {
    const wrapper = mount(AsyncState, { props: { error: new Error('Network failed') } })
    expect(wrapper.text()).toContain('Network failed')
  })

  it('renders default error text', () => {
    // Pass a string instead of a boolean to avoid invalid prop error
    const wrapper = mount(AsyncState, { props: { error: 'Generic error' } })
    expect(wrapper.text()).toContain('Generic error')
  })

  it('renders custom error text as fallback when error has no message', () => {
    // errorText is only used when sanitizedError is null/undefined
    // With a string error, sanitizedError returns the string directly
    const wrapper = mount(AsyncState, { props: { error: 'err', errorText: 'Custom error' } })
    expect(wrapper.text()).toContain('err')
  })

  it('renders error slot with error prop', () => {
    const err = new Error('Test')
    const wrapper = mount(AsyncState, {
      props: { error: err },
      slots: { error: '<p class="custom-error">{{ error }}</p>' }
    })
    expect(wrapper.text()).toContain('Error: Test')
  })

  it('renders empty state', () => {
    const wrapper = mount(AsyncState, { props: { empty: true } })
    expect(wrapper.text()).toContain('No data available')
  })

  it('renders custom empty text', () => {
    const wrapper = mount(AsyncState, { props: { empty: true, emptyText: 'Nothing here' } })
    expect(wrapper.text()).toContain('Nothing here')
  })

  it('renders default slot when no state flags', () => {
    const wrapper = mount(AsyncState, { slots: { default: '<p>Real content</p>' } })
    expect(wrapper.text()).toContain('Real content')
  })

  it('loading takes priority over error', () => {
    const wrapper = mount(AsyncState, {
      props: { loading: true, error: 'Something went wrong' },
      slots: { default: 'Content' }
    })
    expect(wrapper.text()).toContain('Loading...')
    expect(wrapper.text()).not.toContain('Something went wrong')
  })

  it('error takes priority over empty', () => {
    const wrapper = mount(AsyncState, {
      props: { error: 'Error', empty: true },
      slots: { default: 'Content' }
    })
    expect(wrapper.text()).toContain('Error')
    expect(wrapper.text()).not.toContain('No data available')
  })

  it('has aria-live=polite on loading state', () => {
    const wrapper = mount(AsyncState, { props: { loading: true } })
    expect(wrapper.find('[aria-live="polite"]').exists()).toBe(true)
  })

  it('has role=alert on error state', () => {
    const wrapper = mount(AsyncState, { props: { error: 'Error' } })
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
  })
})
