<template>
  <div class="p-6 transition-shadow duration-200 rounded-lg cursor-pointer bg-tokyo-night-dark hover:shadow-lg">
    <h4 class="mb-2 text-xl font-bold text-tokyo-night-highlight">{{ project.title }}</h4>
    <p class="mb-4">{{ project.description }}</p>
    <div class="flex items-center text-tokyo-night-green">
      <LucideCode class="w-5 h-5 mr-2" />
      <span>{{ techList }}</span>
    </div>
    <div v-if="project.is_featured" class="mt-3">
      <span class="inline-block px-2 py-1 text-xs text-black rounded bg-tokyo-night-highlight">Featured</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '~/types/project'

interface Props {
  project: Project
}

const props = defineProps<Props>()

const techList = computed(() => {
  const t = props.project.techStack
  if (!t) return ''
  if (Array.isArray(t)) return t.join(', ')
  return String(t)
})
</script>

<style scoped>
/* Add your styles here */
</style>