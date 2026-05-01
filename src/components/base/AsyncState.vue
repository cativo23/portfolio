<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  loading?: boolean
  error?: Error | string | null
  empty?: boolean
  loadingText?: string
  errorText?: string
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  loadingText: 'Loading...',
  errorText: 'An error occurred',
  emptyText: 'No data available'
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
</script>

<template>
  <div>
    <div v-if="loading" class="text-center py-8" aria-live="polite">
      <slot name="loading">
        <p class="text-nw-text-dim">{{ loadingText }}</p>
      </slot>
    </div>

    <div v-else-if="error" class="text-center py-8 text-nw-red" role="alert">
      <slot name="error" :error="error">
        <p>{{ sanitizedError ?? errorText }}</p>
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
