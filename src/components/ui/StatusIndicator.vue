<template>
  <span
    class="inline-flex items-center gap-1.5"
    role="status"
    :aria-label="ariaLabel || (text ? undefined : status)"
  >
    <span
      :class="[
        'rounded-full',
        sizeClasses,
        colorClasses,
        { 'animate-pulse': pulse }
      ]"
    />
    <span v-if="text || $slots.default" class="text-tokyo-night-foreground text-sm">
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

const colorMap: Record<Props['status'], string> = {
  success: 'bg-tokyo-night-green',
  error: 'bg-tokyo-night-red',
  warning: 'bg-tokyo-night-yellow',
  info: 'bg-tokyo-night-cyan',
  unknown: 'bg-tokyo-night-muted'
};

const sizeMap: Record<NonNullable<Props['size']>, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-3 h-3'
};

const colorClasses = computed(() => colorMap[props.status]);
const sizeClasses = computed(() => sizeMap[props.size]);
</script>
