<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/admin/projects" class="text-tokyo-night-blue hover:text-tokyo-night-cyan">
        <LucideArrowLeft class="w-4 h-4" />
      </NuxtLink>
      <h1 class="text-xl font-bold text-tokyo-night-text">New Project</h1>
    </div>

    <form @submit.prevent="saveProject" class="space-y-6 max-w-3xl">
      <!-- Title -->
      <div>
        <label for="title" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Title *</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono"
          placeholder="My Awesome Project"
        >
      </div>

      <!-- Short Description -->
      <div>
        <label for="shortDescription" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Short Description *</label>
        <input
          id="shortDescription"
          v-model="form.shortDescription"
          type="text"
          required
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono"
          placeholder="One-line description"
        >
      </div>

      <!-- Full Description -->
      <div>
        <label for="description" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Description (Markdown)</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="6"
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono resize-y"
          placeholder="Full project description in Markdown..."
        ></textarea>
      </div>

      <!-- Tech Stack -->
      <div>
        <label for="techStack" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Tech Stack (comma-separated)</label>
        <input
          id="techStack"
          v-model="form.techStack"
          type="text"
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono"
          placeholder="NestJS, TypeScript, Docker"
        >
      </div>

      <!-- URLs -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="repoUrl" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Repository URL</label>
          <input
            id="repoUrl"
            v-model="form.repoUrl"
            type="url"
            class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono"
            placeholder="https://github.com/..."
          >
        </div>
        <div>
          <label for="liveUrl" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Live Demo URL</label>
          <input
            id="liveUrl"
            v-model="form.liveUrl"
            type="url"
            class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono"
            placeholder="https://..."
          >
        </div>
      </div>

      <!-- Status & Featured -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="status" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Status</label>
          <select
            id="status"
            v-model="form.status"
            class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono"
          >
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
        <input
          id="heroImage"
          v-model="form.heroImage"
          type="text"
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono"
          placeholder="/img/projects/my-project.png"
        >
      </div>

      <!-- Features -->
      <div>
        <label for="features" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Key Features (one per line)</label>
        <textarea
          id="features"
          v-model="form.features"
          rows="4"
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono resize-y"
          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
        ></textarea>
      </div>

      <p v-if="error" class="text-red-400 text-sm font-mono" role="alert">{{ error }}</p>
      <p v-if="success" class="text-tokyo-night-green text-sm font-mono">{{ success }}</p>

      <!-- Actions -->
      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          :disabled="saving"
          class="px-6 py-2 bg-tokyo-night-highlight text-tokyo-night-dark font-mono font-bold rounded shadow hover:bg-tokyo-night-cyan transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <LucideLoader v-if="saving" class="w-4 h-4 animate-spin" />
          {{ saving ? 'Saving...' : 'Create Project' }}
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

const saving = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

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
    await $fetch('/api/projects', {
      method: 'post' as any,
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

    success.value = 'Project created successfully!'
    setTimeout(() => navigateTo('/admin/projects'), 1000)
  } catch (e: any) {
    error.value = e?.data?.error?.message || e?.statusMessage || 'Failed to create project'
  } finally {
    saving.value = false
  }
}
</script>
