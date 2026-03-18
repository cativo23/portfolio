<template>
  <div>
    <div v-if="pending" class="flex justify-center items-center min-h-[400px]" role="status" aria-live="polite">
      <span class="text-tokyo-night-text">Loading project...</span>
    </div>

    <div v-else-if="error || !project" class="text-center py-16" role="alert">
      <p class="text-tokyo-night-red mb-4">Project not found</p>
      <BaseButton variant="ghost" to="/projects">
        <LucideArrowLeft class="w-4 h-4 mr-2" />
        Back to Projects
      </BaseButton>
    </div>

    <article v-else class="max-w-4xl mx-auto">
    <!-- Back Button -->
    <BaseButton variant="ghost" size="sm" to="/projects" class="mb-6">
      <LucideArrowLeft class="w-4 h-4 mr-2" />
      Back to Projects
    </BaseButton>

    <!-- Featured Badge -->
    <BaseBadge v-if="project.isFeatured" color="magenta" size="md" class="mb-4">
      Featured Project
    </BaseBadge>

    <!-- Title -->
    <h1 class="mb-4 text-4xl font-bold text-tokyo-night-highlight">{{ project.title }}</h1>

    <!-- Description -->
    <p class="mb-8 text-lg text-tokyo-night-text">{{ project.description }}</p>

    <!-- Tech Stack -->
    <div class="mb-8">
      <h2 class="mb-4 text-xl font-bold text-tokyo-night-cyan">Technologies Used</h2>
      <div class="flex flex-wrap gap-2">
        <BaseBadge
          v-for="tech in project.techStack"
          :key="tech"
          color="cyan"
          size="md"
        >
          {{ tech }}
        </BaseBadge>
      </div>
    </div>

    <!-- Project Links -->
    <div class="flex gap-4">
      <BaseButton
        v-if="project.repoUrl"
        variant="primary"
        :href="project.repoUrl"
        external
      >
        <LucideGithub class="w-5 h-5 mr-2" />
        View Source Code
      </BaseButton>
      <BaseButton
        v-if="project.liveUrl"
        variant="secondary"
        :href="project.liveUrl"
        external
      >
        <LucideExternalLink class="w-5 h-5 mr-2" />
        Live Demo
      </BaseButton>
    </div>

    <!-- Meta Info -->
    <div class="mt-12 pt-8 border-t border-tokyo-night-gray">
      <dl class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt class="text-tokyo-night-muted">Created</dt>
          <dd class="text-tokyo-night-text">{{ formatDate(project.createdAt) }}</dd>
        </div>
        <div>
          <dt class="text-tokyo-night-muted">Last Updated</dt>
          <dd class="text-tokyo-night-text">{{ formatDate(project.updatedAt) }}</dd>
        </div>
      </dl>
    </div>
  </article>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { fetchProject } = useProjects()

const projectId = computed(() => route.params.id as string)

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
  @apply py-8;
}
</style>
