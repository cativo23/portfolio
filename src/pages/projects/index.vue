<template>
  <div class="space-y-0.5 pb-12">
    <!-- HEADER PANEL -->
    <div class="panel">
      <div class="panel-header">
        <span>SELECTED WORK · {{ pagination?.total_items ?? displayed.length }} ENTRIES</span>
      </div>
      <div class="panel-body p-6 lg:p-8">
        <h1 class="compressed-title title-md text-nw-text leading-none mb-2">
          Operations <span class="text-nw-primary">executed.</span>
        </h1>
        <div class="font-mincho mincho-accent text-nw-primary-dim mb-3">
          実行済みの作戦
        </div>
        <p class="lede">
          Selected production work — payment systems, healthcare integrations, AI agents, and self-hosted infra. Click a file to read the mission report.
        </p>
      </div>
    </div>

    <!-- VAULT CARD GRID -->
    <div class="panel">
      <div class="panel-header">
        <span>REGISTRY</span>
      </div>
      <div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Loading -->
        <template v-if="loading">
          <div class="col-span-1 md:col-span-2 text-center py-12 bg-void-warm font-stamp uppercase tracking-wider text-xs text-nw-text-dim" role="status" aria-live="polite">
            Loading registry…
          </div>
        </template>

        <!-- Error -->
        <template v-else-if="error">
          <div class="col-span-1 md:col-span-2 text-center py-12 bg-void-warm font-stamp uppercase tracking-wider text-xs text-nw-red" role="alert">
            [ERR] Failed to load case files
          </div>
        </template>

        <!-- Empty -->
        <template v-else-if="displayed.length === 0">
          <div class="col-span-1 md:col-span-2 text-center py-12 bg-void-warm font-stamp uppercase tracking-wider text-xs text-nw-text-dim">
            No active case files.
          </div>
        </template>

        <!-- Cards -->
        <NuxtLink
          v-else
          v-for="project in displayed"
          :key="project.id || project.title"
          :to="`/projects/${project.id}`"
          :prefetch="false"
          class="bg-void-raised hover:bg-void-panel border border-nw-text-line hover:border-nw-primary-dim transition-colors duration-150 p-5 flex flex-col gap-3"
        >
          <header class="flex items-start justify-between gap-3">
            <div>
              <div class="font-stamp uppercase tracking-[0.14em] text-[10px] text-nw-text-dim">
                CASE-{{ String(project.id).padStart(4, '0') }}
              </div>
              <h3 class="compressed-title title-card text-nw-text mt-1">
                {{ project.title }}
              </h3>
            </div>
            <span v-if="project.status" class="badge" :class="badgeClass(project.status)">
              {{ project.status }}
            </span>
          </header>

          <p class="text-meta">
            {{ project.shortDescription || project.description }}
          </p>

          <div class="flex flex-wrap gap-1.5 mt-auto" v-if="project.techStack?.length">
            <span
              v-for="tech in project.techStack"
              :key="tech"
              class="tech-chip"
            >
              {{ tech }}
            </span>
          </div>

          <div class="flex justify-between items-center pt-3 border-t border-nw-text-faint font-stamp uppercase tracking-wider text-[10px] text-nw-text-dim">
            <span v-if="formatYear(project.createdAt)">{{ formatYear(project.createdAt) }}</span>
            <span v-else></span>
            <span class="text-nw-primary">OPEN FILE →</span>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- PAGINATION -->
    <BasePagination
      v-if="pagination"
      :pagination="pagination"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { useProjects } from '~/composables/useProjects'

usePageTitle('Case Files', {
  description: 'Production work — payment systems, healthcare integrations, AI agents, and self-hosted infra.',
})

const route = useRoute()
const router = useRouter()
// Solo la funcion: los refs internos del composable no sobreviven a la
// hidratacion, asi que lo que se pinta tiene que salir de useAsyncData.
const { fetchProjects } = useProjects()

const itemsPerPage = 6

const page = ref((() => {
  const raw = Number(route.query.page)
  return !Number.isFinite(raw) || raw < 1 ? 1 : Math.floor(raw)
})())

/* El payload es la fuente de verdad.
 *
 * Antes se leia de los refs de useProjects() y se usaba useAsyncData solo para
 * disparar la carga. En el servidor funcionaba: el handler corria, llenaba los
 * refs y el SSR pintaba las fichas. Pero useAsyncData solo serializa lo que su
 * handler DEVUELVE, no esos refs -- asi que al hidratar encontraba la clave ya
 * cacheada, no volvia a ejecutar el handler, y los refs se quedaban vacios.
 * Resultado: entrar directo a /projects mostraba "0 ENTRIES", mientras que
 * llegar navegando desde el menu funcionaba, porque ahi no hay payload previo. */
const { data, pending: loading, error } = await useAsyncData(
  'projects-page',
  () => fetchProjects({ page: page.value, per_page: itemsPerPage }),
  { watch: [page] },
)

const displayed = computed(() => data.value?.data ?? [])
const pagination = computed(() => data.value?.meta?.pagination ?? null)

function handlePageChange(next: number) {
  page.value = next
  if (import.meta.client) {
    router.replace({ query: { ...route.query, page: next > 1 ? next : undefined } })
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }
}

function formatYear(dateString?: string) {
  if (!dateString) return ''
  return String(new Date(dateString).getFullYear())
}

function badgeClass(status: string) {
  const s = status.toLowerCase()
  if (['live', 'completed', 'production'].includes(s)) return 'badge-success'
  if (['active', 'in-progress', 'wip'].includes(s)) return ''
  if (['alpha', 'mvp', 'beta'].includes(s)) return 'badge-warning'
  return ''
}
</script>
