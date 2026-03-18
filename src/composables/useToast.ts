export interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
}

type ToastType = ToastItem['type']

const DEFAULT_DURATIONS: Record<ToastType, number> = {
  success: 5000,
  info: 5000,
  warning: 0,
  error: 0,
}

export function useToast() {
  const toasts = useState<ToastItem[]>('toasts', () => [])

  function show(options: { message: string; type?: ToastType; duration?: number }): string {
    const type = options.type ?? 'info'
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
    const toast: ToastItem = {
      id,
      message: options.message,
      type,
      duration: options.duration ?? DEFAULT_DURATIONS[type],
    }
    toasts.value.push(toast)
    return id
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function clear() {
    toasts.value = []
  }

  function success(message: string, duration?: number) {
    return show({ message, type: 'success', duration })
  }

  function error(message: string, duration?: number) {
    return show({ message, type: 'error', duration })
  }

  function warning(message: string, duration?: number) {
    return show({ message, type: 'warning', duration })
  }

  function info(message: string, duration?: number) {
    return show({ message, type: 'info', duration })
  }

  return { toasts, show, remove, clear, success, error, warning, info }
}
