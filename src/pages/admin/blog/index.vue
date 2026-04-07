<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-bold text-tokyo-night-text">Blog Posts</h1>
      <NuxtLink to="/admin/blog/new" class="flex items-center gap-2 px-4 py-2 font-mono text-sm transition-colors border rounded-lg bg-tokyo-night-green/20 text-tokyo-night-green border-tokyo-night-green/30 hover:bg-tokyo-night-green/30">
        <LucidePlus class="w-4 h-4" />
        New Post
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-12 font-mono text-center text-tokyo-night-muted">
      Loading posts...
    </div>

    <!-- Table -->
    <div v-else-if="posts.length" class="overflow-hidden border rounded-lg bg-tokyo-night-dark border-tokyo-night-gray/30">
      <table class="w-full text-sm">
        <thead class="bg-tokyo-night-bg">
          <tr>
            <th class="px-4 py-3 font-mono text-xs text-left text-tokyo-night-muted">Title</th>
            <th class="hidden px-4 py-3 font-mono text-xs text-left text-tokyo-night-muted md:table-cell">Date</th>
            <th class="px-4 py-3 font-mono text-xs text-center text-tokyo-night-muted">Status</th>
            <th class="px-4 py-3 font-mono text-xs text-right text-tokyo-night-muted">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-tokyo-night-gray/20">
          <tr v-for="post in posts" :key="post.path" class="transition-colors hover:bg-tokyo-night-highlight/20">
            <td class="px-4 py-3">
              <p class="font-medium text-tokyo-night-text">{{ post.title }}</p>
              <p class="max-w-xs text-xs truncate text-tokyo-night-muted">{{ post.description }}</p>
            </td>
            <td class="hidden px-4 py-3 md:table-cell">
              <span class="text-xs text-tokyo-night-muted">{{ formatDate(post.created_at) }}</span>
            </td>
            <td class="px-4 py-3 text-center">
              <span class="px-2 py-1 font-mono text-xs rounded" :class="post._draft ? 'bg-tokyo-night-yellow/20 text-tokyo-night-yellow' : 'bg-tokyo-night-green/20 text-tokyo-night-green'">
                {{ post._draft ? 'Draft' : 'Published' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <NuxtLink :to="`/admin/blog/${post.path.replace(/\//g, '--')}`" class="font-mono text-xs text-tokyo-night-blue hover:text-tokyo-night-cyan">
                  Edit
                </NuxtLink>
                <button @click="deletePost(post)" class="font-mono text-xs text-tokyo-night-red/70 hover:text-tokyo-night-red">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div v-else class="py-12 font-mono text-center text-tokyo-night-muted">
      No blog posts found.
    </div>

    <!-- Delete confirmation -->
    <div v-if="deletingPost" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div class="bg-tokyo-night-dark border border-tokyo-night-gray/30 rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-bold text-tokyo-night-text mb-2">Delete Post</h3>
        <p class="text-sm text-tokyo-night-muted mb-6">
          Are you sure you want to delete "<strong class="text-tokyo-night-text">{{ deletingPost.title }}</strong>"? This cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button @click="deletingPost = null" class="px-4 py-2 text-sm text-tokyo-night-muted hover:text-tokyo-night-text transition font-mono">
            Cancel
          </button>
          <button @click="confirmDelete" class="px-4 py-2 text-sm bg-tokyo-night-red/20 text-tokyo-night-red border border-tokyo-night-red/30 rounded hover:bg-tokyo-night-red/30 transition font-mono">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

interface BlogPostAdmin {
  title: string
  description?: string
  created_at?: string
  path: string
  _draft?: boolean
}

const posts = ref<BlogPostAdmin[]>([])
const loading = ref(true)
const deletingPost = ref<BlogPostAdmin | null>(null)

onMounted(async () => {
  try {
    // Fetch published posts (exclude drafts by path)
    const allPosts = await queryCollection('blog').all()
    const published = allPosts.filter(p => !p.path?.startsWith('/blog/drafts'))
    const publishedPosts: BlogPostAdmin[] = published.map(p => ({
      ...p,
      _draft: false,
    }))

    // Fetch drafts from server route
    try {
      const drafts = await $fetch<BlogPostAdmin[]>('/api/admin/blog/drafts')
      const draftPosts: BlogPostAdmin[] = drafts.map(d => ({
        ...d,
        _draft: true,
      }))
      posts.value = [...publishedPosts, ...draftPosts].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
        return dateB - dateA
      })
    } catch {
      posts.value = publishedPosts
    }
  } catch {
    posts.value = []
  } finally {
    loading.value = false
  }
})

function deletePost(post: BlogPostAdmin) {
  deletingPost.value = post
}

async function confirmDelete() {
  if (!deletingPost.value) return
  const post = deletingPost.value
  const pathSlug = post.path.replace('/blog/', '')

  try {
    await $fetch(`/api/admin/blog/${pathSlug}`, { method: 'delete' as any })
    posts.value = posts.value.filter(p => p.path !== post.path)
  } catch {
    // silently ignore — post may have been deleted already
  } finally {
    deletingPost.value = null
  }
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>
