<script setup lang="ts">
import { useSlots } from 'vue'

interface Props {
  hoverable?: boolean
  padded?: boolean
}

withDefaults(defineProps<Props>(), {
  hoverable: true,
  padded: true,
})

const slots = useSlots()
</script>

<template>
  <div
    :class="[
      'relative bg-tokyo-night-dark rounded-lg transition-shadow duration-200',
      hoverable && 'hover:shadow-lg',
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
    <div v-if="slots.footer" class="border-t border-tokyo-night-gray/20 pt-4 mt-4 px-6 pb-6">
      <slot name="footer" />
    </div>
  </div>
</template>
