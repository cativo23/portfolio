import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h, nextTick, ref, type Ref } from 'vue'
import { mount } from '@vue/test-utils'

const { useFocusTrap } = await import('~/composables/useFocusTrap')

function makeHost(
  containerRef: Ref<HTMLElement | null>,
  isActive: Ref<boolean>,
  onEscape?: () => void,
) {
  return defineComponent({
    setup() {
      useFocusTrap(containerRef, isActive, onEscape)
      return () =>
        h(
          'div',
          {
            ref: (el) => {
              containerRef.value = el as HTMLElement | null
            },
            tabindex: -1,
          },
          [
            h('button', { id: 'first' }, 'first'),
            h('a', { id: 'middle', href: '#' }, 'middle'),
            h('button', { id: 'last' }, 'last'),
          ],
        )
    },
  })
}

describe('useFocusTrap', () => {
  let externalButton: HTMLButtonElement

  beforeEach(() => {
    // External focusable element to simulate the trigger (so we can verify restoration).
    externalButton = document.createElement('button')
    externalButton.id = 'trigger'
    document.body.appendChild(externalButton)
    externalButton.focus()
  })

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild)
    }
  })

  it('does not attach keydown listener while inactive', () => {
    const addSpy = vi.spyOn(document, 'addEventListener')
    const containerRef = ref<HTMLElement | null>(null)
    const isActive = ref(false)
    const onEscape = vi.fn()

    const wrapper = mount(makeHost(containerRef, isActive, onEscape), {
      attachTo: document.body,
    })

    const keydownCalls = addSpy.mock.calls.filter(([type]) => type === 'keydown')
    expect(keydownCalls).toHaveLength(0)

    // Dispatching escape should be a no-op.
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(onEscape).not.toHaveBeenCalled()

    wrapper.unmount()
    addSpy.mockRestore()
  })

  it('focuses the first focusable element when activated', async () => {
    const containerRef = ref<HTMLElement | null>(null)
    const isActive = ref(false)
    const wrapper = mount(makeHost(containerRef, isActive), { attachTo: document.body })

    isActive.value = true
    await nextTick()
    await nextTick()

    const first = wrapper.get('#first').element as HTMLElement
    expect(document.activeElement).toBe(first)

    wrapper.unmount()
  })

  it('invokes the onEscape callback when Escape is pressed', async () => {
    const containerRef = ref<HTMLElement | null>(null)
    const isActive = ref(false)
    const onEscape = vi.fn()
    const wrapper = mount(makeHost(containerRef, isActive, onEscape), {
      attachTo: document.body,
    })

    isActive.value = true
    await nextTick()
    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(onEscape).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('restores focus to the previously focused element on deactivation', async () => {
    const containerRef = ref<HTMLElement | null>(null)
    const isActive = ref(false)
    const wrapper = mount(makeHost(containerRef, isActive), { attachTo: document.body })

    expect(document.activeElement).toBe(externalButton)

    isActive.value = true
    await nextTick()
    await nextTick()
    expect(document.activeElement).not.toBe(externalButton)

    isActive.value = false
    await nextTick()
    expect(document.activeElement).toBe(externalButton)

    wrapper.unmount()
  })

  it('wraps focus from last to first on Tab', async () => {
    const containerRef = ref<HTMLElement | null>(null)
    const isActive = ref(false)
    const wrapper = mount(makeHost(containerRef, isActive), { attachTo: document.body })

    isActive.value = true
    await nextTick()
    await nextTick()

    const last = wrapper.get('#last').element as HTMLElement
    const first = wrapper.get('#first').element as HTMLElement
    last.focus()

    const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true })
    document.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(first)

    wrapper.unmount()
  })

  it('wraps focus from first to last on Shift+Tab', async () => {
    const containerRef = ref<HTMLElement | null>(null)
    const isActive = ref(false)
    const wrapper = mount(makeHost(containerRef, isActive), { attachTo: document.body })

    isActive.value = true
    await nextTick()
    await nextTick()

    const first = wrapper.get('#first').element as HTMLElement
    const last = wrapper.get('#last').element as HTMLElement
    first.focus()

    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true })
    document.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(last)

    wrapper.unmount()
  })
})
