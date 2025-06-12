<template>
  <span :class="[
    'inline-block text-tokyo-night-dark px-3 py-1 rounded-full text-sm mr-2 mb-2',
    {
      'bg-tokyo-night-red': level === 'advanced',
      'bg-tokyo-night-yellow': level === 'intermediate',
      'bg-tokyo-night-green': level === 'beginner'
    }
  ]">
    {{ name }}
  </span>
</template>

<script setup lang="ts">

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  }
});
</script>