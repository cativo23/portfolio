<template>
  <section class="mb-16">
    <h3 class="mb-6 text-2xl font-bold">
      <DecryptedText text="Featured Projects" animateOn="view" class="font-bold text-tokyo-night-cyan"
        encryptedClassName="text-opacity-60" :speed="40" :maxIterations="10" :sequential="true"
        revealDirection="start" />
    </h3>
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
import { onMounted, computed } from 'vue'
import FeatureProjectCard from './FeatureProjectCard.vue'
import { useProjects } from '~/composables/useProjects'

const { projects, loading, error, fetchProjects } = useProjects()

onMounted(async () => {
  // fetch only featured projects for this section
  try {
    await fetchProjects({ is_featured: true })
  } catch (e) {
    // swallow here; `error` ref contains details
    // TODO: surface error UI if desired
  }
})

const displayed = computed(() => projects.value ?? [])
</script>

<style></style>