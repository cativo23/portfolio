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
  primary: 'btn',
  secondary: 'btn-ghost',
  ghost: 'btn-ghost border-transparent hover:bg-nw-primary-fill',
  icon: 'btn-ghost inline-flex items-center justify-center',
}

const sizeClasses = computed(() => {
  if (props.variant === 'icon') {
    return { sm: 'w-8 h-8 p-0', md: 'w-10 h-10 p-0', lg: 'w-12 h-12 p-0' }[props.size]
  }
  if (props.size === 'sm') return 'btn-sm'
  if (props.size === 'lg') return 'text-base px-6 py-3'
  return ''
})

const classes = computed(() => [
  'relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-nw-primary',
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
