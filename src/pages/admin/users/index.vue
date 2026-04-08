<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-bold text-tokyo-night-text">Users</h1>
      <button
        @click="openCreateModal"
        class="flex items-center gap-2 px-4 py-2 font-mono text-sm transition-colors border rounded-lg bg-tokyo-night-green/20 text-tokyo-night-green border-tokyo-night-green/30 hover:bg-tokyo-night-green/30"
      >
        <LucidePlus class="w-4 h-4" />
        New User
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-12 font-mono text-center text-tokyo-night-muted">
      Loading users...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="py-12 font-mono text-center text-tokyo-night-red">
      {{ error }}
    </div>

    <!-- Table -->
    <div v-else-if="users.length" class="overflow-hidden border rounded-lg bg-tokyo-night-dark border-tokyo-night-gray/30">
      <table class="w-full text-sm">
        <thead class="bg-tokyo-night-bg">
          <tr>
            <th class="px-4 py-3 font-mono text-xs text-left text-tokyo-night-muted">Username</th>
            <th class="px-4 py-3 font-mono text-xs text-left text-tokyo-night-muted hidden md:table-cell">Email</th>
            <th class="px-4 py-3 font-mono text-xs text-left text-tokyo-night-muted hidden lg:table-cell">Role</th>
            <th class="px-4 py-3 font-mono text-xs text-left text-tokyo-night-muted hidden md:table-cell">Created</th>
            <th class="px-4 py-3 font-mono text-xs text-right text-tokyo-night-muted">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-tokyo-night-gray/20">
          <tr v-for="user in users" :key="user.id" class="transition-colors hover:bg-tokyo-night-highlight/20">
            <td class="px-4 py-3">
              <p class="font-medium text-tokyo-night-text">{{ user.username }}</p>
            </td>
            <td class="px-4 py-3 hidden md:table-cell">
              <span class="text-xs text-tokyo-night-muted">{{ user.email }}</span>
            </td>
            <td class="px-4 py-3 hidden lg:table-cell">
              <span class="px-2 py-1 font-mono text-xs rounded bg-tokyo-night-cyan/20 text-tokyo-night-cyan">
                {{ user.role || 'admin' }}
              </span>
            </td>
            <td class="px-4 py-3 hidden md:table-cell">
              <span class="text-xs text-tokyo-night-muted">{{ formatDate(user.createdAt || user.created_at) }}</span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <button @click="openEditModal(user)" class="font-mono text-xs text-tokyo-night-blue hover:text-tokyo-night-cyan">
                  Edit
                </button>
                <button @click="openDeleteModal(user)" class="font-mono text-xs text-tokyo-night-red/70 hover:text-tokyo-night-red">
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
      No users found.
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="modalUser !== undefined" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60" @click.self="closeModal">
      <div class="bg-tokyo-night-dark border border-tokyo-night-gray/30 rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-bold text-tokyo-night-text mb-4">
          {{ modalUser === null ? 'New User' : 'Edit User' }}
        </h3>
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm text-tokyo-night-cyan font-mono mb-1">Username</label>
            <input
              v-model="form.username"
              type="text"
              required
              :disabled="modalUser !== null"
              class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono text-sm disabled:opacity-50"
              :placeholder="modalUser === null ? 'username' : ''"
            />
          </div>
          <div>
            <label class="block text-sm text-tokyo-night-cyan font-mono mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono text-sm"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label class="block text-sm text-tokyo-night-cyan font-mono mb-1">
              {{ modalUser === null ? 'Password' : 'New Password (leave blank to keep)' }}
            </label>
            <input
              v-model="form.password"
              type="password"
              :required="modalUser === null"
              class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono text-sm"
              :placeholder="modalUser === null ? 'min 6 chars' : ''"
            />
          </div>
          <p v-if="formError" class="text-red-400 text-sm font-mono" role="alert">{{ formError }}</p>
          <p v-if="formSuccess" class="text-tokyo-night-green text-sm font-mono">{{ formSuccess }}</p>
          <div class="flex justify-end gap-3">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm text-tokyo-night-muted hover:text-tokyo-night-text transition font-mono">
              Cancel
            </button>
            <button type="submit" :disabled="saving" class="px-4 py-2 text-sm bg-tokyo-night-highlight text-tokyo-night-dark font-mono font-bold rounded shadow hover:bg-tokyo-night-cyan transition disabled:opacity-50">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete confirmation -->
    <div v-if="deletingUser" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div class="bg-tokyo-night-dark border border-tokyo-night-gray/30 rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-bold text-tokyo-night-text mb-2">Delete User</h3>
        <p class="text-sm text-tokyo-night-muted mb-6">
          Are you sure you want to delete "<strong class="text-tokyo-night-text">{{ deletingUser.username }}</strong>"? This cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button @click="deletingUser = null" class="px-4 py-2 text-sm text-tokyo-night-muted hover:text-tokyo-night-text transition font-mono">
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

interface AdminUser {
  id: number
  username: string
  email: string
  role?: string
  createdAt?: string
  created_at?: string
}

const users = ref<AdminUser[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const modalUser = ref<AdminUser | null | undefined>(undefined)
const deletingUser = ref<AdminUser | null>(null)
const saving = ref(false)
const formError = ref<string | null>(null)
const formSuccess = ref<string | null>(null)

const form = reactive({
  username: '',
  email: '',
  password: '',
})

async function fetchUsers() {
  const auth = useAdminAuth()
  auth.loadFromCookie()
  const token = auth.token.value
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  try {
    const res = await $fetch<Record<string, unknown>>('/api/admin/users', { headers })
    const data = (res as any)?.data as AdminUser[] | undefined
    users.value = Array.isArray(data) ? data : []
  } catch (e: any) {
    error.value = e?.statusMessage || e?.data?.error || 'Failed to load users'
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

function openCreateModal() {
  modalUser.value = null
  form.username = ''
  form.email = ''
  form.password = ''
  formError.value = null
  formSuccess.value = null
}

function openEditModal(user: AdminUser) {
  modalUser.value = user
  form.username = user.username
  form.email = user.email
  form.password = ''
  formError.value = null
  formSuccess.value = null
}

function closeModal() {
  modalUser.value = undefined
}

async function saveUser() {
  saving.value = true
  formError.value = null
  formSuccess.value = null

  const auth = useAdminAuth()
  const token = auth.token.value
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const body: Record<string, string> = {
    username: form.username,
    email: form.email,
  }
  if (form.password) body.password = form.password

  try {
    if (modalUser.value === null) {
      await $fetch('/api/admin/users', { method: 'post' as any, headers, body })
      formSuccess.value = 'User created!'
    } else {
      await $fetch(`/api/admin/users/${modalUser.value!.id}`, { method: 'put' as any, headers, body })
      formSuccess.value = 'User updated!'
    }

    setTimeout(async () => {
      closeModal()
      await fetchUsers()
    }, 1000)
  } catch (e: any) {
    formError.value = e?.data?.error || e?.statusMessage || 'Failed to save user'
  } finally {
    saving.value = false
  }
}

function openDeleteModal(user: AdminUser) {
  deletingUser.value = user
}

async function confirmDelete() {
  if (!deletingUser.value) return
  const user = deletingUser.value

  const auth = useAdminAuth()
  const token = auth.token.value
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  try {
    await $fetch(`/api/admin/users/${user.id}`, { method: 'delete' as any, headers })
    users.value = users.value.filter(u => u.id !== user.id)
  } catch {
    formError.value = 'Failed to delete user'
  } finally {
    deletingUser.value = null
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
