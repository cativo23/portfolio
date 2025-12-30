<template>
  <div>
    <h2 class="text-3xl font-bold mb-8 text-tokyo-night-cyan">My Projects</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <template v-if="loading">
        <div class="col-span-1 md:col-span-2">Loading projects...</div>
      </template>
      <template v-else-if="error">
        <div class="col-span-1 md:col-span-2 text-red-400">Failed to load projects</div>
      </template>
      <div v-else v-for="project in displayed" :key="project.id || project.title"
        class="bg-tokyo-night-dark p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
        <h3 class="text-2xl font-bold mb-4">{{ project.title }}</h3>
        <p class="mb-4">{{ project.description }}</p>
        <div class="flex items-center text-tokyo-night-cyan mb-4">
          <LucideCode class="w-5 h-5 mr-2" />
          <span>{{ techList(project) }}</span>
        </div>
        <div class="card-actions justify-start">
          <a :href="project.github" target="_blank" rel="noopener noreferrer"
            class="btn inline-flex items-center text-tokyo-night-purple hover:text-tokyo-night-cyan transition-colors duration-200">
            <LucideGithub class="w-5 h-5 mr-2" />View on GitHub
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onMounted, computed } from 'vue'
import { useProjects } from '~/composables/useProjects'

usePageTitle('Projects', {
  description: 'Explore my projects showcasing backend development skills, including API gateways, data pipelines, and microservices.',
});

const { projects, loading, error, fetchProjects } = useProjects()

onMounted(async () => {
  try {
    await fetchProjects()
  } catch (e) {
    // error ref will be populated
  }
})

const displayed = computed(() => projects.value ?? [])

function techList(project: any) {
  const t = project?.tech
  if (!t) return ''
  if (Array.isArray(t)) return t.join(', ')
  return String(t)
}
</script>