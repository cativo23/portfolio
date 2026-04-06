<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/admin/blog" class="text-tokyo-night-blue hover:text-tokyo-night-cyan">
        <LucideArrowLeft class="w-4 h-4" />
      </NuxtLink>
      <h1 class="text-xl font-bold text-tokyo-night-text">{{ isNew ? 'New Blog Post' : 'Edit Blog Post' }}</h1>
    </div>

    <form @submit.prevent="savePost" class="space-y-6 max-w-4xl">
      <!-- Title -->
      <div>
        <label for="title" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Title</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono"
          placeholder="Post title"
        >
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Description</label>
        <input
          id="description"
          v-model="form.description"
          type="text"
          required
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono"
          placeholder="Short description for SEO and listing"
        >
      </div>

      <!-- Tags -->
      <div>
        <label for="tags" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Tags (comma-separated)</label>
        <input
          id="tags"
          v-model="form.tags"
          type="text"
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono"
          placeholder="backend, career, learning"
        >
      </div>

      <!-- Status -->
      <div class="flex gap-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" value="draft" v-model="form.status" class="accent-tokyo-night-yellow">
          <span class="text-sm text-tokyo-night-muted">Save as Draft</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" value="published" v-model="form.status" class="accent-tokyo-night-green">
          <span class="text-sm text-tokyo-night-muted">Publish</span>
        </label>
      </div>

      <!-- Content -->
      <div>
        <label for="content" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Content (Markdown)</label>
        <textarea
          id="content"
          v-model="form.content"
          required
          rows="20"
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono resize-y"
          placeholder="Write your post in Markdown..."
        ></textarea>
      </div>

      <p v-if="error" class="text-red-400 text-sm font-mono" role="alert">{{ error }}</p>
      <p v-if="success" class="text-tokyo-night-green text-sm font-mono">{{ success }}</p>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          type="submit"
          :disabled="saving"
          class="px-6 py-2 bg-tokyo-night-highlight text-tokyo-night-dark font-mono font-bold rounded shadow hover:bg-tokyo-night-cyan transition disabled:opacity-50 flex items-center gap-2"
        >
          <LucideLoader v-if="saving" class="w-4 h-4 animate-spin" />
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
        <NuxtLink to="/admin/blog" class="px-6 py-2 text-tokyo-night-muted font-mono hover:text-tokyo-night-text transition">
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
const isNew = computed(() => route.path === '/admin/blog/new')

const form = reactive({
  title: '',
  description: '',
  tags: '',
  content: '',
  status: 'draft' as 'draft' | 'published',
})

const saving = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

async function savePost() {
  saving.value = true
  error.value = null
  success.value = null

  try {
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)

    await $fetch('/api/admin/blog', {
      method: 'post' as any,
      body: {
        title: form.title,
        description: form.description,
        tags,
        content: form.content,
        status: form.status,
        existingPath: isNew.value ? undefined : route.params.path,
      },
    })

    success.value = form.status === 'draft' ? 'Draft saved successfully!' : 'Post published!'

    if (form.status === 'published') {
      setTimeout(() => navigateTo('/admin/blog'), 1000)
    }
  } catch (e: any) {
    error.value = e?.statusMessage || e?.data?.error || 'Failed to save post'
  } finally {
    saving.value = false
  }
}
</script>
