<template>
  <div>
    <div v-if="pending" class="flex justify-center items-center min-h-[400px]" role="status" aria-live="polite">
      <span class="text-tokyo-night-text">Loading project...</span>
    </div>

    <div v-else-if="error || !project" class="text-center py-16" role="alert">
      <p class="text-tokyo-night-red mb-4 font-mono">Project not found</p>
      <BaseButton variant="ghost" to="/projects" class="font-mono">
        <LucideArrowLeft class="w-4 h-4 mr-2" />
        ❯ Back to Projects
      </BaseButton>
    </div>

    <article v-else class="max-w-[1200px] mx-auto px-4 py-8">
      <!-- Back Button -->
      <BaseButton variant="ghost" size="sm" to="/projects" class="mb-6 font-mono">
        <LucideArrowLeft class="w-4 h-4 mr-2" />
        ❯ Back to Projects
      </BaseButton>

      <!-- Hero Header (Full Width) -->
      <header class="mb-10 text-center border-b border-tokyo-night-gray/30 pb-8">
        <BaseBadge v-if="project.isFeatured" color="magenta" size="md" class="mb-4 font-mono">
          Featured Project
        </BaseBadge>
        <BaseBadge v-if="project.status" color="green" size="md" class="mb-4 ml-2 font-mono">
          {{ project.status }}
        </BaseBadge>

        <h1 class="mb-4 text-4xl md:text-5xl font-bold text-tokyo-night-text font-mono">
          <span class="text-tokyo-night-purple">❯</span> {{ project.title }}
        </h1>
        <p class="text-xl text-tokyo-night-text max-w-3xl mx-auto">
          {{ project.shortDescription || project.description }}
        </p>
      </header>

      <!-- Hero Image (Full Width above Grid so it's top on mobile) -->
      <div class="mb-10 rounded-xl overflow-hidden bg-tokyo-night-surface border border-tokyo-night-gray aspect-video relative flex items-center justify-center">
        <NuxtImg
          v-if="project.heroImage && !imageError"
          :src="project.heroImage"
          :alt="`${project.title} screenshot`"
          class="w-full h-full object-cover"
          sizes="sm:100vw md:1200px lg:1200px"
          placeholder
          @error="imageError = true"
        />
        <!-- Fallback state if no image or error -->
        <div v-else class="text-tokyo-night-muted flex flex-col items-center p-12 font-mono">
          <LucideImage class="w-16 h-16 mb-4 opacity-30" />
          <span class="text-lg">❯ No preview available</span>
        </div>
      </div>

      <!-- 2-Column Layout Grid -->
      <div class="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">

        <!-- Sidebar (Stack Order 1 on Mobile, Right Column on Desktop) -->
        <aside class="order-1 lg:order-2">
          <div class="sticky top-24 bg-tokyo-night-surface p-6 rounded-xl border border-tokyo-night-gray">

            <!-- Links -->
            <div class="mb-8">
              <h3 class="text-xs font-bold text-tokyo-night-muted uppercase tracking-wider mb-4 font-mono">Links</h3>
              <div class="flex flex-col gap-3">
                <BaseButton
                  v-if="sanitizeRepoUrl(project.repoUrl)"
                  variant="primary"
                  :href="sanitizeRepoUrl(project.repoUrl)"
                  external
                  class="w-full justify-center font-mono"
                >
                  <LucideGithub class="w-5 h-5 mr-2" />
                  ❯ View Source Code
                </BaseButton>
                <BaseButton
                  v-if="sanitizeLiveUrl(project.liveUrl)"
                  variant="secondary"
                  :href="sanitizeLiveUrl(project.liveUrl)"
                  external
                  class="w-full justify-center font-mono"
                >
                  <LucideExternalLink class="w-5 h-5 mr-2" />
                  ❯ Live Demo
                </BaseButton>
              </div>
            </div>

            <!-- Tech Stack -->
            <div class="mb-8">
              <h3 class="text-xs font-bold text-tokyo-night-muted uppercase tracking-wider mb-4 font-mono">Technologies</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in project.techStack"
                  :key="tech"
                  class="text-tokyo-night-green font-mono text-xs"
                >
                  [{{ tech }}]
                </span>
              </div>
            </div>

            <!-- Meta Info -->
            <div class="pt-6 border-t border-tokyo-night-gray">
              <dl class="space-y-3 text-sm">
                <MetaInfoPair v-if="project.status" label="Status" :value="project.status" color="success" horizontal />
                <MetaInfoPair v-if="project.createdAt" label="Created" :value="formatDate(project.createdAt)" horizontal />
                <MetaInfoPair v-if="project.updatedAt" label="Updated" :value="formatDate(project.updatedAt)" horizontal />
              </dl>
            </div>

          </div>
        </aside>

        <!-- Main Content (Stack Order 2 on Mobile, Left Column on Desktop) -->
        <main class="order-2 lg:order-1 overflow-hidden">

          <!-- Key Features -->
          <section v-if="project.features && project.features.length > 0" class="mb-12">
            <h2 class="text-2xl font-bold text-tokyo-night-purple mb-6 pb-2 border-b border-tokyo-night-gray/30 font-mono">
              <span class="text-tokyo-night-cyan">❯</span> Key Features
            </h2>
            <ul class="space-y-3">
              <li v-for="(feature, index) in project.features" :key="index" class="flex items-start">
                <LucideCheckCircle2 class="w-5 h-5 text-tokyo-night-green mr-3 mt-0.5 flex-shrink-0" />
                <span class="text-tokyo-night-text text-lg font-mono">{{ feature }}</span>
              </li>
            </ul>
          </section>

          <!-- Overview / Content -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold text-tokyo-night-purple mb-6 pb-2 border-b border-tokyo-night-gray/30 font-mono">
              <span class="text-tokyo-night-cyan">❯</span> Project Overview
            </h2>

            <!-- Project content -->
            <div class="text-lg text-tokyo-night-text leading-relaxed prose prose-tokyo dark:prose-invert max-w-none">
              <template v-if="project?.content || project?.description">
                <MDC :value="project.content || project.description" />
              </template>
            </div>
          </section>

        </main>
      </div>
    </article>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const route = useRoute()
const { fetchProject } = useProjects()

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

const projectId = computed(() => route.params.id as string)

const imageError = ref(false)

// reset image error when route/project changes
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
  project.value?.shortDescription || project.value?.description || 'Project details'
)

usePageTitle(pageTitle.value, {
  description: pageDescription.value,
})

watch(pageTitle, (title) => {
  usePageTitle(title, { description: pageDescription.value })
})

function formatDate(dateString?: string) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
article {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
</style>
