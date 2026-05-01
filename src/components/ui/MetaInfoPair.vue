<template>
  <div :class="wrapperClasses">
    <span :class="labelClasses">
      <slot name="label">{{ label }}</slot>
    </span>
    <span :class="valueClasses">
      <slot>{{ value }}</slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string;
  value: string | number;
  horizontal?: boolean;
  color?: 'success' | 'error' | 'warning' | 'info' | 'default';
}

const props = withDefaults(defineProps<Props>(), {
  horizontal: false,
  color: 'default'
});

const wrapperClasses = computed(() => [
  'flex',
  props.horizontal ? 'flex-row justify-between items-center' : 'flex-col'
]);

const labelClasses = computed(() => [
  'text-nw-text-dim',
  'text-sm'
]);

const valueColorMap: Record<NonNullable<Props['color']>, string> = {
  success: 'text-nw-green',
  error: 'text-nw-red',
  warning: 'text-nw-yellow',
  info: 'text-nw-cyan',
  default: 'text-nw-text'
};

const valueClasses = computed(() => [
  'font-medium',
  valueColorMap[props.color]
]);
</script>
