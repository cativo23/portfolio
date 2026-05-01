<template>
  <span
    class="inline-flex items-center gap-2"
    role="status"
    :aria-label="ariaLabel || (text ? undefined : status)"
  >
    <span class="led" :class="[ledColor, { blink: pulse }, sizeClasses]" />
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

const ledMap: Record<Props['status'], string> = {
  success: 'green',
  error: 'red',
  warning: 'yellow',
  info: 'blue',
  unknown: ''
};

const sizeMap: Record<NonNullable<Props['size']>, string> = {
  sm: '!w-1.5 !h-1.5',
  md: '',
  lg: '!w-3 !h-3'
};

const ledColor = computed(() => ledMap[props.status]);
const sizeClasses = computed(() => sizeMap[props.size]);
</script>
