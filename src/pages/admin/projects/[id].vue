<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/admin/projects" class="text-nw-primary hover:text-nw-cyan">
        <LucideArrowLeft class="w-4 h-4" />
      </NuxtLink>
      <h1 class="text-xl font-bold text-nw-text">Edit Project</h1>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-nw-text-dim font-sys">
      Loading project...
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="saveProject" class="space-y-6 max-w-3xl">
      <!-- Title -->
      <div>
        <label for="title" class="block text-sm text-nw-cyan font-sys mb-1">Title *</label>
        <input id="title" v-model="form.title" type="text" required :class="[
          'w-full px-3 py-2 bg-void-warm text-nw-text border rounded font-sys focus:outline-none focus:ring-2',
          fieldErrors.title ? 'border-red-500 focus:ring-red-500' : 'border-nw-text-line focus:ring-nw-cyan'
        ]">
        <p v-if="fieldErrors.title" class="text-red-400 text-xs font-sys mt-1">{{ fieldErrors.title }}</p>
      </div>

      <!-- Short Description -->
      <div>
        <label for="shortDescription" class="block text-sm text-nw-cyan font-sys mb-1">Short Description *</label>
        <input id="shortDescription" v-model="form.shortDescription" type="text" required :class="[
          'w-full px-3 py-2 bg-void-warm text-nw-text border rounded font-sys focus:outline-none focus:ring-2',
          fieldErrors.shortDescription ? 'border-red-500 focus:ring-red-500' : 'border-nw-text-line focus:ring-nw-cyan'
        ]">
        <p v-if="fieldErrors.shortDescription" class="text-red-400 text-xs font-sys mt-1">{{ fieldErrors.shortDescription }}</p>
      </div>

      <!-- Full Description -->
      <div>
        <label for="description" class="block text-sm text-nw-cyan font-sys mb-1">Description (Markdown)</label>
        <textarea id="description" v-model="form.description" rows="6" :class="[
          'w-full px-3 py-2 bg-void-warm text-nw-text border rounded font-sys focus:outline-none focus:ring-2 resize-y',
          fieldErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-nw-text-line focus:ring-nw-cyan'
        ]"></textarea>
        <p v-if="fieldErrors.description" class="text-red-400 text-xs font-sys mt-1">{{ fieldErrors.description }}</p>
      </div>

      <!-- Tech Stack -->
      <div>
        <label for="techStack" class="block text-sm text-nw-cyan font-sys mb-1">Tech Stack (comma-separated)</label>
        <input id="techStack" v-model="form.techStack" type="text" :class="[
          'w-full px-3 py-2 bg-void-warm text-nw-text border rounded font-sys focus:outline-none focus:ring-2',
          fieldErrors.techStack ? 'border-red-500 focus:ring-red-500' : 'border-nw-text-line focus:ring-nw-cyan'
        ]">
        <p v-if="fieldErrors.techStack" class="text-red-400 text-xs font-sys mt-1">{{ fieldErrors.techStack }}</p>
      </div>

      <!-- URLs -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="repoUrl" class="block text-sm text-nw-cyan font-sys mb-1">Repository URL</label>
          <input id="repoUrl" v-model="form.repoUrl" type="url" :class="[
            'w-full px-3 py-2 bg-void-warm text-nw-text border rounded font-sys focus:outline-none focus:ring-2',
            fieldErrors.repoUrl ? 'border-red-500 focus:ring-red-500' : 'border-nw-text-line focus:ring-nw-cyan'
          ]">
          <p v-if="fieldErrors.repoUrl" class="text-red-400 text-xs font-sys mt-1">{{ fieldErrors.repoUrl }}</p>
        </div>
        <div>
          <label for="liveUrl" class="block text-sm text-nw-cyan font-sys mb-1">Live Demo URL</label>
          <input id="liveUrl" v-model="form.liveUrl" type="url" :class="[
            'w-full px-3 py-2 bg-void-warm text-nw-text border rounded font-sys focus:outline-none focus:ring-2',
            fieldErrors.liveUrl ? 'border-red-500 focus:ring-red-500' : 'border-nw-text-line focus:ring-nw-cyan'
          ]">
          <p v-if="fieldErrors.liveUrl" class="text-red-400 text-xs font-sys mt-1">{{ fieldErrors.liveUrl }}</p>
        </div>
      </div>

      <!-- Status & Featured -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="status" class="block text-sm text-nw-cyan font-sys mb-1">Status</label>
          <select id="status" v-model="form.status" :class="[
            'w-full px-3 py-2 bg-void-warm text-nw-text border rounded font-sys focus:outline-none focus:ring-2',
            fieldErrors.status ? 'border-red-500 focus:ring-red-500' : 'border-nw-text-line focus:ring-nw-cyan'
          ]">
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
            <option value="draft">Draft</option>
          </select>
          <p v-if="fieldErrors.status" class="text-red-400 text-xs font-sys mt-1">{{ fieldErrors.status }}</p>
        </div>
        <div class="flex items-end">
          <label class="flex items-center gap-2 cursor-pointer py-2">
            <input type="checkbox" v-model="form.isFeatured" class="accent-nw-purple w-4 h-4">
            <span class="text-sm text-nw-text-dim">Featured Project</span>
          </label>
        </div>
      </div>

      <!-- Hero Image -->
      <div>
        <label for="heroImage" class="block text-sm text-nw-cyan font-sys mb-1">Hero Image URL</label>
        <input id="heroImage" v-model="form.heroImage" type="text" :class="[
          'w-full px-3 py-2 bg-void-warm text-nw-text border rounded font-sys focus:outline-none focus:ring-2',
          fieldErrors.heroImage ? 'border-red-500 focus:ring-red-500' : 'border-nw-text-line focus:ring-nw-cyan'
        ]">
        <p v-if="fieldErrors.heroImage" class="text-red-400 text-xs font-sys mt-1">{{ fieldErrors.heroImage }}</p>
      </div>

      <!-- Features -->
      <div>
        <label for="features" class="block text-sm text-nw-cyan font-sys mb-1">Key Features (one per line)</label>
        <textarea id="features" v-model="form.features" rows="4" :class="[
          'w-full px-3 py-2 bg-void-warm text-nw-text border rounded font-sys focus:outline-none focus:ring-2 resize-y',
          fieldErrors.features ? 'border-red-500 focus:ring-red-500' : 'border-nw-text-line focus:ring-nw-cyan'
        ]"></textarea>
        <p v-if="fieldErrors.features" class="text-red-400 text-xs font-sys mt-1">{{ fieldErrors.features }}</p>
      </div>

      <p v-if="generalError" class="text-red-400 text-sm font-sys" role="alert">{{ generalError }}</p>
      <p v-if="success" class="text-nw-green text-sm font-sys">{{ success }}</p>

      <!-- Actions -->
      <div class="flex gap-3 pt-2">
        <button type="submit" :disabled="saving" class="px-6 py-2 bg-void-raised text-void-warm font-sys font-bold rounded shadow hover:bg-nw-cyan transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          <LucideLoader v-if="saving" class="w-4 h-4 animate-spin" />
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
        <button type="button" @click="deleteProject" class="px-6 py-2 text-nw-red hover:text-nw-red/80 font-sys transition">
          Delete Project
        </button>
        <NuxtLink to="/admin/projects" class="px-6 py-2 text-nw-text-dim font-sys hover:text-nw-text transition">
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
const generalError = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})
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
  try {
    const res = await $fetch<Record<string, unknown>>(`/api/admin/projects/${projectId.value}`)
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
    generalError.value = 'Failed to load project'
  } finally {
    loading.value = false
  }
})

