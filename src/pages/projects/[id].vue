<template>
  <div>
    <!-- Loading -->
    <div v-if="pending" class="panel">
      <div class="panel-body p-12 text-center font-stamp uppercase tracking-wider text-xs text-nw-text-dim" role="status" aria-live="polite">
        Loading mission report…
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error || !project" class="panel">
      <div class="panel-body p-12 text-center" role="alert">
        <p class="text-nw-red font-stamp uppercase tracking-wider text-xs mb-4">[ERR-404] Case file not found</p>
        <BaseButton variant="ghost" to="/projects">
          <LucideArrowLeft class="w-4 h-4 mr-2" />
          Back to case files
        </BaseButton>
      </div>
    </div>

    <article v-else class="space-y-0.5 pb-12">
      <!-- Back link strip -->
      <div class="text-[10px] font-stamp uppercase tracking-wider mb-2">
        <NuxtLink to="/projects" class="text-nw-text-dim hover:text-nw-primary inline-flex items-center gap-2">
          <LucideArrowLeft class="w-3 h-3" /> Case Files
        </NuxtLink>
      </div>

      <!-- HEADER PANEL -->
      <div class="panel">
        <div class="panel-header">
          <span>CASE-{{ String(project.id).padStart(4, '0') }} · MISSION REPORT</span>
          <span class="tag">任務報告</span>
        </div>
        <div class="panel-body p-6 lg:p-8">
          <div class="flex flex-wrap gap-2 mb-3">
            <span v-if="project.isFeatured" class="badge badge-success">FEATURED</span>
            <span v-if="project.status" class="badge" :class="badgeClass(project.status)">
              {{ project.status }}
            </span>
          </div>
          <h1
            class="compressed-title text-nw-text leading-[1.05] mb-2"
            style="font-size: clamp(32px, 5.5vw, 52px);"
          >
            {{ project.title }}
          </h1>
          <p class="lede max-w-[70ch]">
            {{ project.shortDescription || project.description }}
          </p>
        </div>
      </div>

      <!-- HERO IMAGE (only if real) -->
      <div
        v-if="project.heroImage && !imageError"
        class="bg-void-panel border border-nw-text-faint aspect-[5/2] overflow-hidden"
      >
        <NuxtImg
          :src="project.heroImage"
          :alt="`${project.title} screenshot`"
          class="w-full h-full object-cover"
          sizes="sm:100vw md:1200px lg:1200px"
          placeholder
          @error="() => (imageError = true)"
        />
      </div>

      <!-- 2-COL LAYOUT: main + sidebar of 3 panels -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0.5">
        <!-- MAIN -->
        <div class="space-y-0.5 order-2 lg:order-1 min-w-0">
          <!-- KEY FEATURES -->
          <div v-if="project.features && project.features.length > 0" class="panel">
            <div class="panel-header">
              <span>KEY FEATURES</span>
            </div>
            <ul class="panel-body p-6 lg:p-8 space-y-2">
              <li v-for="(feature, index) in project.features" :key="index" class="flex items-start gap-3">
                <span class="text-nw-green mt-1 shrink-0">▸</span>
                <span class="text-nw-text-dim leading-relaxed">{{ feature }}</span>
              </li>
            </ul>
          </div>

          <!-- OVERVIEW (markdown) -->
          <div class="panel">
            <div class="panel-header">
              <span>OVERVIEW</span>
            </div>
            <div class="panel-body p-6 lg:p-8">
              <div class="prose prose-nightwire max-w-none text-nw-text-dim leading-relaxed">
                <MDC v-if="project?.content || project?.description" :value="project.content || project.description" />
                <p v-else class="text-nw-text-dim italic">No overview available.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- SIDEBAR (3 separate panels) -->
        <aside class="order-1 lg:order-2 space-y-0.5">
          <!-- LINKS -->
          <div class="panel">
            <div class="panel-header">
              <span>LINKS</span>
            </div>
            <div class="panel-body p-4 flex flex-col gap-2">
              <BaseButton
                v-if="sanitizeRepoUrl(project.repoUrl)"
                variant="primary"
                :href="sanitizeRepoUrl(project.repoUrl)"
                external
                class="w-full justify-center"
              >
                <LucideGithub class="w-4 h-4 mr-2" />
                View source
              </BaseButton>
              <BaseButton
                v-if="sanitizeLiveUrl(project.liveUrl)"
                variant="secondary"
                :href="sanitizeLiveUrl(project.liveUrl)"
                external
                class="w-full justify-center"
              >
                <LucideExternalLink class="w-4 h-4 mr-2" />
                Live demo
              </BaseButton>
              <p
                v-if="!sanitizeRepoUrl(project.repoUrl) && !sanitizeLiveUrl(project.liveUrl)"
                class="text-nw-text-dim text-xs text-center py-2 font-stamp uppercase tracking-wider"
              >
                No public links
              </p>
            </div>
          </div>

          <!-- STACK -->
          <div class="panel" v-if="project.techStack?.length">
            <div class="panel-header">
              <span>STACK</span>
            </div>
            <div class="panel-body p-4 flex flex-wrap gap-1.5">
              <span
                v-for="tech in project.techStack"
                :key="tech"
                class="tag tag-info"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- METADATA -->
          <div class="panel">
            <div class="panel-header">
              <span>METADATA</span>
            </div>
            <div class="panel-body p-0">
              <div class="kv-row" v-if="project.status">
                <span class="kv-label">STATUS</span>
                <span class="kv-value text-nw-green">{{ project.status }}</span>
              </div>
              <div class="kv-row" v-if="project.createdAt">
                <span class="kv-label">YEAR</span>
                <span class="kv-value">{{ formatYear(project.createdAt) }}</span>
              </div>
              <div class="kv-row">
                <span class="kv-label">FILE ID</span>
                <span class="kv-value">CASE-{{ String(project.id).padStart(4, '0') }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </article>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const route = useRoute()
const { fetchProject } = useProjects()

const ALLOWED_REPO_DOMAINS = ['github.com', 'www.github.com', 'gitlab.com', 'www.gitlab.com', 'bitbucket.org', 'www.bitbucket.org']

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
    return parsed.protocol === 'https:' && parsed.hostname.includes('.')
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

const projectId = computed(() => route.params.id as string)
const imageError = ref(false)

watch(projectId, () => {
  imageError.value = false
})

const { data: project, pending, error } = await useAsyncData(
  () => `project-${projectId.value}`,
  () => fetchProject(projectId.value),
  { watch: [projectId] }
)

const pageTitle = computed(() => project.value?.title || 'Project')
const pageDescription = computed(() =>
  project.value?.shortDescription || project.value?.description || 'Mission report'
)

const baseTitle = useRuntimeConfig().public.baseTitle
useSeoMeta({
  title: () => `${baseTitle} - ${pageTitle.value}`,
  description: () => pageDescription.value,
  ogTitle: () => `${baseTitle} - ${pageTitle.value}`,
  ogDescription: () => pageDescription.value,
  twitterTitle: () => `${baseTitle} - ${pageTitle.value}`,
  twitterDescription: () => pageDescription.value,
  twitterCard: 'summary',
})

function formatYear(dateString?: string) {
  if (!dateString) return '----'
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
