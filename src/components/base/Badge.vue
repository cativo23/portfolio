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
  cyan: 'bg-nw-cyan/10 text-nw-cyan',
  magenta: 'bg-nw-purple/10 text-nw-purple',
  green: 'bg-nw-green/10 text-nw-green',
  yellow: 'bg-nw-yellow/10 text-nw-yellow',
  muted: 'bg-nw-text-line/10 text-nw-text-dim',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}
</script>

<template>
  <span :class="['inline-block rounded-full font-sys', colorClasses[props.color], sizeClasses[props.size]]">
    <slot />
  </span>
</template>
