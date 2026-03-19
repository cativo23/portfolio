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

const typeConfig: Record<'success' | 'error' | 'warning' | 'info', { border: string; icon: string; iconColor: string }> = {
  success: { border: 'border-tokyo-night-green', icon: '✓', iconColor: 'text-tokyo-night-green' },
  error: { border: 'border-tokyo-night-red', icon: '✕', iconColor: 'text-tokyo-night-red' },
  warning: { border: 'border-tokyo-night-yellow', icon: '⚠', iconColor: 'text-tokyo-night-yellow' },
  info: { border: 'border-tokyo-night-cyan', icon: 'ℹ', iconColor: 'text-tokyo-night-cyan' },
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
          'bg-tokyo-night-dark rounded-lg border border-l-4 p-3 font-mono text-sm shadow-lg',
          'flex items-start gap-3',
          typeConfig[toast.type].border,
        ]"
        role="alert"
        aria-live="assertive"
        @mouseenter="pauseTimer(toast.id)"
        @mouseleave="resumeTimer(toast.id)"
        @keydown.escape="onClose(toast.id)"
        @vue:mounted="onToastEnter(toast)"
      >
        <span :class="[typeConfig[toast.type].iconColor, 'text-base leading-none shrink-0']">
          {{ typeConfig[toast.type].icon }}
        </span>
        <span class="text-tokyo-night-text flex-1 break-words">{{ toast.message }}</span>
        <button
          @click="onClose(toast.id)"
          class="text-tokyo-night-muted hover:text-tokyo-night-text text-base leading-none shrink-0 cursor-pointer"
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
