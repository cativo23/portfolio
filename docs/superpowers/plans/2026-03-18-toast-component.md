# Toast Notification System Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an accessible toast notification system with composable API, replacing inline success/error messages in Contact.vue.

**Architecture:** `useToast` composable manages a singleton toast queue via Nuxt `useState`. `BaseToast` component renders the stack fixed top-right with ARIA live regions, auto-dismiss with pause-on-hover, and CSS transitions. Contact.vue is refactored to use `toast.success()` / `toast.error()` for API responses.

**Tech Stack:** Vue 3 Composition API, Nuxt 3 useState, Tailwind CSS, TypeScript

**Important constraint:** No Node/yarn on host. Docker build verification: `docker compose build && docker compose up -d`, then `curl http://localhost:3001`.

**Spec:** `docs/superpowers/specs/2026-03-18-toast-component-design.md`

---

## Chunk 1: Toast System + Refactor

### Task 1: Create useToast composable

**Files:**
- Create: `src/composables/useToast.ts`

- [ ] **Step 1: Create the composable**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useToast.ts
git commit -m "feat(ui): add useToast composable with singleton state"
```

---

### Task 2: Create BaseToast component

**Files:**
- Create: `src/components/base/Toast.vue`

- [ ] **Step 1: Create the component**

```vue
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

const typeConfig: Record<string, { border: string; icon: string; iconColor: string }> = {
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
        @mouseenter="pauseTimer(toast.id)"
        @mouseleave="resumeTimer(toast.id)"
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
```

Note on `@vue:mounted`: This is a Vue 3 lifecycle event on the element that fires when each toast item enters the DOM — used to start the auto-dismiss timer. Alternative: use a `watch` on `toasts` array to start timers for new items.

- [ ] **Step 2: Commit**

```bash
git add src/components/base/Toast.vue
git commit -m "feat(ui): add BaseToast component with ARIA live regions and auto-dismiss"
```

---

### Task 3: Mount BaseToast in app.vue

**Files:**
- Modify: `src/app.vue`

- [ ] **Step 1: Add BaseToast after the root div**

In `src/app.vue`, add `<BaseToast />` just before the closing `</template>`, after the root `<div>`:

```vue
<template>
  <div class="flex flex-col min-h-screen bg-tokyo-night-bg text-tokyo-night-text font-mono">
    <NuxtLoadingIndicator :height="1" :throttle="100" color="#f471B5" />
    <NuxtRouteAnnouncer>
      <template #default="{ message }">
        <p>{{ message }} was loaded.</p>
      </template>
    </NuxtRouteAnnouncer>
    <!-- Header -->
    <Header />
    <!-- Main Content -->
    <main class="container mx-auto p-4 flex-grow">
      <NuxtPage />
    </main>
    <!-- Footer -->
    <Footer />
  </div>
  <BaseToast />
</template>
```

`<BaseToast />` is outside the main div so it's not affected by the page layout's flex container. It uses `position: fixed` so it renders on top of everything.

- [ ] **Step 2: Commit**

```bash
git add src/app.vue
git commit -m "feat(ui): mount BaseToast in app.vue for global notifications"
```

---

### Task 4: Refactor Contact.vue to use toast

**Files:**
- Modify: `src/components/home/Contact.vue`

- [ ] **Step 1: Replace API success/error with toast calls**

In the `<script>` section, add at the top (after imports):
```typescript
const toast = useToast()
```

In `submitForm()`, replace the success block:
```typescript
// OLD:
success.value = true;
form.value = { name: '', email: '', message: '', subject: '' };

// NEW:
toast.success('Message sent successfully!')
form.value = { name: '', email: '', message: '', subject: '' };
```

Replace the API error block:
```typescript
// OLD:
const msg = data.error?.message || 'Failed to send message';
error.value = msg;

// NEW:
const msg = data.error?.message || 'Failed to send message';
toast.error(msg);
```

Replace the network error catch:
```typescript
// OLD:
error.value = 'Network error. Please try again.';

// NEW:
toast.error('Network error. Please try again.');
```

Remove the `success` ref declaration (line `const success = ref(false);`).

Remove the inline success div from the template:
```html
<!-- REMOVE THIS LINE: -->
<div v-if="success" class="text-tokyo-night-green font-mono">Message sent successfully!</div>
```

Keep the `error` ref and the inline `<div v-if="error">` — they're still used by `validateForm()` for inline validation messages.

In `submitForm()`, keep `error.value = null;` at the start (resets validation errors). But don't set `error.value` for API/network errors anymore — those go to toast.

- [ ] **Step 2: Commit**

```bash
git add src/components/home/Contact.vue
git commit -m "refactor(ui): use toast notifications for Contact form API feedback"
```

---

### Task 5: Verify build

- [ ] **Step 1: Build and test**

```bash
docker compose build
docker compose up -d
sleep 20
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001
# Expected: 200
docker compose down
```

- [ ] **Step 2: Close issue**

```bash
gh issue close 28
```
