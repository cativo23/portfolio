<template>
  <div>
    <h1 class="text-xl font-bold text-nw-text mb-6">Contacts</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-nw-text-dim font-sys">
      Loading contacts...
    </div>

    <!-- Table -->
    <div v-else-if="contacts.length" class="bg-void-warm border border-nw-text-line/30 rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-void-warm">
          <tr>
            <th class="text-left px-4 py-3 text-nw-text-dim font-sys text-xs">Name</th>
            <th class="text-left px-4 py-3 text-nw-text-dim font-sys text-xs hidden md:table-cell">Email</th>
            <th class="text-left px-4 py-3 text-nw-text-dim font-sys text-xs hidden lg:table-cell">Message</th>
            <th class="text-left px-4 py-3 text-nw-text-dim font-sys text-xs hidden md:table-cell">Date</th>
            <th class="text-center px-4 py-3 text-nw-text-dim font-sys text-xs">Status</th>
            <th class="text-right px-4 py-3 text-nw-text-dim font-sys text-xs">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-nw-text-line/20">
          <tr v-for="contact in contacts" :key="contact.id" class="hover:bg-void-raised/20 transition-colors" :class="!contact.isRead ? 'bg-nw-primary/5' : ''">
            <td class="px-4 py-3">
              <span class="text-nw-text font-medium">{{ contact.name }}</span>
            </td>
            <td class="px-4 py-3 hidden md:table-cell">
              <a :href="`mailto:${contact.email}`" class="text-nw-primary hover:underline text-xs">{{ contact.email }}</a>
            </td>
            <td class="px-4 py-3 hidden lg:table-cell">
              <span class="text-nw-text-dim text-xs line-clamp-1">{{ contact.message }}</span>
            </td>
            <td class="px-4 py-3 hidden md:table-cell">
              <span class="text-nw-text-dim text-xs">{{ formatDate(contact.createdAt) }}</span>
            </td>
            <td class="px-4 py-3 text-center">
              <span class="px-2 py-1 rounded text-xs font-sys" :class="contact.isRead ? 'bg-nw-text-line/20 text-nw-text-dim' : 'bg-nw-yellow/20 text-nw-yellow'">
                {{ contact.isRead ? 'Read' : 'Unread' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <button @click="viewContact(contact)" class="text-nw-primary hover:text-nw-cyan text-xs font-sys">
                  View
                </button>
                <button @click="deleteContact(contact.id)" class="text-nw-red hover:text-nw-red/80 text-xs font-sys">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-12 text-nw-text-dim font-sys">
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
