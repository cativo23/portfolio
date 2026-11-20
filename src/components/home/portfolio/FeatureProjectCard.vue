<template>
  <NuxtLink
    :to="`/projects/${project.id}`"
    :class="[
      'group transition-colors duration-150 p-5 flex flex-col gap-3',
      featured
        ? 'nw-reticle hover:bg-void-panel'
        : 'hover:bg-void-panel border border-nw-line hover:border-nw-line-strong',
    ]"
  >
    <header class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="font-stamp uppercase tracking-[0.14em] text-[10px] text-nw-text-dim">
          CASE-{{ String(project.id).padStart(4, '0') }}
        </div>
        <component :is="featured ? 'h3' : 'h4'" class="compressed-title text-nw-text mt-1" :class="featured ? 'title-card-lg' : 'title-card'">
          {{ project.title }}
        </component>
      </div>
      <span v-if="project.status" class="badge shrink-0" :class="badgeClass">
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
        class="nw-chip"
      >
        {{ tech }}
      </span>
    </div>

    <div class="flex justify-between items-center pt-3 border-t border-nw-text-faint font-stamp uppercase tracking-wider text-[10px] text-nw-text-dim">
      <span>{{ year }}</span>
      <span class="text-nw-text-mute group-hover:text-nw-text-strong transition-colors">OPEN FILE →</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '~/types/project'

interface Props {
  project: Project & { createdAt?: string; status?: string }
  featured?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  featured: false,
})

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
