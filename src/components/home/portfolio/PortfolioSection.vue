<template>
  <section class="mb-16">
    <BaseSectionHeading title="Featured Projects" animated :level="3" />
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <!-- Loading State -->
      <template v-if="loading">
        <div class="col-span-1 md:col-span-2 text-center py-8" role="status" aria-live="polite">
          <span class="text-tokyo-night-muted">Loading projects...</span>
        </div>
      </template>

      <!-- Error State -->
      <template v-else-if="error">
        <div class="col-span-1 md:col-span-2 text-center py-8 text-red-400" role="alert">
          Failed to load projects
        </div>
      </template>

      <!-- Empty State -->
      <template v-else-if="displayed.length === 0">
        <div class="col-span-1 md:col-span-2 text-center py-8 text-tokyo-night-text">
          No projects found.
        </div>
      </template>

      <!-- Projects -->
      <div v-else v-for="project in displayed" :key="project.id || project.title">
        <FeatureProjectCard :project="project" />
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useProjects } from '~/composables/useProjects'
import FeatureProjectCard from '~/components/home/portfolio/FeatureProjectCard.vue'

const { projects, loading, error, fetchProjects } = useProjects()

// Fetch featured projects on server-side
await useAsyncData('featured-projects', () => fetchProjects({ is_featured: true }))

const displayed = computed(() => projects.value ?? [])
</script>

<style></style>
