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
      'font-bold text-tokyo-night-highlight font-mono',
      level === 2 ? 'text-3xl' : 'text-2xl',
    ]">
      <span class="text-tokyo-night-purple">❯</span>
      <DecryptedText
        v-if="animated"
        :text="title"
        animateOn="view"
        class="text-tokyo-night-cyan font-bold"
        encryptedClassName="text-opacity-60"
        :speed="speed"
        :maxIterations="maxIterations"
        :sequential="true"
        :revealDirection="revealDirection"
      />
      <template v-else>{{ title }}</template>
    </component>
    <p v-if="slots.subtitle" class="text-tokyo-night-muted mt-2 font-mono">
      <slot name="subtitle" />
    </p>
  </div>
</template>