function mapFieldErrors(e: any): Record<string, string> {
  const data = e?.data ?? e
  const errorObj = data?.data?.error ?? data?.error ?? {}
  const details = errorObj?.details ?? {}
  const mapped: Record<string, string> = {}
  for (const [key, value] of Object.entries(details)) {
    mapped[key] = Array.isArray(value) ? value.join('; ') : String(value)
  }
  return mapped
}

async function saveProject() {
  saving.value = true
  generalError.value = null
  fieldErrors.value = {}
  success.value = null

  const techStack = form.techStack.split(',').map(t => t.trim()).filter(Boolean)
  const features = form.features.split('\n').map(f => f.trim()).filter(Boolean)

  try {
    await $fetch(`/api/projects/${projectId.value}`, {
      method: 'patch' as any,
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
    const details = mapFieldErrors(e)
    if (Object.keys(details).length > 0) {
      fieldErrors.value = details
    } else {
      const apiError = e?.data?.data?.error ?? e?.data?.error ?? e
      generalError.value = apiError?.message ?? e?.statusMessage ?? 'Failed to update project'
    }
  } finally {
    saving.value = false
  }
}

async function deleteProject() {
  if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return

  try {
    await $fetch(`/api/projects/${projectId.value}`, { method: 'delete' as any })
    navigateTo('/admin/projects')
  } catch {
    generalError.value = 'Failed to delete project'
  }
}
</script>
