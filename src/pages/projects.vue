<template>
  <div>
    <h2 class="mb-8 text-3xl font-bold text-tokyo-night-cyan">My Projects</h2>
    
    <!-- Projects Grid -->
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <template v-if="loading">
        <div class="col-span-1 md:col-span-2">Loading projects...</div>
      </template>
      <template v-else-if="error">
        <div class="col-span-1 text-red-400 md:col-span-2">Failed to load projects</div>
      </template>
      <template v-else-if="displayed.length === 0">
        <div class="col-span-1 md:col-span-2 text-tokyo-night-text">No projects found.</div>
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

    <!-- Pagination -->
    <UiPagination 
      v-if="pagination" 
      :pagination="pagination" 
      :on-page-change="handlePageChange" 
    />
  </div>
</template>

<script lang="ts" setup>
import { useProjects } from '~/composables/useProjects'
import type { Project } from '~/types/project'

usePageTitle('Projects', {
  description: 'Explore my projects showcasing backend development skills, including API gateways, data pipelines, and microservices.',
})

const route = useRoute()
const router = useRouter()
const { projects, pagination, loading, error, fetchProjects } = useProjects()

// Get page from query params, default to 1
const currentPage = computed(() => {
  const page = route.query.page
  return page ? parseInt(String(page), 10) : 1
})

const itemsPerPage = ref(6) // Default items per page

const displayed = computed(() => projects.value ?? [])

async function loadProjects(page: number = currentPage.value) {
  try {
    await fetchProjects({
      page,
      per_page: itemsPerPage.value,
    })
    
    // Update URL without navigation
    router.replace({
      query: {
        ...route.query,
        page: page > 1 ? page : undefined,
      },
    })
  } catch (e) {
    // Optionally handle error, e.g., log or notify
    console.error('Error fetching projects:', e)
  }
}

function handlePageChange(page: number) {
  loadProjects(page)
  // Scroll to top of page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  await loadProjects()
})

function techList(project: Project) {
  const t = project?.techStack
  if (!t) return ''
  if (Array.isArray(t)) return t.join(', ')
  return String(t)
}
</script>