<template>
  <div>
    <BaseSectionHeading title="My Projects" />

    <!-- Projects Grid -->
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
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
      <BaseCard v-else :to="`/projects/${project.id}`" :key="project.id || project.title" :prefetch="false" v-for="project in displayed">
        <h3 class="mb-4 text-2xl font-bold">{{ project.title }}</h3>
        <p class="mb-4">{{ project.description }}</p>
        <div class="flex items-center mb-4 text-tokyo-night-cyan">
          <LucideCode class="w-5 h-5 mr-2" />
          <span>{{ techList(project) }}</span>
        </div>
        <div class="justify-start card-actions" @click.stop>
          <BaseButton variant="ghost" :href="sanitizeRepoUrl(project.repoUrl)" external>
            <LucideGithub class="w-5 h-5 mr-2" />View on GitHub
          </BaseButton>
          <BaseButton v-if="sanitizeLiveUrl(project.liveUrl)" variant="ghost" :href="sanitizeLiveUrl(project.liveUrl)" external>
            <LucideExternalLink class="w-5 h-5 mr-2" />Live Demo
          </BaseButton>
        </div>
      </BaseCard>
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

// Validate external URLs to prevent open redirect attacks
const ALLOWED_REPO_DOMAINS = ['github.com', 'www.github.com', 'gitlab.com', 'www.gitlab.com', 'bitbucket.org', 'www.bitbucket.org']
const ALLOWED_LIVE_DOMAINS = ['cativo.dev', 'www.cativo.dev']

function isValidRepoUrl(url: string | undefined): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return false
    return ALLOWED_REPO_DOMAINS.some(domain => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`))
  } catch {
    return false
  }
}

function isValidLiveUrl(url: string | undefined): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return false
    // Allow cativo.dev subdomains OR any other HTTPS URL
    const isCativoDev = ALLOWED_LIVE_DOMAINS.some(domain => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`))
    return isCativoDev || parsed.hostname.includes('.') // Allow any valid domain with TLD
  } catch {
    return false
  }
}

function sanitizeRepoUrl(url: string | undefined): string | undefined {
  return isValidRepoUrl(url) ? url : undefined
}

function sanitizeLiveUrl(url: string | undefined): string | undefined {
  return isValidLiveUrl(url) ? url : undefined
}

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