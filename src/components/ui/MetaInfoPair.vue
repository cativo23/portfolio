<template>
  <div :class="wrapperClasses">
    <dt :class="labelClasses">
      <slot name="label">{{ label }}</slot>
    </dt>
    <dd :class="valueClasses">
      <slot>{{ value }}</slot>
    </dd>
  </div>
</template>

<script setup lang="ts">
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
  'text-tokyo-night-muted',
  'text-sm'
]);

const valueColorMap: Record<NonNullable<Props['color']>, string> = {
  success: 'text-tokyo-night-green',
  error: 'text-tokyo-night-red',
  warning: 'text-tokyo-night-yellow',
  info: 'text-tokyo-night-cyan',
  default: 'text-tokyo-night-text'
};

const valueClasses = computed(() => [
  'font-medium',
  valueColorMap[props.color]
]);
</script>
