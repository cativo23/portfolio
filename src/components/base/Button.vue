<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
  external?: boolean
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  external: false,
  disabled: false,
  loading: false,
  type: 'button',
})

const tag = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})

const variantClasses: Record<string, string> = {
  primary: 'bg-tokyo-night-cyan text-tokyo-night-bg font-semibold hover:opacity-90 transition-opacity',
  secondary: 'border border-tokyo-night-cyan text-tokyo-night-cyan hover:bg-tokyo-night-cyan/10 transition-colors',
  ghost: 'text-tokyo-night-text hover:text-tokyo-night-cyan transition-colors',
  icon: 'border border-tokyo-night-gray text-tokyo-night-muted hover:text-tokyo-night-cyan transition-colors inline-flex items-center justify-center',
}

const sizeClasses = computed(() => {
  if (props.variant === 'icon') {
    return { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' }[props.size]
  }
  return { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2 text-base', lg: 'px-7 py-3 text-lg' }[props.size]
})

const classes = computed(() => [
  'inline-flex items-center justify-center rounded-lg cursor-pointer',
  variantClasses[props.variant],
  sizeClasses.value,
  (props.disabled || props.loading) && 'opacity-50 pointer-events-none',
])

const linkProps = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) {
    const attrs: Record<string, string> = { href: props.href }
    if (props.external) {
      attrs.target = '_blank'
      attrs.rel = 'noopener noreferrer'
    }
    return attrs
  }
  return { type: props.type, disabled: props.disabled || props.loading }
})
</script>

<template>
  <component :is="tag" :class="classes" v-bind="linkProps">
    <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <span class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    </span>
    <span :class="{ invisible: loading }">
      <slot />
    </span>
  </component>
</template>
