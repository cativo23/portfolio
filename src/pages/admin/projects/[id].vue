<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/admin/projects" class="text-tokyo-night-blue hover:text-tokyo-night-cyan">
        <LucideArrowLeft class="w-4 h-4" />
      </NuxtLink>
      <h1 class="text-xl font-bold text-tokyo-night-text">Edit Project</h1>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-tokyo-night-muted font-mono">
      Loading project...
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="saveProject" class="space-y-6 max-w-3xl">
      <!-- Title -->
      <div>
        <label for="title" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Title *</label>
        <input id="title" v-model="form.title" type="text" required class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono">
      </div>

      <!-- Short Description -->
      <div>
        <label for="shortDescription" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Short Description *</label>
        <input id="shortDescription" v-model="form.shortDescription" type="text" required class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono">
      </div>

      <!-- Full Description -->
      <div>
        <label for="description" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Description (Markdown)</label>
        <textarea id="description" v-model="form.description" rows="6" class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono resize-y"></textarea>
      </div>

      <!-- Tech Stack -->
      <div>
        <label for="techStack" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Tech Stack (comma-separated)</label>
        <input id="techStack" v-model="form.techStack" type="text" class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono">
      </div>

      <!-- URLs -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="repoUrl" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Repository URL</label>
          <input id="repoUrl" v-model="form.repoUrl" type="url" class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono">
        </div>
        <div>
          <label for="liveUrl" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Live Demo URL</label>
          <input id="liveUrl" v-model="form.liveUrl" type="url" class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono">
        </div>
      </div>

      <!-- Status & Featured -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="status" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Status</label>
          <select id="status" v-model="form.status" class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono">
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div class="flex items-end">
          <label class="flex items-center gap-2 cursor-pointer py-2">
            <input type="checkbox" v-model="form.isFeatured" class="accent-tokyo-night-magenta w-4 h-4">
            <span class="text-sm text-tokyo-night-muted">Featured Project</span>
          </label>
        </div>
      </div>

      <!-- Hero Image -->
      <div>
        <label for="heroImage" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Hero Image URL</label>
        <input id="heroImage" v-model="form.heroImage" type="text" class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono">
      </div>

      <!-- Features -->
      <div>
        <label for="features" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Key Features (one per line)</label>
        <textarea id="features" v-model="form.features" rows="4" class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono resize-y"></textarea>
      </div>

      <p v-if="error" class="text-red-400 text-sm font-mono" role="alert">{{ error }}</p>
      <p v-if="success" class="text-tokyo-night-green text-sm font-mono">{{ success }}</p>

      <!-- Actions -->
      <div class="flex gap-3 pt-2">
        <button type="submit" :disabled="saving" class="px-6 py-2 bg-tokyo-night-highlight text-tokyo-night-dark font-mono font-bold rounded shadow hover:bg-tokyo-night-cyan transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          <LucideLoader v-if="saving" class="w-4 h-4 animate-spin" />
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
        <button type="button" @click="deleteProject" class="px-6 py-2 text-tokyo-night-red hover:text-tokyo-night-red/80 font-mono transition">
          Delete Project
        </button>
        <NuxtLink to="/admin/projects" class="px-6 py-2 text-tokyo-night-muted font-mono hover:text-tokyo-night-text transition">
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const form = reactive({
  title: '',
  shortDescription: '',
  description: '',
  techStack: '',
  repoUrl: '',
  liveUrl: '',
  status: 'active',
  isFeatured: false,
  heroImage: '',
  features: '',
})

onMounted(async () => {
  const auth = useAdminAuth()
  auth.loadFromCookie()
  const token = auth.token.value
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}

  try {
    const res = await $fetch<Record<string, unknown>>(`/api/admin/projects/${projectId.value}`, { headers })
    const project = (res?.data || res) as Record<string, unknown>

    form.title = (project.title as string) || ''
    form.shortDescription = (project.shortDescription as string) || ''
    form.description = (project.description as string) || ''
    form.techStack = (project.techStack as string[])?.join(', ') || ''
    form.repoUrl = (project.repoUrl as string) || ''
    form.liveUrl = (project.liveUrl as string) || ''
    form.status = (project.status as string) || 'active'
    form.isFeatured = !!project.isFeatured
    form.heroImage = (project.heroImage as string) || ''
    form.features = (project.features as string[])?.join('\n') || ''
  } catch {
    error.value = 'Failed to load project'
  } finally {
    loading.value = false
  }
})

async function saveProject() {
  saving.value = true
  error.value = null
  success.value = null

  const auth = useAdminAuth()
  auth.loadFromCookie()
  const token = auth.token.value
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}

  const techStack = form.techStack.split(',').map(t => t.trim()).filter(Boolean)
  const features = form.features.split('\n').map(f => f.trim()).filter(Boolean)

  try {
    await $fetch(`/api/projects/${projectId.value}`, {
      method: 'patch',
      headers,
      body: {
        title: form.title,
        description: form.description,
        shortDescription: form.shortDescription,
        techStack,
        repoUrl: form.repoUrl || undefined,
        liveUrl: form.liveUrl || undefined,
        status: form.status,
        isFeatured: form.isFeatured,
        heroImage: form.heroImage || undefined,
        features,
      },
    })

    success.value = 'Project updated successfully!'
    setTimeout(() => navigateTo('/admin/projects'), 1000)
  } catch (e: any) {
    error.value = e?.data?.error?.message || e?.statusMessage || 'Failed to update project'
  } finally {
    saving.value = false
  }
}

async function deleteProject() {
  if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return

  const auth = useAdminAuth()
  auth.loadFromCookie()
  const token = auth.token.value
  if (!token) return

  try {
    await $fetch(`/api/projects/${projectId.value}`, {
      method: 'delete',
      headers: { Authorization: `Bearer ${token}` },
    })
    navigateTo('/admin/projects')
  } catch {
    error.value = 'Failed to delete project'
  }
}
</script>
