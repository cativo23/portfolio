<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold text-nw-text">Projects</h1>
      <NuxtLink to="/admin/projects/new" class="px-4 py-2 bg-nw-green/20 text-nw-green border border-nw-green/30 rounded-lg text-sm font-sys hover:bg-nw-green/30 transition-colors flex items-center gap-2">
        <LucidePlus class="w-4 h-4" />
        New Project
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-nw-text-dim font-sys">
      Loading projects...
    </div>

    <!-- Table -->
    <div v-else-if="projects.length" class="bg-void-warm border border-nw-text-line/30 rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-void-warm">
          <tr>
            <th class="text-left px-4 py-3 text-nw-text-dim font-sys text-xs">Title</th>
            <th class="text-left px-4 py-3 text-nw-text-dim font-sys text-xs hidden md:table-cell">Status</th>
            <th class="text-left px-4 py-3 text-nw-text-dim font-sys text-xs hidden lg:table-cell">Tech</th>
            <th class="text-right px-4 py-3 text-nw-text-dim font-sys text-xs">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-nw-text-line/20">
          <tr v-for="project in projects" :key="project.id" class="hover:bg-void-raised/20 transition-colors">
            <td class="px-4 py-3">
              <p class="text-nw-text font-medium">{{ project.title }}</p>
              <p class="text-nw-text-dim text-xs truncate max-w-xs">{{ project.shortDescription || project.description }}</p>
            </td>
            <td class="px-4 py-3 hidden md:table-cell">
              <span class="px-2 py-1 rounded text-xs font-sys" :class="project.isFeatured ? 'bg-nw-purple/20 text-nw-purple' : 'bg-nw-text-line/20 text-nw-text-dim'">
                {{ project.isFeatured ? 'Featured' : 'Standard' }}
              </span>
            </td>
            <td class="px-4 py-3 hidden lg:table-cell">
              <div class="flex flex-wrap gap-1">
                <span v-for="tech in (project.techStack || []).slice(0, 3)" :key="tech" class="text-xs text-nw-green font-sys">
                  {{ tech }}
                </span>
                <span v-if="(project.techStack || []).length > 3" class="text-xs text-nw-text-dim">+{{ (project.techStack || []).length - 3 }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <NuxtLink :to="`/admin/projects/${project.id}`" class="text-nw-primary hover:text-nw-cyan text-xs font-sys">
                  Edit
                </NuxtLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-12 text-nw-text-dim font-sys">
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
