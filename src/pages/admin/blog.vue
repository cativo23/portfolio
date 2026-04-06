<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold text-tokyo-night-text">Blog Posts</h1>
      <NuxtLink to="/admin/blog/new" class="px-4 py-2 bg-tokyo-night-green/20 text-tokyo-night-green border border-tokyo-night-green/30 rounded-lg text-sm font-mono hover:bg-tokyo-night-green/30 transition-colors flex items-center gap-2">
        <LucidePlus class="w-4 h-4" />
        New Post
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-tokyo-night-muted font-mono">
      Loading posts...
    </div>

    <!-- Table -->
    <div v-else-if="posts.length" class="bg-tokyo-night-dark border border-tokyo-night-gray/30 rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-tokyo-night-bg">
          <tr>
            <th class="text-left px-4 py-3 text-tokyo-night-muted font-mono text-xs">Title</th>
            <th class="text-left px-4 py-3 text-tokyo-night-muted font-mono text-xs hidden md:table-cell">Date</th>
            <th class="text-center px-4 py-3 text-tokyo-night-muted font-mono text-xs">Status</th>
            <th class="text-right px-4 py-3 text-tokyo-night-muted font-mono text-xs">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-tokyo-night-gray/20">
          <tr v-for="post in posts" :key="post.path" class="hover:bg-tokyo-night-highlight/20 transition-colors">
            <td class="px-4 py-3">
              <p class="text-tokyo-night-text font-medium">{{ post.title }}</p>
              <p class="text-tokyo-night-muted text-xs truncate max-w-xs">{{ post.description }}</p>
            </td>
            <td class="px-4 py-3 hidden md:table-cell">
              <span class="text-tokyo-night-muted text-xs">{{ formatDate(post.created_at) }}</span>
            </td>
            <td class="px-4 py-3 text-center">
              <span class="px-2 py-1 rounded text-xs font-mono" :class="post._draft ? 'bg-tokyo-night-yellow/20 text-tokyo-night-yellow' : 'bg-tokyo-night-green/20 text-tokyo-night-green'">
                {{ post._draft ? 'Draft' : 'Published' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <NuxtLink :to="`/admin/blog/${post.path.replace(/\//g, '--')}`" class="text-tokyo-night-blue hover:text-tokyo-night-cyan text-xs font-mono">
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
      No blog posts found.
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

onMounted(async () => {
  try {
    // Fetch published posts
    const published = await queryCollection('blog').all()
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

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>
