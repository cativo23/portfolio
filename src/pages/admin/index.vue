<template>
  <div>
    <h1 class="text-xl font-bold text-tokyo-night-text mb-6">Dashboard</h1>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-tokyo-night-dark border border-tokyo-night-gray/30 rounded-lg p-6">
        <div class="flex items-center gap-3 mb-2">
          <LucideFolderOpen class="w-5 h-5 text-tokyo-night-blue" />
          <h3 class="text-sm text-tokyo-night-muted font-mono">Projects</h3>
        </div>
        <p class="text-3xl font-bold text-tokyo-night-text">{{ projectCount }}</p>
      </div>

      <div class="bg-tokyo-night-dark border border-tokyo-night-gray/30 rounded-lg p-6">
        <div class="flex items-center gap-3 mb-2">
          <LucideFileText class="w-5 h-5 text-tokyo-night-green" />
          <h3 class="text-sm text-tokyo-night-muted font-mono">Blog Posts</h3>
        </div>
        <p class="text-3xl font-bold text-tokyo-night-text">{{ blogCount }}</p>
      </div>

      <div class="bg-tokyo-night-dark border border-tokyo-night-gray/30 rounded-lg p-6">
        <div class="flex items-center gap-3 mb-2">
          <LucideMail class="w-5 h-5 text-tokyo-night-yellow" />
          <h3 class="text-sm text-tokyo-night-muted font-mono">Unread Contacts</h3>
        </div>
        <p class="text-3xl font-bold text-tokyo-night-text">{{ unreadContacts }}</p>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="bg-tokyo-night-dark border border-tokyo-night-gray/30 rounded-lg p-6">
      <h2 class="text-sm font-mono text-tokyo-night-muted mb-4">Quick Links</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <NuxtLink to="/admin/projects" class="flex items-center gap-3 p-3 rounded bg-tokyo-night-bg hover:bg-tokyo-night-highlight/50 transition-colors">
          <LucidePlus class="w-4 h-4 text-tokyo-night-green" />
          <span class="text-sm">Add New Project</span>
        </NuxtLink>
        <NuxtLink to="/admin/blog/new" class="flex items-center gap-3 p-3 rounded bg-tokyo-night-bg hover:bg-tokyo-night-highlight/50 transition-colors">
          <LucidePlus class="w-4 h-4 text-tokyo-night-green" />
          <span class="text-sm">Write New Post</span>
        </NuxtLink>
        <NuxtLink to="/admin/contacts" class="flex items-center gap-3 p-3 rounded bg-tokyo-night-bg hover:bg-tokyo-night-highlight/50 transition-colors">
          <LucideInbox class="w-4 h-4 text-tokyo-night-blue" />
          <span class="text-sm">View Contacts</span>
        </NuxtLink>
        <NuxtLink to="/" target="_blank" class="flex items-center gap-3 p-3 rounded bg-tokyo-night-bg hover:bg-tokyo-night-highlight/50 transition-colors">
          <LucideExternalLink class="w-4 h-4 text-tokyo-night-purple" />
          <span class="text-sm">View Site</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const projectCount = ref(0)
const blogCount = ref(0)
const unreadContacts = ref(0)

// Load stats from API
onMounted(async () => {
  const auth = useAdminAuth()
  auth.loadFromCookie()
  const token = auth.token.value

  if (!token) return

  const headers = { Authorization: `Bearer ${token}` }

  try {
    const [projects, contacts] = await Promise.all([
      $fetch('/api/projects', { headers }).catch(() => ({ data: [] })),
      $fetch('/api/admin/contacts', { headers }).catch(() => ({ data: [] })),
    ])

    // Blog count from content API
    try {
      const posts = await queryCollection('blog').all()
      blogCount.value = posts.length
    } catch { /* ignore */ }

    projectCount.value = projects?.data?.length || 0
    unreadContacts.value = contacts?.data?.filter((c: any) => !c.isRead)?.length || 0
  } catch { /* ignore */ }
})
</script>
