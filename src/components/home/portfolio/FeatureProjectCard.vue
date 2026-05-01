<template>
  <NuxtLink
    :to="`/projects/${project.id}`"
    class="bg-void-raised hover:bg-void-panel border border-nw-text-line hover:border-nw-primary-dim transition-colors duration-150 p-5 flex flex-col gap-3"
  >
    <header class="flex items-start justify-between gap-3">
      <div>
        <div class="font-stamp uppercase tracking-[0.14em] text-[9px] text-nw-text-dim">
          CASE-{{ String(project.id).padStart(4, '0') }}
        </div>
        <h4 class="compressed-title title-card text-nw-text mt-1">
          {{ project.title }}
        </h4>
      </div>
      <span v-if="project.status" class="badge" :class="badgeClass">
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
        class="tag tag-info"
      >
        {{ tech }}
      </span>
    </div>

    <div class="flex justify-between items-center pt-3 border-t border-nw-text-faint font-stamp uppercase tracking-wider text-[9px] text-nw-text-dim">
      <span>{{ year }}</span>
      <span class="text-nw-primary">OPEN FILE →</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '~/types/project'

interface Props {
  project: Project & { createdAt?: string; status?: string }
}

const props = defineProps<Props>()

defineOptions({ name: 'FeatureProjectCard' })

const year = computed(() => {
  if (!props.project.createdAt) return ''
  return String(new Date(props.project.createdAt).getFullYear())
})

const badgeClass = computed(() => {
  const s = (props.project.status || '').toLowerCase()
  if (['live', 'completed', 'production'].includes(s)) return 'badge-success'
  if (['active', 'in-progress', 'wip'].includes(s)) return ''
  if (['alpha', 'mvp'].includes(s)) return 'badge-warning'
  return ''
})
</script>
