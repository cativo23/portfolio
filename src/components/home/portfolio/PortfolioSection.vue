<template>
  <section class="mb-16">
    <BaseSectionHeading title="Featured Projects" animated :level="3" />
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <template v-if="loading">
        <div class="col-span-1 md:col-span-2">Loading projects...</div>
      </template>
      <template v-else-if="error">
        <div class="col-span-1 text-red-400 md:col-span-2">Failed to load projects</div>
      </template>
      <div v-else v-for="project in displayed" :key="project.id || project.title">
        <FeatureProjectCard :project="project" />
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useProjects } from '~/composables/useProjects'

const { projects, loading, error, fetchProjects } = useProjects()

await useAsyncData('featured-projects', () =>
  fetchProjects({ is_featured: true }).catch(() => undefined)
)

const displayed = computed(() => projects.value ?? [])
</script>

<style></style>
