import { nextTick, onScopeDispose, watch, type Ref } from 'vue'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
].join(', ')

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

export function useFocusTrap(
  containerRef: Ref<HTMLElement | null>,
  isActive: Ref<boolean>,
  onEscape?: () => void,
): void {
  // SSR-safe: bail out on the server.
  if (typeof document === 'undefined') return

  let previouslyFocused: HTMLElement | null = null
  let keydownHandler: ((e: KeyboardEvent) => void) | null = null

  function detach() {
    if (keydownHandler) {
      document.removeEventListener('keydown', keydownHandler)
      keydownHandler = null
    }
  }

  function activate() {
    previouslyFocused = (document.activeElement as HTMLElement | null) ?? null

    nextTick(() => {
      const container = containerRef.value
      if (!container) return
      const focusable = getFocusable(container)
      if (focusable.length > 0) {
        focusable[0]?.focus()
      } else {
        // Fall back to focusing the container itself so the trap holds.
        container.focus?.()
      }
    })

    keydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape?.()
        return
      }
      if (e.key !== 'Tab') return

      const container = containerRef.value
      if (!container) return
      const focusable = getFocusable(container)
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }
      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!
      const active = document.activeElement as HTMLElement | null

      if (e.shiftKey) {
        if (active === first || !container.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last || !container.contains(active)) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', keydownHandler)
  }

  function deactivate() {
    detach()
    const target = previouslyFocused
    previouslyFocused = null
    if (target && document.contains(target)) {
      target.focus()
    }
  }

  watch(
    isActive,
    (active, _prev) => {
      if (active) {
        activate()
      } else {
        deactivate()
      }
    },
    { immediate: true },
  )

  onScopeDispose(() => {
    detach()
    previouslyFocused = null
  })
}
