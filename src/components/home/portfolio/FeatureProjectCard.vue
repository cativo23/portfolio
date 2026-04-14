<template>
  <BaseCard :to="`/projects/${project.id}`" hoverable class="h-full">
    <template v-if="project.isFeatured" #badge>
      <BaseBadge>Featured</BaseBadge>
    </template>
    <h4 class="mb-2 text-xl font-bold text-tokyo-night-blue">{{ project.title }}</h4>
    <p class="mb-4">{{ project.description }}</p>
    <div class="flex flex-wrap gap-2 mb-4" v-if="project.techStack?.length">
      <span
        v-for="tech in project.techStack"
        :key="tech"
        class="text-tokyo-night-green font-mono text-xs"
      >
        [{{ tech }}]
      </span>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { Project } from '~/types/project'

interface Props {
  project: Project
}

defineProps<Props>()
defineOptions({
  name: 'FeatureProjectCard'
})
</script>
