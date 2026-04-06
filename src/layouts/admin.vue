<template>
  <div class="flex min-h-screen bg-tokyo-night-bg text-tokyo-night-text font-mono">
    <!-- Sidebar -->
    <aside class="w-64 bg-tokyo-night-dark border-r border-tokyo-night-gray/30 flex flex-col shrink-0">
      <!-- Logo -->
      <div class="p-4 border-b border-tokyo-night-gray/30">
        <NuxtLink to="/admin" class="text-lg font-bold">
          <span class="text-tokyo-night-purple">{</span>
          <span class="text-tokyo-night-red">Admin</span>
          <span class="text-tokyo-night-purple">}</span>
        </NuxtLink>
      </div>

      <!-- Nav -->
      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
          :class="isActiveRoute(item.path)
            ? 'bg-tokyo-night-highlight text-tokyo-night-cyan'
            : 'text-tokyo-night-muted hover:text-tokyo-night-text hover:bg-tokyo-night-highlight/50'"
        >
          <component :is="item.icon" class="w-4 h-4" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Logout -->
      <div class="p-4 border-t border-tokyo-night-gray/30">
        <button
          @click="logout"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-tokyo-night-red hover:bg-tokyo-night-red/10 w-full transition-colors"
        >
          <LucideLogOut class="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Bar -->
      <header class="h-14 border-b border-tokyo-night-gray/30 bg-tokyo-night-dark/50 px-6 flex items-center justify-between">
        <h1 class="text-sm text-tokyo-night-muted">
          <span class="text-tokyo-night-purple">❯</span>
          {{ currentPageTitle }}
        </h1>
        <span v-if="authUser" class="text-xs text-tokyo-night-muted">
          {{ authUser.email }}
        </span>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user: authUser, logout } = useAdminAuth()

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: 'LucideLayoutDashboard' },
  { path: '/admin/projects', label: 'Projects', icon: 'LucideFolderOpen' },
  { path: '/admin/blog', label: 'Blog Posts', icon: 'LucideFileText' },
  { path: '/admin/contacts', label: 'Contacts', icon: 'LucideMail' },
]

const route = useRoute()

function isActiveRoute(path: string): boolean {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

const currentPageTitle = computed(() => {
  const active = navItems.find(n => isActiveRoute(n.path))
  return active?.label || 'Admin'
})

onMounted(() => {
  useAdminAuth().loadFromCookie()
})
</script>
