<template>
  <div class="panel">
    <div class="panel-header">
      <span>SELECTED WORK · FEATURED</span>
    </div>
    <div class="panel-body p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
      <!-- Loading State -->
      <template v-if="pending">
        <div class="col-span-1 md:col-span-2 text-center py-10 bg-void-warm" role="status" aria-live="polite">
          <span class="text-nw-text-dim font-stamp uppercase tracking-wider text-xs">Loading dossier…</span>
        </div>
      </template>

      <!-- Error State -->
      <template v-else-if="fetchError">
        <div class="col-span-1 md:col-span-2 text-center py-10 bg-void-warm text-nw-red font-stamp uppercase tracking-wider text-xs" role="alert">
          [ERR] Failed to load case files
        </div>
      </template>

      <!-- Empty State -->
      <template v-else-if="!data || (data as any).data?.length === 0">
        <div class="col-span-1 md:col-span-2 text-center py-10 bg-void-warm text-nw-text-dim font-stamp uppercase tracking-wider text-xs">
          No active case files.
        </div>
      </template>

      <!-- Projects -->
      <FeatureProjectCard
        v-else
        v-for="(project, index) in (data as any).data"
        :key="project.id || project.title"
        :project="project"
        :class="[index === 0 ? 'md:col-span-2' : '', 'reveal']"
        :style="{ '--delay': `${index * 0.08}s` }"
        :featured="index === 0"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import FeatureProjectCard from '~/components/home/portfolio/FeatureProjectCard.vue'

// Fetch featured projects on server-side
const { data, pending, error: fetchError } = await useFetch('/api/projects', {
  query: { is_featured: 'true' },
  lazy: false,
  server: true,
  getCachedData: () => undefined,
})
</script>
