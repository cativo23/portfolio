<template>
  <div>
    <h2 class="mb-8 text-3xl font-bold text-tokyo-night-cyan">My Projects</h2>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <template v-if="loading">
        <div class="col-span-1 md:col-span-2">Loading projects...</div>
      </template>
      <template v-else-if="error">
        <div class="col-span-1 text-red-400 md:col-span-2">Failed to load projects</div>
      </template>
      <div v-else v-for="project in displayed" :key="project.id || project.title"
        class="p-6 transition-shadow duration-200 rounded-lg bg-tokyo-night-dark hover:shadow-lg">
        <h3 class="mb-4 text-2xl font-bold">{{ project.title }}</h3>
        <p class="mb-4">{{ project.description }}</p>
        <div class="flex items-center mb-4 text-tokyo-night-cyan">
          <LucideCode class="w-5 h-5 mr-2" />
          <span>{{ techList(project) }}</span>
        </div>
        <div class="justify-start card-actions">
          <a :href="project.repoUrl" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center transition-colors duration-200 btn text-tokyo-night-purple hover:text-tokyo-night-cyan">
            <LucideGithub class="w-5 h-5 mr-2" />View on GitHub
          </a>
          <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center p-6 duration-200 tranition-colors btn text-tokyo-night-purple hover:text-tokyo-night-cyan">
            <LucideExternalLink class="w-5 h-5 mr-2" />Live Demo
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useProjects } from '~/composables/useProjects';
import type { Project } from '~/types/project';

usePageTitle('Projects', {
  description: 'Explore my projects showcasing backend development skills, including API gateways, data pipelines, and microservices.',
});

const { projects, loading, error, fetchProjects } = useProjects()

onMounted(async () => {
  try {
    await fetchProjects()
  } catch (e) {
    // Optionally handle error, e.g., log or notify
    console.error('Error fetching projects:', e)
  }
})

const displayed = computed(() => projects.value ?? [])

function techList(project: Project) {
  const t = project?.techStack
  if (!t) return ''
  if (Array.isArray(t)) return t.join(', ')
  return String(t)
}
</script>