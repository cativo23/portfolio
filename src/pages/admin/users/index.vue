<template>
  <div class="flex flex-col gap-4">
    <!-- Header row -->
    <div class="flex justify-between items-center">
      <span class="font-stamp text-[13px] tracking-[0.14em] uppercase text-nw-text">Users</span>
      <button
        @click="openCreateModal"
        class="btn flex items-center gap-1.5 text-[11px]"
      >
        <LucidePlus class="w-3.5 h-3.5" />
        New User
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-12 text-center font-stamp text-[10px] tracking-wider uppercase text-nw-text-dim">Loading…</div>

    <!-- Error -->
    <div v-else-if="error" class="py-12 text-center font-stamp text-[10px] tracking-wider uppercase text-nw-red">{{ error }}</div>

    <!-- Table -->
    <div v-else-if="users.length" class="bg-void-warm border border-nw-text-faint">
      <div class="flex justify-between items-center px-3 py-[7px] border-b border-nw-primary-dim">
        <span class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-primary">All Users</span>
        <span class="font-stamp text-[8px] text-nw-text-dim">{{ users.length }} RECORDS</span>
      </div>
      <table class="w-full">
        <thead>
          <tr>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim">Username</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim hidden md:table-cell">Email</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim hidden lg:table-cell">Role</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim hidden md:table-cell">Created</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-right px-3 py-[6px] border-b border-nw-primary-dim">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-b border-nw-text-faint last:border-b-0 hover:bg-nw-cyan/[0.04] transition-colors"
          >
            <td class="px-3 py-[7px]">
              <span class="text-[11px] text-nw-text">{{ user.username }}</span>
            </td>
            <td class="px-3 py-[7px] hidden md:table-cell">
              <span class="text-[10px] text-nw-text-dim">{{ user.email }}</span>
            </td>
            <td class="px-3 py-[7px] hidden lg:table-cell">
              <span class="font-stamp text-[8px] tracking-[0.1em] uppercase border px-1.5 py-px text-nw-cyan border-nw-cyan/30 bg-nw-cyan/[0.06]">
                {{ user.role || 'admin' }}
              </span>
            </td>
            <td class="px-3 py-[7px] hidden md:table-cell">
              <span class="text-[10px] text-nw-text-dim">{{ formatDate(user.createdAt || user.created_at) }}</span>
            </td>
            <td class="px-3 py-[7px] text-right">
              <button @click="openEditModal(user)" class="font-stamp text-[9px] tracking-[0.1em] uppercase text-nw-primary-dim hover:text-nw-primary transition-colors mr-3">
                EDIT
              </button>
              <button @click="openDeleteModal(user)" class="font-stamp text-[9px] tracking-[0.1em] uppercase text-nw-red/50 hover:text-nw-red transition-colors">
                DEL
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div v-else class="py-12 text-center font-stamp text-[10px] tracking-wider uppercase text-nw-text-dim">No users found.</div>

    <!-- Create/Edit Modal -->
    <div v-if="modalUser !== undefined" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60" @click.self="closeModal">
      <div class="bg-void-warm border border-nw-text-line/30 rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-bold text-nw-text mb-4">
          {{ modalUser === null ? 'New User' : 'Edit User' }}
        </h3>
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm text-nw-cyan font-sys mb-1">Username</label>
            <input v-model="form.username" type="text" required :disabled="modalUser !== null" class="w-full px-3 py-2 bg-void-warm text-nw-text border border-nw-text-line rounded focus:outline-none focus:ring-2 focus:ring-nw-cyan font-sys text-sm disabled:opacity-50" :placeholder="modalUser === null ? 'username' : ''" />
          </div>
          <div>
            <label class="block text-sm text-nw-cyan font-sys mb-1">Email</label>
            <input v-model="form.email" type="email" required class="w-full px-3 py-2 bg-void-warm text-nw-text border border-nw-text-line rounded focus:outline-none focus:ring-2 focus:ring-nw-cyan font-sys text-sm" placeholder="user@example.com" />
          </div>
          <div>
            <label class="block text-sm text-nw-cyan font-sys mb-1">{{ modalUser === null ? 'Password' : 'New Password (leave blank to keep)' }}</label>
            <input v-model="form.password" type="password" :required="modalUser === null" class="w-full px-3 py-2 bg-void-warm text-nw-text border border-nw-text-line rounded focus:outline-none focus:ring-2 focus:ring-nw-cyan font-sys text-sm" :placeholder="modalUser === null ? 'min 6 chars' : ''" />
          </div>
          <p v-if="formError" class="text-red-400 text-sm font-sys" role="alert">{{ formError }}</p>
          <p v-if="formSuccess" class="text-nw-green text-sm font-sys">{{ formSuccess }}</p>
          <div class="flex justify-end gap-3">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm text-nw-text-dim hover:text-nw-text transition font-sys">Cancel</button>
            <button type="submit" :disabled="saving" class="btn text-sm disabled:opacity-50">{{ saving ? 'Saving...' : 'Save' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete confirmation -->
    <div v-if="deletingUser" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div class="bg-void-warm border border-nw-text-line/30 rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-bold text-nw-text mb-2">Delete User</h3>
        <p class="text-sm text-nw-text-dim mb-6">Are you sure you want to delete "<strong class="text-nw-text">{{ deletingUser.username }}</strong>"? This cannot be undone.</p>
        <div class="flex justify-end gap-3">
          <button @click="deletingUser = null" class="px-4 py-2 text-sm text-nw-text-dim hover:text-nw-text transition font-sys">Cancel</button>
          <button @click="confirmDelete" class="btn-danger text-sm">Delete</button>
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
  try {
    const res = await $fetch<Record<string, unknown>>('/api/admin/users')
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

  const body: Record<string, string> = {
    username: form.username,
    email: form.email,
  }
  if (form.password) body.password = form.password

  try {
    if (modalUser.value === null) {
      await $fetch('/api/admin/users', { method: 'post' as any, body })
      formSuccess.value = 'User created!'
    } else {
      await $fetch(`/api/admin/users/${modalUser.value!.id}`, { method: 'put' as any, body })
      formSuccess.value = 'User updated!'
    }

    setTimeout(async () => {
      closeModal()
      await fetchUsers()
    }, 1000)
  } catch (e: any) {
    const responseData = e?.data ?? e?.response?._data ?? e
    const apiError = responseData?.error ?? responseData

    if (apiError?.details && typeof apiError.details === 'object') {
      formError.value = Object.values(apiError.details).join('; ')
    } else if (typeof apiError?.message === 'string') {
      formError.value = apiError.message
    } else if (typeof apiError === 'string') {
      formError.value = apiError
    } else {
      formError.value = e?.statusMessage || 'Failed to save user'
    }
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

  try {
    await $fetch(`/api/admin/users/${user.id}`, { method: 'delete' as any })
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
