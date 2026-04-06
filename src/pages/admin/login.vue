<template>
  <div class="flex items-center justify-center min-h-screen bg-tokyo-night-bg">
    <div class="w-full max-w-md p-8 bg-tokyo-night-dark border border-tokyo-night-gray/30 rounded-lg">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold font-mono">
          <span class="text-tokyo-night-purple">{</span>
          <span class="text-tokyo-night-red">Admin</span>
          <span class="text-tokyo-night-purple">}</span>
        </h1>
        <p class="text-tokyo-night-muted text-sm mt-2">Sign in to manage your portfolio</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono"
            placeholder="you@email.com"
          >
        </div>

        <div>
          <label for="password" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono"
            placeholder="••••••••"
          >
        </div>

        <p v-if="error" class="text-red-400 text-sm font-mono" role="alert">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full px-6 py-2 bg-tokyo-night-highlight text-tokyo-night-dark font-mono font-bold rounded shadow hover:bg-tokyo-night-cyan transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
