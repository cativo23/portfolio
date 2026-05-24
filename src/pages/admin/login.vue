<template>
  <div class="flex items-center justify-center min-h-screen bg-void">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="border border-nw-primary-dim mb-0">
        <div class="px-5 py-4 border-b border-nw-primary-dim text-center">
          <div class="font-stamp text-[18px] tracking-[0.12em]">
            <span class="text-nw-primary">{</span>
            <span class="text-nw-red">Admin</span>
            <span class="text-nw-primary">}</span>
          </div>
          <p class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-text-dim mt-1">Sign in to manage your portfolio</p>
        </div>

        <form @submit.prevent="handleLogin" class="p-5 flex flex-col gap-4">
          <!-- Email -->
          <div class="flex flex-col gap-1">
            <label for="email" class="font-stamp text-[9px] tracking-[0.16em] uppercase text-nw-primary">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              placeholder="you@email.com"
              class="w-full px-3 py-2 bg-void-warm text-nw-text border border-nw-primary-dim rounded-none font-sys text-sm focus:outline-none focus:ring-1 focus:ring-nw-primary focus:border-nw-primary transition-colors"
            >
          </div>

          <!-- Password + eye toggle -->
          <div class="flex flex-col gap-1">
            <label for="password" class="font-stamp text-[9px] tracking-[0.16em] uppercase text-nw-primary">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="••••••••"
                class="w-full px-3 py-2 pr-10 bg-void-warm text-nw-text border border-nw-primary-dim rounded-none font-sys text-sm focus:outline-none focus:ring-1 focus:ring-nw-primary focus:border-nw-primary transition-colors"
              >
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-0 top-0 h-full px-3 text-nw-text-dim hover:text-nw-primary transition-colors"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <LucideEye v-if="!showPassword" class="w-4 h-4" />
                <LucideEyeOff v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <p v-if="error" class="font-stamp text-[9px] tracking-[0.1em] uppercase text-nw-red" role="alert">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="btn w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LucideLoader v-if="loading" class="w-4 h-4 animate-spin" />
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
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
const showPassword = ref(false)

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
