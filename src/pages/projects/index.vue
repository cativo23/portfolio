<template>
  <div>
    <BaseSectionHeading title="My Projects" />

    <!-- Projects Grid -->
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <AsyncState :loading="loading" :error="error" :empty="displayed.length === 0">
        <template #loading>
          <div class="col-span-1 md:col-span-2" role="status" aria-live="polite">Loading projects...</div>
        </template>
        <template #error>
          <div class="col-span-1 text-red-400 md:col-span-2" role="alert">Failed to load projects</div>
        </template>
        <template #empty>
          <div class="col-span-1 md:col-span-2 text-tokyo-night-text">No projects found.</div>
        </template>
        <BaseCard :to="`/projects/${project.id}`" :key="project.id || project.title" :prefetch="false" v-for="project in displayed">
        <h3 class="mb-4 text-2xl font-bold">{{ project.title }}</h3>
        <p class="mb-4">{{ project.description }}</p>
        <div class="flex items-center mb-4 text-tokyo-night-cyan">
          <LucideCode class="w-5 h-5 mr-2" />
          <span>{{ techList(project) }}</span>
        </div>
        <div class="justify-start card-actions" @click.stop>
          <BaseButton variant="ghost" :href="project.repoUrl" external>
            <LucideGithub class="w-5 h-5 mr-2" />View on GitHub
          </BaseButton>
          <BaseButton v-if="project.liveUrl" variant="ghost" :href="project.liveUrl" external>
            <LucideExternalLink class="w-5 h-5 mr-2" />Live Demo
          </BaseButton>
        </div>
      </BaseCard>
      </AsyncState>
    </div>

    <!-- Pagination -->
    <BasePagination
      v-if="pagination"
      :pagination="pagination"
      @page-change="handlePageChange"
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
  const raw = Number(route.query.page)
  if (!Number.isFinite(raw) || raw < 1) return 1
  return Math.floor(raw)
})

const itemsPerPage = 6

const displayed = computed(() => projects.value ?? [])

async function loadProjects(page: number = currentPage.value) {
  try {
    await fetchProjects({
      page,
      per_page: itemsPerPage,
    })

    // Update URL without navigation
    if (import.meta.client) {
      router.replace({
        query: {
          ...route.query,
          page: page > 1 ? page : undefined,
        },
      })
    }
    return projects.value
  } catch (_e) {
    // error ref already set by composable
    return []
  }
}

function handlePageChange(page: number) {
  loadProjects(page)
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

await useAsyncData('projects-page', () => loadProjects())

function techList(project: Project) {
  return project.techStack?.join(', ') ?? ''
}
</script>