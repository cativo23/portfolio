<template>
  <div>
    <h1 class="text-xl font-bold text-tokyo-night-text mb-6">Contacts</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-tokyo-night-muted font-mono">
      Loading contacts...
    </div>

    <!-- Table -->
    <div v-else-if="contacts.length" class="bg-tokyo-night-dark border border-tokyo-night-gray/30 rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-tokyo-night-bg">
          <tr>
            <th class="text-left px-4 py-3 text-tokyo-night-muted font-mono text-xs">Name</th>
            <th class="text-left px-4 py-3 text-tokyo-night-muted font-mono text-xs hidden md:table-cell">Email</th>
            <th class="text-left px-4 py-3 text-tokyo-night-muted font-mono text-xs hidden lg:table-cell">Message</th>
            <th class="text-left px-4 py-3 text-tokyo-night-muted font-mono text-xs hidden md:table-cell">Date</th>
            <th class="text-center px-4 py-3 text-tokyo-night-muted font-mono text-xs">Status</th>
            <th class="text-right px-4 py-3 text-tokyo-night-muted font-mono text-xs">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-tokyo-night-gray/20">
          <tr v-for="contact in contacts" :key="contact.id" class="hover:bg-tokyo-night-highlight/20 transition-colors" :class="!contact.isRead ? 'bg-tokyo-night-blue/5' : ''">
            <td class="px-4 py-3">
              <span class="text-tokyo-night-text font-medium">{{ contact.name }}</span>
            </td>
            <td class="px-4 py-3 hidden md:table-cell">
              <a :href="`mailto:${contact.email}`" class="text-tokyo-night-blue hover:underline text-xs">{{ contact.email }}</a>
            </td>
            <td class="px-4 py-3 hidden lg:table-cell">
              <span class="text-tokyo-night-muted text-xs line-clamp-1">{{ contact.message }}</span>
            </td>
            <td class="px-4 py-3 hidden md:table-cell">
              <span class="text-tokyo-night-muted text-xs">{{ formatDate(contact.createdAt) }}</span>
            </td>
            <td class="px-4 py-3 text-center">
              <span class="px-2 py-1 rounded text-xs font-mono" :class="contact.isRead ? 'bg-tokyo-night-gray/20 text-tokyo-night-muted' : 'bg-tokyo-night-yellow/20 text-tokyo-night-yellow'">
                {{ contact.isRead ? 'Read' : 'Unread' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <button @click="viewContact(contact)" class="text-tokyo-night-blue hover:text-tokyo-night-cyan text-xs font-mono">
                  View
                </button>
                <button @click="deleteContact(contact.id)" class="text-tokyo-night-red hover:text-tokyo-night-red/80 text-xs font-mono">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-12 text-tokyo-night-muted font-mono">
      No contacts found.
    </div>

    <!-- Contact Detail Modal -->
    <div v-if="selectedContact" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="selectedContact = null">
      <div class="bg-tokyo-night-dark border border-tokyo-night-gray/30 rounded-lg max-w-lg w-full p-6 max-h-[80vh] overflow-auto">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-lg font-bold text-tokyo-night-text">{{ selectedContact.name }}</h2>
          <button @click="selectedContact = null" class="text-tokyo-night-muted hover:text-tokyo-night-text">
            <LucideX class="w-4 h-4" />
          </button>
        </div>
        <div class="space-y-3 text-sm">
          <div>
            <span class="text-tokyo-night-muted font-mono text-xs">EMAIL</span>
            <p><a :href="`mailto:${selectedContact.email}`" class="text-tokyo-night-blue hover:underline">{{ selectedContact.email }}</a></p>
          </div>
          <div v-if="selectedContact.subject">
            <span class="text-tokyo-night-muted font-mono text-xs">SUBJECT</span>
            <p>{{ selectedContact.subject }}</p>
          </div>
          <div>
            <span class="text-tokyo-night-muted font-mono text-xs">MESSAGE</span>
            <p class="text-tokyo-night-text mt-1 whitespace-pre-wrap">{{ selectedContact.message }}</p>
          </div>
          <div>
            <span class="text-tokyo-night-muted font-mono text-xs">DATE</span>
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
  const auth = useAdminAuth()
  auth.loadFromCookie()
  const token = auth.token.value

  if (!token) return

  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await $fetch('/api/admin/contacts', { headers })
    contacts.value = res?.data || []
  } catch {
    // Try unauthenticated for dev
    try {
      const res = await $fetch('/api/admin/contacts')
      contacts.value = res?.data || []
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

  const auth = useAdminAuth()
  const token = auth.token.value
  if (!token) return

  try {
    await $fetch(`/api/admin/contacts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
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
