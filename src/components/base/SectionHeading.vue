<script setup lang="ts">
import { useSlots } from 'vue'

interface Props {
  title: string
  animated?: boolean
  level?: 2 | 3
  speed?: number
  maxIterations?: number
  revealDirection?: 'start' | 'center' | 'end'
}

withDefaults(defineProps<Props>(), {
  animated: false,
  level: 2,
  speed: 40,
  maxIterations: 10,
  revealDirection: 'start',
})

const slots = useSlots()
</script>

<template>
  <div class="mb-6">
    <component :is="'h' + level" :class="[
      'compressed-title text-nw-primary',
      level === 2 ? 'text-nw-3xl' : 'text-nw-2xl',
    ]">
      
      <DecryptedText
        v-if="animated"
        :text="title"
        animateOn="view"
        class="text-nw-primary"
        encryptedClassName="text-nw-text-dim opacity-60"
        :speed="speed"
        :maxIterations="maxIterations"
        :sequential="true"
        :revealDirection="revealDirection"
      />
      <template v-else>{{ title }}</template>
    </component>
    <p v-if="slots.subtitle" class="text-nw-text-dim mt-2">
      <slot name="subtitle" />
    </p>
  </div>
</template>
