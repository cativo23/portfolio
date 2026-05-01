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
      'card relative block h-full flex flex-col transition-colors duration-150',
      hoverable && 'hover:border-nw-primary-dim',
    ]"
  >
    <div v-if="slots.badge" class="absolute top-3 right-3 z-10">
      <slot name="badge" />
    </div>
    <div v-if="slots.header">
      <slot name="header" />
    </div>
    <div :class="padded && 'card-body'">
      <slot />
    </div>
    <div v-if="slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </NuxtLink>

  <a
    v-else-if="href"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :class="[
      'card relative block h-full flex flex-col transition-colors duration-150',
      hoverable && 'hover:border-nw-primary-dim',
    ]"
  >
    <div v-if="slots.badge" class="absolute top-3 right-3 z-10">
      <slot name="badge" />
    </div>
    <div v-if="slots.header">
      <slot name="header" />
    </div>
    <div :class="padded && 'card-body'">
      <slot />
    </div>
    <div v-if="slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </a>

  <div
    v-else
    :class="[
      'card relative h-full flex flex-col transition-colors duration-150',
      hoverable && 'hover:border-nw-primary-dim',
    ]"
  >
    <div v-if="slots.badge" class="absolute top-3 right-3 z-10">
      <slot name="badge" />
    </div>
    <div v-if="slots.header">
      <slot name="header" />
    </div>
    <div :class="padded && 'card-body'">
      <slot />
    </div>
    <div v-if="slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
