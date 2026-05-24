<template>
  <div class="flex flex-col gap-4">
    <div class="font-stamp text-[13px] tracking-[0.14em] uppercase text-nw-text">Dashboard</div>

    <!-- Metrics strip -->
    <div class="grid grid-cols-4 gap-px bg-nw-text-faint border border-nw-text-faint">
      <div class="bg-void-warm px-4 py-3">
        <div class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-primary mb-1">Projects</div>
        <div class="text-[24px] font-bold text-nw-green leading-none" style="text-shadow: 0 0 8px rgba(122,237,122,0.35);">{{ projectCount }}</div>
        <div class="font-stamp text-[8px] text-nw-text-dim mt-1">total</div>
      </div>
      <div class="bg-void-warm px-4 py-3">
        <div class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-primary mb-1">Unread</div>
        <div class="text-[24px] font-bold text-nw-yellow leading-none" style="text-shadow: 0 0 8px rgba(232,153,58,0.35);">{{ unreadContacts }}</div>
        <div class="font-stamp text-[8px] text-nw-text-dim mt-1">contacts</div>
      </div>
      <div class="bg-void-warm px-4 py-3">
        <div class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-primary mb-1">Users</div>
        <div class="text-[24px] font-bold text-nw-cyan leading-none" style="text-shadow: 0 0 8px rgba(102,221,255,0.3);">{{ userCount }}</div>
        <div class="font-stamp text-[8px] text-nw-text-dim mt-1">admins</div>
      </div>
      <div class="bg-void-warm px-4 py-3">
        <div class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-primary mb-2">System</div>
        <div class="flex items-center gap-2">
          <span class="led green blink" />
          <span class="font-stamp text-[11px] text-nw-green">NOMINAL</span>
        </div>
      </div>
    </div>

    <!-- Panel pair -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Recent Projects -->
      <div class="bg-void-warm border border-nw-text-faint">
        <div class="flex justify-between items-center px-3 py-[7px] border-b border-nw-primary-dim">
          <span class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-primary">Recent Projects</span>
          <span class="font-stamp text-[8px] text-nw-text-dim">CASE FILES</span>
        </div>
        <div>
          <NuxtLink
            v-for="project in recentProjects"
            :key="project.id"
            :to="`/admin/projects/${project.id}`"
            class="flex items-center justify-between px-3 py-[7px] border-b border-nw-text-faint last:border-b-0 hover:bg-nw-cyan/[0.04] transition-colors"
          >
            <span class="text-[11px] text-nw-text-dim">{{ project.title }}</span>
            <span class="font-stamp text-[8px] border px-1.5 py-px" :class="projectBadgeClass(project)">
              {{ (project.status || (project.isFeatured ? 'FEATURED' : 'STD')).toUpperCase() }}
            </span>
          </NuxtLink>
          <div v-if="!recentProjects.length" class="px-3 py-4 text-[10px] text-nw-text-dim font-stamp">
            No projects yet
          </div>
        </div>
      </div>

      <!-- Recent Contacts -->
      <div class="bg-void-warm border border-nw-text-faint">
        <div class="flex justify-between items-center px-3 py-[7px] border-b border-nw-primary-dim">
          <span class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-primary">Contacts</span>
          <span class="font-stamp text-[8px] text-nw-text-dim">INBOX</span>
        </div>
        <div>
          <NuxtLink
            v-for="contact in recentContacts"
            :key="contact.id"
            to="/admin/contacts"
            class="flex items-center justify-between px-3 py-[7px] border-b border-nw-text-faint last:border-b-0 hover:bg-nw-cyan/[0.04] transition-colors"
          >
            <span class="text-[11px] text-nw-text-dim truncate max-w-[160px]">{{ contact.name }}</span>
            <span class="font-stamp text-[8px] border px-1.5 py-px" :class="contact.isRead ? 'text-[#555] border-[#333]' : 'text-nw-yellow border-nw-yellow/40 bg-nw-yellow/[0.06]'">
              {{ contact.isRead ? 'READ' : 'UNREAD' }}
            </span>
          </NuxtLink>
          <div v-if="!recentContacts.length" class="px-3 py-4 text-[10px] text-nw-text-dim font-stamp">
            No contacts yet
          </div>
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

interface DashProject { id: number; title: string; isFeatured?: boolean; status?: string }
interface DashContact { id: number; name: string; isRead: boolean }

const projectCount = ref(0)
const unreadContacts = ref(0)
const userCount = ref(0)
const recentProjects = ref<DashProject[]>([])
const recentContacts = ref<DashContact[]>([])

function projectBadgeClass(p: DashProject) {
  const s = (p.status || '').toLowerCase()
  if (['live', 'completed', 'production'].includes(s))
    return 'text-nw-green border-nw-green-dim bg-nw-green-faint'
  if (['wip', 'active', 'in-progress'].includes(s))
    return 'text-nw-yellow border-nw-yellow/40 bg-nw-yellow/[0.06]'
  return 'text-nw-text-dim border-nw-text-line'
}

onMounted(async () => {
  try {
    const [projects, contacts, users] = await Promise.all([
      $fetch<Record<string, unknown>>('/api/projects').catch(() => ({ data: [] })),
      $fetch<Record<string, unknown>>('/api/admin/contacts').catch(() => ({ data: [] })),
      $fetch<Record<string, unknown>>('/api/admin/users').catch(() => ({ data: [] })),
    ])

    const projArray = (projects.data as DashProject[]) || []
    const contactArray = (contacts.data as DashContact[]) || []
    const userArray = (users.data as unknown[]) || []

    projectCount.value = projArray.length
    unreadContacts.value = contactArray.filter(c => !c.isRead).length
    userCount.value = userArray.length
    recentProjects.value = projArray.slice(0, 3)
    recentContacts.value = contactArray.slice(0, 3)
  } catch { /* ignore */ }
})
</script>
