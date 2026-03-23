<script setup lang="ts">
import { useSlots } from 'vue'

interface Props {
  hoverable?: boolean
  padded?: boolean
  to?: string
  href?: string
  external?: boolean
  prefetch?: boolean
}

withDefaults(defineProps<Props>(), {
  hoverable: true,
  padded: true,
  prefetch: true,
})

const slots = useSlots()
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :prefetch="prefetch"
    :class="[
      'relative bg-tokyo-night-dark border border-tokyo-night-gray/30 rounded transition-all duration-200 block text-tokyo-night-blue',
      hoverable && 'hover:border-tokyo-night-blue',
    ]"
  >
    <div v-if="slots.badge" class="absolute top-3 right-3 z-10">
      <slot name="badge" />
    </div>
    <div v-if="slots.header">
      <slot name="header" />
    </div>
    <div :class="padded && 'p-6'">
      <slot />
    </div>
    <div v-if="slots.footer" class="border-t border-tokyo-night-gray/30 pt-4 mt-4 px-6 pb-6">
      <slot name="footer" />
    </div>
  </NuxtLink>

  <a
    v-else-if="href"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :class="[
      'relative bg-tokyo-night-dark border border-tokyo-night-gray/30 rounded transition-all duration-200 block text-tokyo-night-blue',
      hoverable && 'hover:border-tokyo-night-blue',
    ]"
  >
    <div v-if="slots.badge" class="absolute top-3 right-3 z-10">
      <slot name="badge" />
    </div>
    <div v-if="slots.header">
      <slot name="header" />
    </div>
    <div :class="padded && 'p-6'">
      <slot />
    </div>
    <div v-if="slots.footer" class="border-t border-tokyo-night-gray/30 pt-4 mt-4 px-6 pb-6">
      <slot name="footer" />
    </div>
  </a>

  <div
    v-else
    :class="[
      'relative bg-tokyo-night-dark border border-tokyo-night-gray/30 rounded transition-all duration-200',
      hoverable && 'hover:border-tokyo-night-blue',
    ]"
  >
    <div v-if="slots.badge" class="absolute top-3 right-3 z-10">
      <slot name="badge" />
    </div>
    <div v-if="slots.header">
      <slot name="header" />
    </div>
    <div :class="padded && 'p-6'">
      <slot />
    </div>
    <div v-if="slots.footer" class="border-t border-tokyo-night-gray/30 pt-4 mt-4 px-6 pb-6">
      <slot name="footer" />
    </div>
  </div>
</template>
