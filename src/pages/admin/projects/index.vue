<template>
  <div class="flex flex-col gap-4">
    <!-- Header row -->
    <div class="flex justify-between items-center">
      <span class="font-stamp text-[13px] tracking-[0.14em] uppercase text-nw-text">Projects</span>
      <NuxtLink
        to="/admin/projects/new"
        class="btn flex items-center gap-1.5 text-[11px]"
      >
        <LucidePlus class="w-3.5 h-3.5" />
        New Project
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-12 text-center font-stamp text-[10px] tracking-wider uppercase text-nw-text-dim">
      Loading…
    </div>

    <!-- Table -->
    <div v-else-if="projects.length" class="bg-void-warm border border-nw-text-faint">
      <div class="flex justify-between items-center px-3 py-[7px] border-b border-nw-primary-dim">
        <span class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-primary">All Projects</span>
        <span class="font-stamp text-[8px] text-nw-text-dim">{{ projects.length }} RECORDS</span>
      </div>
      <table class="w-full">
        <thead>
          <tr>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim">Title</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim hidden md:table-cell">Status</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim hidden lg:table-cell">Stack</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-right px-3 py-[6px] border-b border-nw-primary-dim">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="project in projects"
            :key="project.id"
            class="border-b border-nw-text-faint last:border-b-0 hover:bg-nw-cyan/[0.04] transition-colors"
          >
            <td class="px-3 py-[7px]">
              <p class="text-[11px] text-nw-text">{{ project.title }}</p>
              <p class="text-[10px] text-nw-text-dim truncate max-w-xs">{{ project.shortDescription || project.description }}</p>
            </td>
            <td class="px-3 py-[7px] hidden md:table-cell">
              <span
                class="font-stamp text-[8px] tracking-[0.1em] uppercase border px-1.5 py-px"
                :class="project.isFeatured ? 'text-nw-purple border-nw-purple/40 bg-nw-purple/[0.06]' : 'text-nw-text-dim border-nw-text-line'"
              >
                {{ project.isFeatured ? 'FEATURED' : 'STD' }}
              </span>
            </td>
            <td class="px-3 py-[7px] hidden lg:table-cell">
              <div class="flex flex-wrap gap-1">
                <span v-for="tech in (project.techStack || []).slice(0, 3)" :key="tech" class="font-stamp text-[8px] text-nw-cyan">
                  {{ tech }}
                </span>
                <span v-if="(project.techStack || []).length > 3" class="font-stamp text-[8px] text-nw-text-dim">
                  +{{ (project.techStack || []).length - 3 }}
                </span>
              </div>
            </td>
            <td class="px-3 py-[7px] text-right">
              <NuxtLink
                :to="`/admin/projects/${project.id}`"
                class="font-stamp text-[9px] tracking-[0.1em] uppercase text-nw-primary-dim hover:text-nw-primary transition-colors"
              >
                EDIT
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div v-else class="py-12 text-center font-stamp text-[10px] tracking-wider uppercase text-nw-text-dim">
      No projects found.
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

interface AdminProject {
  id: number
  title: string
  description: string
  shortDescription?: string
  techStack?: string[]
  isFeatured?: boolean
  status?: string
}

const projects = ref<AdminProject[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await $fetch<Record<string, unknown>>('/api/admin/projects')
    projects.value = (res?.data as AdminProject[]) || []
  } catch {
    // Try unauthenticated (for dev without auth)
    try {
      const res = await $fetch<Record<string, unknown>>('/api/projects')
      projects.value = (res?.data as AdminProject[]) || []
    } catch { /* ignore */ }
  } finally {
    loading.value = false
  }
})
</script>
