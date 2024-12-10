<template>
  <div class="bg-tokyo-night-dark p-6 rounded-lg hover:shadow-lg transition-shadow duration-200 hover:curso">
    <h4 class="text-xl text-tokyo-night-highlight font-bold mb-2">{{ project.title }}</h4>
    <p class="mb-4">{{ project.description }}</p>
    <div class="flex items-center text-tokyo-night-green">
      <LucideCode class="w-5 h-5 mr-2" />
      <span>{{ project.tech.join(', ') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
/* Add your styles here */
</style>