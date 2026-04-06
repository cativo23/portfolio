<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold text-tokyo-night-text">Projects</h1>
      <NuxtLink to="/admin/projects/new" class="px-4 py-2 bg-tokyo-night-green/20 text-tokyo-night-green border border-tokyo-night-green/30 rounded-lg text-sm font-mono hover:bg-tokyo-night-green/30 transition-colors flex items-center gap-2">
        <LucidePlus class="w-4 h-4" />
        New Project
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-tokyo-night-muted font-mono">
      Loading projects...
    </div>

    <!-- Table -->
    <div v-else-if="projects.length" class="bg-tokyo-night-dark border border-tokyo-night-gray/30 rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-tokyo-night-bg">
          <tr>
            <th class="text-left px-4 py-3 text-tokyo-night-muted font-mono text-xs">Title</th>
            <th class="text-left px-4 py-3 text-tokyo-night-muted font-mono text-xs hidden md:table-cell">Status</th>
            <th class="text-left px-4 py-3 text-tokyo-night-muted font-mono text-xs hidden lg:table-cell">Tech</th>
            <th class="text-right px-4 py-3 text-tokyo-night-muted font-mono text-xs">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-tokyo-night-gray/20">
          <tr v-for="project in projects" :key="project.id" class="hover:bg-tokyo-night-highlight/20 transition-colors">
            <td class="px-4 py-3">
              <p class="text-tokyo-night-text font-medium">{{ project.title }}</p>
              <p class="text-tokyo-night-muted text-xs truncate max-w-xs">{{ project.shortDescription || project.description }}</p>
            </td>
            <td class="px-4 py-3 hidden md:table-cell">
              <span class="px-2 py-1 rounded text-xs font-mono" :class="project.isFeatured ? 'bg-tokyo-night-magenta/20 text-tokyo-night-magenta' : 'bg-tokyo-night-gray/20 text-tokyo-night-muted'">
                {{ project.isFeatured ? 'Featured' : 'Standard' }}
              </span>
            </td>
            <td class="px-4 py-3 hidden lg:table-cell">
              <div class="flex flex-wrap gap-1">
                <span v-for="tech in (project.techStack || []).slice(0, 3)" :key="tech" class="text-xs text-tokyo-night-green font-mono">
                  {{ tech }}
                </span>
                <span v-if="(project.techStack || []).length > 3" class="text-xs text-tokyo-night-muted">+{{ (project.techStack || []).length - 3 }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <NuxtLink :to="`/admin/projects/${project.id}`" class="text-tokyo-night-blue hover:text-tokyo-night-cyan text-xs font-mono">
                  Edit
                </NuxtLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-12 text-tokyo-night-muted font-mono">
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
  const auth = useAdminAuth()
  auth.loadFromCookie()
  const token = auth.token.value

  if (!token) return

  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await $fetch('/api/admin/projects', { headers })
    projects.value = res?.data || []
  } catch {
    // Try unauthenticated (for dev without auth)
    try {
      const res = await $fetch('/api/projects')
      projects.value = res?.data || []
    } catch { /* ignore */ }
  } finally {
    loading.value = false
  }
})
</script>
