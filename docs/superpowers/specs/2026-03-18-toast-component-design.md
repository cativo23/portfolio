# Design: Accessible Toast Notification System (#28)

## Goal

Create a toast notification system with ARIA live regions, replacing inline success/error messages in Contact.vue with transient, accessible toast notifications.

## Scope

**In scope:** `useToast` composable, `BaseToast` component, refactor Contact.vue to use toasts.

**Out of scope:** Persistent notifications, notification history, notification center.

## Tech Stack

- Vue 3 Composition API with `<script setup lang="ts">`
- Nuxt 3 `useState` for SSR-safe singleton state
- Tailwind CSS with Tokyo Night palette
- No external dependencies

## Architecture

Two pieces:

| Piece | File | Purpose |
|-------|------|---------|
| `useToast` composable | `src/composables/useToast.ts` | Singleton state + `show()` / `remove()` / shorthand API |
| `BaseToast` component | `src/components/base/Toast.vue` | Renders toast stack, ARIA live region, auto-dismiss timers |

**Data flow:** Component calls `useToast().success('msg')` → composable adds toast to reactive array via `useState` → `BaseToast` (mounted once in `app.vue`) renders the stack → auto-dismiss or manual close removes it.

## useToast Composable (`src/composables/useToast.ts`)

### Toast Item Interface

```typescript
interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number  // ms, 0 = no auto-dismiss
}
```

### API

```typescript
interface UseToastReturn {
  toasts: Ref<ToastItem[]>
  show: (options: { message: string; type?: ToastItem['type']; duration?: number }) => string
  success: (message: string, duration?: number) => string
  error: (message: string, duration?: number) => string
  warning: (message: string, duration?: number) => string
  info: (message: string, duration?: number) => string
  remove: (id: string) => void
  clear: () => void
}
```

### Default Durations

| Type | Duration | Behavior |
|------|----------|----------|
| `success` | 5000ms | Auto-dismiss |
| `info` | 5000ms | Auto-dismiss |
| `warning` | 0 | Stays until closed |
| `error` | 0 | Stays until closed |

Callers can override duration per toast (e.g., `toast.success('Done', 3000)`).

### Singleton State

Uses `useState<ToastItem[]>('toasts', () => [])` for SSR-safe shared state across all components.

### ID Generation

Each toast gets a unique id: `Date.now().toString(36) + Math.random().toString(36).slice(2)`.

## BaseToast Component (`src/components/base/Toast.vue`)

### Position

Fixed top-right: `fixed top-4 right-4 z-50`. Toasts stack vertically with `flex flex-col gap-3`.

### Visual Design per Type

All toasts share: `bg-tokyo-night-dark rounded-lg border border-l-4 p-3 font-mono text-sm shadow-lg`

| Type | Border/Left color | Icon |
|------|-------------------|------|
| `success` | `border-tokyo-night-green` | `✓` in `text-tokyo-night-green` |
| `error` | `border-tokyo-night-red` | `✕` in `text-tokyo-night-red` |
| `warning` | `border-tokyo-night-yellow` | `⚠` in `text-tokyo-night-yellow` |
| `info` | `border-tokyo-night-cyan` | `ℹ` in `text-tokyo-night-cyan` |

Message text: `text-tokyo-night-text`. Close button: `text-tokyo-night-muted hover:text-tokyo-night-text`, with `aria-label="Close notification"`.

### Layout per Toast

```
[icon] [message text.......................] [×]
```

Flexbox row: `flex items-start gap-3`. Icon and close button are fixed width, message fills remaining space.

### Auto-dismiss

- Toasts with `duration > 0` auto-remove after the specified time
- Timer **pauses** on mouse hover or keyboard focus (a11y best practice — users need time to read)
- Timer **resumes** on mouse leave / blur
- Implemented with `setTimeout` + tracking remaining time on pause

### Accessibility

- Container: `role="region"` + `aria-label="Notifications"`
- Each toast: `role="alert"` + `aria-live="assertive"` (screen readers announce immediately)
- Close button: `<button aria-label="Close notification">`
- Keyboard: close button is focusable, Escape key while focused closes the toast

### Animation

Simple CSS transitions:
- Enter: slide in from right (`translate-x-full` → `translate-x-0`) + fade in
- Exit: fade out (`opacity-0`) + slide right

Use Vue's `<TransitionGroup>` with `name="toast"`.

## Mounting in app.vue

Add `<BaseToast />` at the root level in `src/app.vue` (or layout) so it's always available:

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <BaseToast />
</template>
```

## Refactoring: Contact.vue

Replace the inline error/success `<div>` elements (lines 30-31) with `useToast()` calls:

```typescript
const toast = useToast()

// In submitForm, on success:
toast.success('Message sent successfully!')

// On API error:
toast.error(msg)

// On network error:
toast.error('Network error. Please try again.')
```

Remove:
- `<div v-if="error" class="text-tokyo-night-red font-mono">{{ error }}</div>`
- `<div v-if="success" class="text-tokyo-night-green font-mono">Message sent successfully!</div>`
- The `success` ref (no longer needed)
- The `error` ref for form-level API errors (validation errors still stay inline via BaseInput/BaseTextarea `error` prop)

Keep: The `error` ref can be repurposed or removed. Validation errors (from `validateForm()`) should stay inline on the form fields via the `error` prop on BaseInput/BaseTextarea. API/network errors go to toast.

## Constraints

- All components use `<script setup lang="ts">` with TypeScript interfaces
- Follow existing Tokyo Night tokens from `tailwind.config.js`
- No external dependencies
- Nuxt auto-import for composable and component
- Must work with SSR (no direct `window`/`document` access outside client guards)
