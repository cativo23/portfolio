<template>
  <span
    class="inline-flex items-center gap-2"
    role="status"
    :aria-label="ariaLabel || (text ? undefined : status)"
  >
    <span class="led" :class="[{ blink: pulse }, sizeClasses]" :data-state="ledState || undefined" />
    <span v-if="text || $slots.default" class="text-nw-text text-sm">
      <slot>{{ text }}</slot>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: 'success' | 'error' | 'warning' | 'info' | 'unknown';
  text?: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  pulse: false,
  size: 'md',
  ariaLabel: ''
});

// Nightwire v3 colours the LED through data-state, not a colour class
const ledMap: Record<Props['status'], string> = {
  success: 'ok',
  error: 'error',
  warning: 'warn',
  info: 'active',
  unknown: ''
};

const sizeMap: Record<NonNullable<Props['size']>, string> = {
  sm: '!w-1.5 !h-1.5',
  md: '',
  lg: '!w-3 !h-3'
};

const ledState = computed(() => ledMap[props.status]);
const sizeClasses = computed(() => sizeMap[props.size]);
</script>
