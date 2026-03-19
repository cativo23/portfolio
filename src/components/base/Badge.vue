<script setup lang="ts">
interface Props {
  color?: 'cyan' | 'magenta' | 'green' | 'yellow' | 'muted'
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'cyan',
  size: 'md',
})

const colorClasses: Record<string, string> = {
  cyan: 'bg-tokyo-night-cyan/10 text-tokyo-night-cyan',
  magenta: 'bg-tokyo-night-magenta/10 text-tokyo-night-magenta',
  green: 'bg-tokyo-night-green/10 text-tokyo-night-green',
  yellow: 'bg-tokyo-night-yellow/10 text-tokyo-night-yellow',
  muted: 'bg-tokyo-night-gray/10 text-tokyo-night-muted',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}
</script>

<template>
  <span :class="['inline-block rounded-full font-mono', colorClasses[props.color], sizeClasses[props.size]]">
    <slot />
  </span>
</template>
