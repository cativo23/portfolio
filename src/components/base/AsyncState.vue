<script setup lang="ts">
defineProps<{
  loading?: boolean
  error?: Error | string | null
  empty?: boolean
  loadingText?: string
  errorText?: string
  emptyText?: string
}>()

defineSlots<{
  loading?: () => unknown
  error?: (props: { error: Error | string | null }) => unknown
  empty?: () => unknown
  default?: () => unknown
}>()
</script>

<template>
  <div>
    <div v-if="loading" class="text-center py-8" aria-live="polite">
      <slot name="loading">
        <p class="text-tokyo-night-fg-muted">{{ loadingText }}</p>
      </slot>
    </div>

    <div v-else-if="error" class="text-center py-8 text-tokyo-night-red" role="alert">
      <slot name="error" :error="error">
        <p>{{ typeof error === 'string' ? error : errorText }}</p>
      </slot>
    </div>

    <div v-else-if="empty" class="text-center py-8">
      <slot name="empty">
        <p class="text-tokyo-night-fg-muted">{{ emptyText }}</p>
      </slot>
    </div>

    <slot v-else />
  </div>
</template>
