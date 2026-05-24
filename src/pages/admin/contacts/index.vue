<template>
  <div class="flex flex-col gap-4">
    <span class="font-stamp text-[13px] tracking-[0.14em] uppercase text-nw-text">Contacts</span>

    <!-- Loading -->
    <div v-if="loading" class="py-12 text-center font-stamp text-[10px] tracking-wider uppercase text-nw-text-dim">
      Loading…
    </div>

    <!-- Table -->
    <div v-else-if="contacts.length" class="bg-void-warm border border-nw-text-faint">
      <div class="flex justify-between items-center px-3 py-[7px] border-b border-nw-primary-dim">
        <span class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-primary">All Contacts</span>
        <span class="font-stamp text-[8px] text-nw-text-dim">{{ contacts.length }} RECORDS</span>
      </div>
      <table class="w-full">
        <thead>
          <tr>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim">Name</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim hidden md:table-cell">Email</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim hidden lg:table-cell">Message</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim hidden md:table-cell">Date</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-center px-3 py-[6px] border-b border-nw-primary-dim">Status</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-right px-3 py-[6px] border-b border-nw-primary-dim">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="contact in contacts"
            :key="contact.id"
            class="border-b border-nw-text-faint last:border-b-0 hover:bg-nw-cyan/[0.04] transition-colors"
            :class="!contact.isRead ? 'bg-nw-primary/[0.03]' : ''"
          >
            <td class="px-3 py-[7px]">
              <span class="text-[11px] text-nw-text">{{ contact.name }}</span>
            </td>
            <td class="px-3 py-[7px] hidden md:table-cell">
              <a :href="`mailto:${contact.email}`" class="text-[10px] text-nw-primary hover:text-nw-primary-hot transition-colors">{{ contact.email }}</a>
            </td>
            <td class="px-3 py-[7px] hidden lg:table-cell">
              <span class="text-[10px] text-nw-text-dim line-clamp-1">{{ contact.message }}</span>
            </td>
            <td class="px-3 py-[7px] hidden md:table-cell">
              <span class="text-[10px] text-nw-text-dim">{{ formatDate(contact.createdAt) }}</span>
            </td>
            <td class="px-3 py-[7px] text-center">
              <span
                class="font-stamp text-[8px] tracking-[0.1em] uppercase border px-1.5 py-px"
                :class="contact.isRead ? 'text-[#555] border-[#333]' : 'text-nw-yellow border-nw-yellow/40 bg-nw-yellow/[0.06]'"
              >
                {{ contact.isRead ? 'READ' : 'UNREAD' }}
              </span>
            </td>
            <td class="px-3 py-[7px] text-right">
              <button @click="viewContact(contact)" class="font-stamp text-[9px] tracking-[0.1em] uppercase text-nw-primary-dim hover:text-nw-primary transition-colors mr-3">
                VIEW
              </button>
              <button @click="deleteContact(contact.id)" class="font-stamp text-[9px] tracking-[0.1em] uppercase text-nw-red/50 hover:text-nw-red transition-colors">
                DEL
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div v-else class="py-12 text-center font-stamp text-[10px] tracking-wider uppercase text-nw-text-dim">
      No contacts found.
    </div>

    <!-- Contact Detail Modal -->
    <div v-if="selectedContact" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="selectedContact = null">
      <div class="bg-void-warm border border-nw-text-line/30 rounded-lg max-w-lg w-full p-6 max-h-[80vh] overflow-auto">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-lg font-bold text-nw-text">{{ selectedContact.name }}</h2>
          <button @click="selectedContact = null" class="text-nw-text-dim hover:text-nw-text">
            <LucideX class="w-4 h-4" />
          </button>
        </div>
        <div class="space-y-3 text-sm">
          <div>
            <span class="text-nw-text-dim font-sys text-xs">EMAIL</span>
            <p><a :href="`mailto:${selectedContact.email}`" class="text-nw-primary hover:underline">{{ selectedContact.email }}</a></p>
          </div>
          <div v-if="selectedContact.subject">
            <span class="text-nw-text-dim font-sys text-xs">SUBJECT</span>
            <p>{{ selectedContact.subject }}</p>
          </div>
          <div>
            <span class="text-nw-text-dim font-sys text-xs">MESSAGE</span>
            <p class="text-nw-text mt-1 whitespace-pre-wrap">{{ selectedContact.message }}</p>
          </div>
          <div>
            <span class="text-nw-text-dim font-sys text-xs">DATE</span>
            <p>{{ formatDate(selectedContact.createdAt) }}</p>
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

interface AdminContact {
  id: number
  name: string
  email: string
  message: string
  subject?: string
  isRead: boolean
  createdAt: string
}

const contacts = ref<AdminContact[]>([])
const loading = ref(true)
const selectedContact = ref<AdminContact | null>(null)

onMounted(async () => {
  try {
    const res = await $fetch<Record<string, unknown>>('/api/admin/contacts')
    contacts.value = (res?.data as AdminContact[]) || []
  } catch {
    // Try unauthenticated for dev
    try {
      const res = await $fetch<Record<string, unknown>>('/api/admin/contacts')
      contacts.value = (res?.data as AdminContact[]) || []
    } catch { /* ignore */ }
  } finally {
    loading.value = false
  }
})

function viewContact(contact: AdminContact) {
  selectedContact.value = contact
}

async function deleteContact(id: number) {
  if (!confirm('Are you sure you want to delete this contact?')) return

  try {
    await $fetch(`/api/admin/contacts/${id}`, { method: 'delete' as any })
    contacts.value = contacts.value.filter(c => c.id !== id)
  } catch {
    alert('Failed to delete contact')
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>
