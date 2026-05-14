<!--
  AsyncState is the canonical loading/error/empty wrapper for async data in
  this project. It satisfies issue #30: instead of separate LoadingSpinner
  and ErrorMessage components, a single slotted wrapper handles all three
  states with consistent semantics (role="status" / role="alert") and
  optional Nightwire panel chrome for in-page placement.

  Variants:
  - `plain` (default) — renders centered text; use inside an existing panel.
  - `panel` — renders the full Nightwire panel shell (header + body); use
    when AsyncState is the top-level UI of a page section.

  For global uncaught errors, see `src/error.vue` (Nuxt 3 error page).
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  loading?: boolean
  error?: Error | string | null
  empty?: boolean
  loadingText?: string
  errorText?: string
  emptyText?: string
  variant?: 'plain' | 'panel'
  panelHeader?: string
  errorCode?: string
}

const props = withDefaults(defineProps<Props>(), {
  loadingText: 'Loading...',
  errorText: 'An error occurred',
  emptyText: 'No data available',
  variant: 'plain',
  panelHeader: 'STATUS',
})

defineSlots<{
  loading?: () => void
  error?: (props: { error: Error | string | null }) => void
  empty?: () => void
  default?: () => void
}>()

// Sanitized error message for display (prevents leaking sensitive info)
const sanitizedError = computed(() => {
  if (!props.error) return null
  if (typeof props.error === 'string') return props.error
  return props.error.message || 'An unexpected error occurred'
})

const isPanel = computed(() => props.variant === 'panel')
const stateClasses = computed(() => isPanel.value ? 'panel-body p-12 text-center' : 'text-center py-8')
</script>

<template>
  <div v-if="isPanel" class="panel">
    <div class="panel-header">
      <span>{{ panelHeader }}</span>
    </div>
    <div v-if="loading" :class="stateClasses" role="status" aria-live="polite">
      <slot name="loading">
        <p class="text-nw-text-dim font-stamp uppercase tracking-wider text-xs">{{ loadingText }}</p>
      </slot>
    </div>
    <div v-else-if="error" :class="stateClasses" role="alert">
      <slot name="error" :error="error">
        <p class="text-nw-red font-stamp uppercase tracking-wider text-xs">
          <span v-if="errorCode">[ERR-{{ errorCode }}] </span>{{ sanitizedError ?? errorText }}
        </p>
      </slot>
    </div>
    <div v-else-if="empty" :class="stateClasses">
      <slot name="empty">
        <p class="text-nw-text-dim font-stamp uppercase tracking-wider text-xs">{{ emptyText }}</p>
      </slot>
    </div>
    <slot v-else />
  </div>

  <div v-else>
    <div v-if="loading" class="text-center py-8" role="status" aria-live="polite">
      <slot name="loading">
        <p class="text-nw-text-dim">{{ loadingText }}</p>
      </slot>
    </div>

    <div v-else-if="error" class="text-center py-8 text-nw-red" role="alert">
      <slot name="error" :error="error">
        <p><span v-if="errorCode">[ERR-{{ errorCode }}] </span>{{ sanitizedError ?? errorText }}</p>
      </slot>
    </div>

    <div v-else-if="empty" class="text-center py-8">
      <slot name="empty">
        <p class="text-nw-text-dim">{{ emptyText }}</p>
      </slot>
    </div>

    <slot v-else />
  </div>
</template>
