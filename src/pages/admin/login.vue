<template>
  <div class="flex items-center justify-center min-h-screen bg-void-warm">
    <div class="w-full max-w-md p-8 bg-void-warm border border-nw-text-line/30 rounded-lg">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold font-sys">
          <span class="text-nw-purple">{</span>
          <span class="text-nw-red">Admin</span>
          <span class="text-nw-purple">}</span>
        </h1>
        <p class="text-nw-text-dim text-sm mt-2">Sign in to manage your portfolio</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm text-nw-cyan font-sys mb-1">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-3 py-2 bg-void-warm text-nw-text border border-nw-text-line rounded focus:outline-none focus:ring-2 focus:ring-nw-cyan font-sys"
            placeholder="you@email.com"
          >
        </div>

        <div>
          <label for="password" class="block text-sm text-nw-cyan font-sys mb-1">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full px-3 py-2 bg-void-warm text-nw-text border border-nw-text-line rounded focus:outline-none focus:ring-2 focus:ring-nw-cyan font-sys"
            placeholder="••••••••"
          >
        </div>

        <p v-if="error" class="text-red-400 text-sm font-sys" role="alert">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full px-6 py-2 bg-void-raised text-void-warm font-sys font-bold rounded shadow hover:bg-nw-cyan transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <LucideLoader v-if="loading" class="w-4 h-4 animate-spin" />
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: ['admin-auth'],
})

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref<string | null>(null)

async function handleLogin() {
  loading.value = true
  error.value = null

  const success = await useAdminAuth().login(form.email, form.password)

  if (success) {
    await navigateTo('/admin')
  } else {
    error.value = 'Invalid credentials. Please try again.'
  }

  loading.value = false
}
</script>
