<template>
  <div>
    <h1 class="text-xl font-bold text-nw-text mb-6 font-sys">Dashboard</h1>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-void-warm border border-nw-text-line/30 rounded-lg p-6">
        <div class="flex items-center gap-3 mb-2">
          <LucideFolderOpen class="w-5 h-5 text-nw-primary" />
          <h3 class="text-sm text-nw-text-dim font-sys">Projects</h3>
        </div>
        <p class="text-3xl font-bold text-nw-text">{{ projectCount }}</p>
      </div>

      <div class="bg-void-warm border border-nw-text-line/30 rounded-lg p-6">
        <div class="flex items-center gap-3 mb-2">
          <LucideMail class="w-5 h-5 text-nw-yellow" />
          <h3 class="text-sm text-nw-text-dim font-sys">Unread Contacts</h3>
        </div>
        <p class="text-3xl font-bold text-nw-text">{{ unreadContacts }}</p>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="bg-void-warm border border-nw-text-line/30 rounded-lg p-6">
      <h2 class="text-sm font-sys text-nw-text-dim mb-4">Quick Links</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <NuxtLink to="/admin/projects" class="flex items-center gap-3 p-3 rounded bg-void-warm hover:bg-void-raised/50 transition-colors">
          <LucidePlus class="w-4 h-4 text-nw-green" />
          <span class="text-sm">Add New Project</span>
        </NuxtLink>
        <NuxtLink to="/admin/contacts" class="flex items-center gap-3 p-3 rounded bg-void-warm hover:bg-void-raised/50 transition-colors">
          <LucideInbox class="w-4 h-4 text-nw-primary" />
          <span class="text-sm">View Contacts</span>
        </NuxtLink>
        <NuxtLink to="/" target="_blank" class="flex items-center gap-3 p-3 rounded bg-void-warm hover:bg-void-raised/50 transition-colors">
          <LucideExternalLink class="w-4 h-4 text-nw-purple" />
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
const unreadContacts = ref(0)

// Load stats from API
onMounted(async () => {
  try {
    const [projects, contacts] = await Promise.all([
      $fetch<Record<string, unknown>>('/api/projects').catch(() => ({ data: [] })),
      $fetch<Record<string, unknown>>('/api/admin/contacts').catch(() => ({ data: [] })),
    ])

    const projectsData = projects as Record<string, unknown>
    const contactsData = contacts as Record<string, unknown>

    const projArray = (projectsData.data as unknown[]) || []
    const contactArray = (contactsData.data as Array<Record<string, unknown>>) || []
    projectCount.value = projArray.length
    unreadContacts.value = contactArray.filter(c => !c.isRead).length
  } catch { /* ignore */ }
})
</script>
