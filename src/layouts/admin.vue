<template>
  <div class="flex min-h-screen bg-tokyo-night-bg text-tokyo-night-text font-mono">
    <!-- Sidebar -->
    <aside class="w-60 bg-tokyo-night-dark border-r border-tokyo-night-gray/20 flex flex-col shrink-0 transition-all duration-300">
      <!-- Logo -->
      <div class="h-12 flex items-center px-4 border-b border-tokyo-night-gray/20">
        <NuxtLink to="/admin" class="text-base font-bold font-mono">
          <span class="text-tokyo-night-purple">{</span>
          <span class="text-tokyo-night-red">Admin</span>
          <span class="text-tokyo-night-purple">}</span>
        </NuxtLink>
      </div>

      <!-- Nav -->
      <nav class="flex-1 py-2 overflow-y-auto">
        <!-- Main nav items -->
        <template v-for="item in navItems" :key="item.path">
          <NuxtLink
            :to="item.path"
            class="flex items-center gap-3 mx-2 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer"
            :class="getNavClass(item.path)"
          >
            <component :is="item.icon" class="w-4 h-4 shrink-0" />
            <span>{{ item.label }}</span>
          </NuxtLink>

          <!-- Sub-items for projects -->
          <div v-if="item.children" class="ml-6 mt-0.5 space-y-0.5">
            <NuxtLink
              v-for="child in item.children"
              :key="child.path"
              :to="child.path"
              class="flex items-center gap-2 mx-2 px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer"
              :class="getNavChildClass(child.path)"
            >
              <component :is="child.icon" class="w-3.5 h-3.5 shrink-0" />
              {{ child.label }}
            </NuxtLink>
          </div>
        </template>
      </nav>

      <!-- User section -->
      <div class="p-3 border-t border-tokyo-night-gray/20">
        <div class="flex items-center gap-2 mb-2 px-2">
          <div class="w-7 h-7 rounded-full bg-tokyo-night-highlight flex items-center justify-center text-xs font-bold text-tokyo-night-cyan">
            {{ userInitial }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs text-tokyo-night-text truncate">{{ authUser?.email || 'Admin' }}</p>
          </div>
        </div>
        <button
          @click="logout"
          class="flex items-center gap-2 w-full px-3 py-1.5 rounded-md text-xs text-tokyo-night-red/80 hover:bg-tokyo-night-red/10 hover:text-tokyo-night-red transition-colors"
        >
          <LucideLogOut class="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Bar -->
      <header class="h-12 border-b border-tokyo-night-gray/20 bg-tokyo-night-dark/50 px-5 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2">
          <LucideChevronRight class="w-3.5 h-3.5 text-tokyo-night-gray" />
          <span class="text-sm text-tokyo-night-muted font-mono">{{ currentPageTitle }}</span>
        </div>
        <NuxtLink to="/" target="_blank" class="text-xs text-tokyo-night-muted hover:text-tokyo-night-cyan transition-colors flex items-center gap-1">
          <LucideExternalLink class="w-3 h-3" />
          View site
        </NuxtLink>
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

const navItems = ref([
  { path: '/admin', label: 'Dashboard', icon: 'LucideLayoutDashboard' },
  {
    path: '/admin/projects',
    label: 'Projects',
    icon: 'LucideFolderOpen',
    children: [
      { path: '/admin/projects', label: 'All Projects', icon: 'LucideList' },
      { path: '/admin/projects/new', label: 'New Project', icon: 'LucidePlus' },
    ],
  },
  {
    path: '/admin/blog',
    label: 'Blog Posts',
    icon: 'LucideFileText',
    children: [
      { path: '/admin/blog', label: 'All Posts', icon: 'LucideList' },
      { path: '/admin/blog/new', label: 'New Post', icon: 'LucidePlus' },
    ],
  },
  {
    path: '/admin/users',
    label: 'Users',
    icon: 'LucideUsers',
    children: [
      { path: '/admin/users', label: 'All Users', icon: 'LucideList' },
    ],
  },
  {
    path: '/admin/contacts',
    label: 'Contacts',
    icon: 'LucideMail',
    children: [
      { path: '/admin/contacts', label: 'All Contacts', icon: 'LucideList' },
    ],
  },
])

const route = useRoute()

function isActiveRoute(path: string): boolean {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

function isExactRoute(path: string): boolean {
  return route.path === path
}

function getNavClass(path: string): string {
  if (path === '/admin') {
    return isExactRoute(path)
      ? 'bg-tokyo-night-cyan/10 text-tokyo-night-cyan font-medium'
      : 'text-tokyo-night-muted hover:text-tokyo-night-text hover:bg-tokyo-night-highlight/30'
  }
  // Parent items: active if route starts with path
  return isActiveRoute(path)
    ? 'bg-tokyo-night-cyan/10 text-tokyo-night-cyan font-medium'
    : 'text-tokyo-night-muted hover:text-tokyo-night-text hover:bg-tokyo-night-highlight/30'
}

function getNavChildClass(path: string): string {
  // Child items: active only on exact match
  return isExactRoute(path)
    ? 'bg-tokyo-night-cyan/10 text-tokyo-night-cyan font-medium'
    : 'text-tokyo-night-muted hover:text-tokyo-night-text hover:bg-tokyo-night-highlight/30'
}

const currentPageTitle = computed(() => {
  const path = route.path
  if (path === '/admin' || path === '/admin/') return 'Dashboard'
  if (path.startsWith('/admin/projects/new')) return 'Projects / New Project'
  if (path.startsWith('/admin/projects/')) return 'Projects / Edit Project'
  if (path === '/admin/projects') return 'Projects'
  if (path.startsWith('/admin/blog/new')) return 'Blog / New Post'
  if (path.startsWith('/admin/blog/')) return 'Blog / Edit Post'
  if (path === '/admin/blog') return 'Blog Posts'
  if (path === '/admin/users') return 'Users'
  if (path === '/admin/contacts') return 'Contacts'
  return 'Admin'
})

const userInitial = computed(() => {
  if (!authUser.value) return 'A'
  return authUser.value.email?.[0]?.toUpperCase() || 'A'
})

onMounted(async () => {
  try {
    const data = await $fetch('/api/admin/me')
    const { user } = useAdminAuth()
    ;(user as any).value = data
  } catch { /* already handled by interceptor */ }
})
</script>
