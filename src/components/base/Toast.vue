<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useToast, type ToastItem } from '~/composables/useToast'

const { toasts, remove } = useToast()

const timers = new Map<string, { timeout: ReturnType<typeof setTimeout>; remaining: number; start: number }>()

function startTimer(toast: ToastItem) {
  if (toast.duration <= 0) return
  const start = Date.now()
  const timeout = setTimeout(() => {
    remove(toast.id)
    timers.delete(toast.id)
  }, toast.duration)
  timers.set(toast.id, { timeout, remaining: toast.duration, start })
}

function pauseTimer(id: string) {
  const timer = timers.get(id)
  if (!timer) return
  clearTimeout(timer.timeout)
  timer.remaining -= Date.now() - timer.start
}

function resumeTimer(id: string) {
  const timer = timers.get(id)
  if (!timer || timer.remaining <= 0) return
  timer.start = Date.now()
  timer.timeout = setTimeout(() => {
    remove(id)
    timers.delete(id)
  }, timer.remaining)
}

function onToastEnter(toast: ToastItem) {
  startTimer(toast)
}

function onClose(id: string) {
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer.timeout)
    timers.delete(id)
  }
  remove(id)
}

onUnmounted(() => {
  timers.forEach((timer) => clearTimeout(timer.timeout))
  timers.clear()
})

const typeConfig: Record<'success' | 'error' | 'warning' | 'info', { variant: string; icon: string; iconColor: string }> = {
  success: { variant: 'toast-success', icon: '✓', iconColor: 'text-nw-green' },
  error: { variant: 'toast-danger', icon: '✕', iconColor: 'text-nw-red' },
  warning: { variant: 'toast-warning', icon: '⚠', iconColor: 'text-nw-yellow' },
  info: { variant: 'toast-info', icon: 'ℹ', iconColor: 'text-nw-cyan' },
}
</script>

<template>
  <div
    class="fixed top-4 right-4 z-50 flex flex-col gap-3 w-80"
    role="region"
    aria-label="Notifications"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'toast flex items-start gap-3',
          typeConfig[toast.type].variant,
        ]"
        :role="toast.type === 'error' || toast.type === 'warning' ? 'alert' : 'status'"
        :aria-live="toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite'"
        @mouseenter="pauseTimer(toast.id)"
        @mouseleave="resumeTimer(toast.id)"
        @keydown.escape="onClose(toast.id)"
        @vue:mounted="onToastEnter(toast)"
      >
        <span :class="[typeConfig[toast.type].iconColor, 'text-base leading-none shrink-0']">
          {{ typeConfig[toast.type].icon }}
        </span>
        <span class="text-nw-text flex-1 break-words">{{ toast.message }}</span>
        <button
          @click="onClose(toast.id)"
          class="text-nw-text-dim hover:text-nw-text text-base leading-none shrink-0 cursor-pointer"
          aria-label="Close notification"
          @focus="pauseTimer(toast.id)"
          @blur="resumeTimer(toast.id)"
        >
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
