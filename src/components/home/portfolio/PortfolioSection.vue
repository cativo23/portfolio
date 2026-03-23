<template>
  <section class="mb-16">
    <BaseSectionHeading title="Featured Projects" animated :level="3" />
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <AsyncState :loading="loading" :error="error" :empty="displayed.length === 0">
        <template #loading>
          <div class="col-span-1 md:col-span-2" role="status" aria-live="polite">Loading projects...</div>
        </template>
        <template #empty>
          <div class="col-span-1 md:col-span-2 text-tokyo-night-text">No projects found.</div>
        </template>
        <template #error>
          <div class="col-span-1 text-red-400 md:col-span-2" role="alert">Failed to load projects</div>
        </template>
        <div v-for="project in displayed" :key="project.id || project.title">
          <FeatureProjectCard :project="project" />
        </div>
      </AsyncState>
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
