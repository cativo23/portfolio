<template>
  <div class="flex min-h-screen bg-void-warm text-nw-text font-sys">
    <!-- Sidebar -->
    <aside class="w-60 bg-void-warm border-r border-nw-text-line flex flex-col shrink-0">
      <!-- Logo -->
      <div class="h-10 flex items-center px-4 border-b border-nw-primary-dim shrink-0">
        <NuxtLink to="/admin" class="font-stamp text-[15px] tracking-[0.12em]">
          <span class="text-nw-primary">{</span>
          <span class="text-nw-red">Admin</span>
          <span class="text-nw-primary">}</span>
        </NuxtLink>
      </div>

      <!-- Nav -->
      <nav class="flex-1 py-2 overflow-y-auto">
        <div class="font-stamp text-[8px] tracking-[0.18em] uppercase text-nw-primary-dim px-4 pt-3 pb-1">
          Navigation
        </div>

        <template v-for="item in navItems" :key="item.path">
          <NuxtLink
            :to="item.path"
            class="flex items-center gap-2.5 pl-4 pr-3 py-[6px] text-[11px] border-l-2 transition-colors cursor-pointer"
            :class="getNavClass(item.path)"
          >
            <span class="w-[5px] h-[5px] rounded-full shrink-0 transition-all" :class="isActiveRoute(item.path) ? 'bg-nw-cyan shadow-[0_0_5px_theme(colors.nw.cyan.DEFAULT)]' : 'bg-nw-text-dim'" />
            <span>{{ item.label }}</span>
          </NuxtLink>

          <div v-if="item.children" class="ml-4 mt-0.5">
            <NuxtLink
              v-for="child in item.children"
              :key="child.path"
              :to="child.path"
              class="flex items-center gap-2 pl-7 pr-3 py-[5px] text-[10px] border-l-2 transition-colors cursor-pointer"
              :class="getNavChildClass(child.path)"
            >
              <span class="w-[3px] h-[3px] rounded-full shrink-0" :class="isExactRoute(child.path) ? 'bg-nw-cyan' : 'bg-nw-text-dim/50'" />
              {{ child.label }}
            </NuxtLink>
          </div>
        </template>
      </nav>

      <!-- User section -->
      <div class="p-3 border-t border-nw-text-line shrink-0">
        <div class="flex items-center gap-2 mb-2 px-1">
          <div class="w-6 h-6 rounded-full bg-void-raised border border-nw-primary-dim flex items-center justify-center text-[10px] font-bold text-nw-cyan shrink-0">
            {{ userInitial }}
          </div>
          <p class="text-[9px] text-nw-text-dim truncate">{{ authUser?.email || 'Admin' }}</p>
        </div>
        <button
          @click="logout"
          class="flex items-center gap-2 w-full px-2 py-1 text-[10px] font-stamp tracking-[0.1em] uppercase text-nw-red/70 hover:text-nw-red hover:bg-nw-red/[0.06] transition-colors"
        >
          <LucideLogOut class="w-3 h-3" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Bar -->
      <header class="h-10 border-b border-nw-text-line bg-void-warm px-5 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2">
          <span class="text-nw-text-line text-[10px]">›</span>
          <span class="font-stamp text-[11px] tracking-[0.1em] uppercase text-nw-text-dim">{{ currentPageTitle }}</span>
        </div>
        <NuxtLink to="/" target="_blank" class="font-stamp text-[9px] tracking-[0.12em] uppercase text-nw-primary-dim hover:text-nw-primary transition-colors flex items-center gap-1">
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
      ? 'border-l-nw-cyan bg-nw-cyan/[0.06] text-nw-cyan'
      : 'border-l-transparent text-nw-text-dim hover:text-nw-text hover:bg-void-raised/20'
  }
  return isActiveRoute(path)
    ? 'border-l-nw-cyan bg-nw-cyan/[0.06] text-nw-cyan'
    : 'border-l-transparent text-nw-text-dim hover:text-nw-text hover:bg-void-raised/20'
}

function getNavChildClass(path: string): string {
  return isExactRoute(path)
    ? 'border-l-nw-cyan bg-nw-cyan/[0.04] text-nw-cyan'
    : 'border-l-transparent text-nw-text-dim hover:text-nw-text hover:bg-void-raised/10'
}

const currentPageTitle = computed(() => {
  const path = route.path
  if (path === '/admin' || path === '/admin/') return 'Dashboard'
  if (path.startsWith('/admin/projects/new')) return 'Projects / New Project'
  if (path.startsWith('/admin/projects/')) return 'Projects / Edit Project'
  if (path === '/admin/projects') return 'Projects'
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
