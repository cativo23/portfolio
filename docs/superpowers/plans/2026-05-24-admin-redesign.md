# Admin Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the blog section from the admin nav and restyle the entire admin UI (sidebar, dashboard, tables, login) to fully leverage the Nightwire design system.

**Architecture:** All changes are purely in Vue templates and Tailwind classes. No new components are created — existing pages are restyled in-place. The Nightwire panel/metric-cell/table patterns are applied consistently across all admin pages.

**Tech Stack:** Nuxt 3, Vue 3, Tailwind CSS, Nightwire design system (`.nightwire/nightwire.css` + `tailwind.preset.js`), Lucide icons (auto-imported)

---

### Task 1: Remove Blog from Admin Layout + Sidebar Redesign

**Files:**
- Modify: `src/layouts/admin.vue`

- [ ] **Step 1: Remove blog from navItems**

In `src/layouts/admin.vue`, replace the `navItems` ref so the blog entry is gone and the section label is added:

```ts
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
```

- [ ] **Step 2: Remove blog branches from currentPageTitle**

Replace the full `currentPageTitle` computed:

```ts
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
```

- [ ] **Step 3: Restyle the sidebar template**

Replace the entire `<aside>` block (lines 4–61) with:

```html
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
```

- [ ] **Step 4: Update getNavClass and getNavChildClass**

Replace both functions:

```ts
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
```

- [ ] **Step 5: Update top bar template**

Replace the `<header>` block:

```html
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
```

- [ ] **Step 6: Start dev server and verify sidebar**

```bash
yarn dev
```

Open http://localhost:3000/admin. Verify:
- Blog Posts is gone from the nav
- Active items have a left cyan border + nav dot glowing
- Logo uses `{Admin}` in stamp font with primary-dim bottom border
- User section shows avatar initial + logout button

- [ ] **Step 7: Commit**

```bash
git add src/layouts/admin.vue
git commit -m "🔥 feat(admin): remove blog nav + Nightwire sidebar redesign"
```

---

### Task 2: Dashboard Redesign

**Files:**
- Modify: `src/pages/admin/index.vue`

- [ ] **Step 1: Replace the template**

Replace the entire `<template>` block with:

```html
<template>
  <div class="flex flex-col gap-4">
    <div class="font-stamp text-[13px] tracking-[0.14em] uppercase text-nw-text">Dashboard</div>

    <!-- Metrics strip -->
    <div class="grid grid-cols-4 gap-px bg-nw-text-faint border border-nw-text-faint">
      <div class="bg-void-warm px-4 py-3">
        <div class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-primary mb-1">Projects</div>
        <div class="text-[24px] font-bold text-nw-green leading-none" style="text-shadow: 0 0 8px rgba(122,237,122,0.35);">{{ projectCount }}</div>
        <div class="font-stamp text-[8px] text-nw-text-dim mt-1">total</div>
      </div>
      <div class="bg-void-warm px-4 py-3">
        <div class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-primary mb-1">Unread</div>
        <div class="text-[24px] font-bold text-nw-yellow leading-none" style="text-shadow: 0 0 8px rgba(232,153,58,0.35);">{{ unreadContacts }}</div>
        <div class="font-stamp text-[8px] text-nw-text-dim mt-1">contacts</div>
      </div>
      <div class="bg-void-warm px-4 py-3">
        <div class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-primary mb-1">Users</div>
        <div class="text-[24px] font-bold text-nw-cyan leading-none" style="text-shadow: 0 0 8px rgba(102,221,255,0.3);">{{ userCount }}</div>
        <div class="font-stamp text-[8px] text-nw-text-dim mt-1">admins</div>
      </div>
      <div class="bg-void-warm px-4 py-3">
        <div class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-primary mb-2">System</div>
        <div class="flex items-center gap-2">
          <span class="led green blink" />
          <span class="font-stamp text-[11px] text-nw-green">NOMINAL</span>
        </div>
      </div>
    </div>

    <!-- Panel pair -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Recent Projects -->
      <div class="bg-void-warm border border-nw-text-faint">
        <div class="flex justify-between items-center px-3 py-[7px] border-b border-nw-primary-dim">
          <span class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-primary">Recent Projects</span>
          <span class="font-stamp text-[8px] text-nw-text-dim">CASE FILES</span>
        </div>
        <div>
          <NuxtLink
            v-for="project in recentProjects"
            :key="project.id"
            :to="`/admin/projects/${project.id}`"
            class="flex items-center justify-between px-3 py-[7px] border-b border-nw-text-faint last:border-b-0 hover:bg-nw-cyan/[0.04] transition-colors"
          >
            <span class="text-[11px] text-nw-text-dim">{{ project.title }}</span>
            <span class="font-stamp text-[8px] border px-1.5 py-px" :class="projectBadgeClass(project)">
              {{ project.status || (project.isFeatured ? 'FEATURED' : 'STD') }}
            </span>
          </NuxtLink>
          <div v-if="!recentProjects.length" class="px-3 py-4 text-[10px] text-nw-text-dim font-stamp">
            No projects yet
          </div>
        </div>
      </div>

      <!-- Recent Contacts -->
      <div class="bg-void-warm border border-nw-text-faint">
        <div class="flex justify-between items-center px-3 py-[7px] border-b border-nw-primary-dim">
          <span class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-primary">Contacts</span>
          <span class="font-stamp text-[8px] text-nw-text-dim">INBOX</span>
        </div>
        <div>
          <NuxtLink
            v-for="contact in recentContacts"
            :key="contact.id"
            to="/admin/contacts"
            class="flex items-center justify-between px-3 py-[7px] border-b border-nw-text-faint last:border-b-0 hover:bg-nw-cyan/[0.04] transition-colors"
          >
            <span class="text-[11px] text-nw-text-dim truncate max-w-[160px]">{{ contact.name }}</span>
            <span class="font-stamp text-[8px] border px-1.5 py-px" :class="contact.isRead ? 'text-[#555] border-[#333]' : 'text-nw-yellow border-nw-yellow/40 bg-nw-yellow/[0.06]'">
              {{ contact.isRead ? 'READ' : 'UNREAD' }}
            </span>
          </NuxtLink>
          <div v-if="!recentContacts.length" class="px-3 py-4 text-[10px] text-nw-text-dim font-stamp">
            No contacts yet
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Replace the script**

Replace the entire `<script setup lang="ts">` block with:

```ts
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

interface DashProject { id: number; title: string; isFeatured?: boolean; status?: string }
interface DashContact { id: number; name: string; isRead: boolean }

const projectCount = ref(0)
const unreadContacts = ref(0)
const userCount = ref(0)
const recentProjects = ref<DashProject[]>([])
const recentContacts = ref<DashContact[]>([])

function projectBadgeClass(p: DashProject) {
  const s = (p.status || '').toLowerCase()
  if (['live', 'completed', 'production'].includes(s))
    return 'text-nw-green border-nw-green-dim bg-nw-green-faint'
  if (['wip', 'active', 'in-progress'].includes(s))
    return 'text-nw-yellow border-nw-yellow/40 bg-nw-yellow/[0.06]'
  return 'text-nw-text-dim border-nw-text-line'
}

onMounted(async () => {
  try {
    const [projects, contacts, users] = await Promise.all([
      $fetch<Record<string, unknown>>('/api/projects').catch(() => ({ data: [] })),
      $fetch<Record<string, unknown>>('/api/admin/contacts').catch(() => ({ data: [] })),
      $fetch<Record<string, unknown>>('/api/admin/users').catch(() => ({ data: [] })),
    ])

    const projArray = (projects.data as DashProject[]) || []
    const contactArray = (contacts.data as DashContact[]) || []
    const userArray = (users.data as unknown[]) || []

    projectCount.value = projArray.length
    unreadContacts.value = contactArray.filter(c => !c.isRead).length
    userCount.value = userArray.length
    recentProjects.value = projArray.slice(0, 3)
    recentContacts.value = contactArray.slice(0, 3)
  } catch { /* ignore */ }
})
</script>
```

- [ ] **Step 3: Verify in browser**

With `yarn dev` running, open http://localhost:3000/admin. Verify:
- 4 metric cells render in a strip (Projects / Unread / Users / System)
- System cell shows green LED + NOMINAL
- Recent Projects and Contacts panels show data rows
- Numbers update after data loads (may be 0 if API requires auth)

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/index.vue
git commit -m "✨ feat(admin): dashboard metrics-strip + data panels"
```

---

### Task 3: Projects List — nw-table

**Files:**
- Modify: `src/pages/admin/projects/index.vue`

- [ ] **Step 1: Replace the template**

Replace the entire `<template>` block:

```html
<template>
  <div class="flex flex-col gap-4">
    <!-- Header row -->
    <div class="flex justify-between items-center">
      <span class="font-stamp text-[13px] tracking-[0.14em] uppercase text-nw-text">Projects</span>
      <NuxtLink
        to="/admin/projects/new"
        class="btn flex items-center gap-1.5 text-[11px]"
      >
        <LucidePlus class="w-3.5 h-3.5" />
        New Project
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-12 text-center font-stamp text-[10px] tracking-wider uppercase text-nw-text-dim">
      Loading…
    </div>

    <!-- Table -->
    <div v-else-if="projects.length" class="bg-void-warm border border-nw-text-faint">
      <div class="flex justify-between items-center px-3 py-[7px] border-b border-nw-primary-dim">
        <span class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-primary">All Projects</span>
        <span class="font-stamp text-[8px] text-nw-text-dim">{{ projects.length }} RECORDS</span>
      </div>
      <table class="w-full">
        <thead>
          <tr>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim">Title</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim hidden md:table-cell">Status</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim hidden lg:table-cell">Stack</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-right px-3 py-[6px] border-b border-nw-primary-dim">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="project in projects"
            :key="project.id"
            class="border-b border-nw-text-faint last:border-b-0 hover:bg-nw-cyan/[0.04] transition-colors"
          >
            <td class="px-3 py-[7px]">
              <p class="text-[11px] text-nw-text">{{ project.title }}</p>
              <p class="text-[10px] text-nw-text-dim truncate max-w-xs">{{ project.shortDescription || project.description }}</p>
            </td>
            <td class="px-3 py-[7px] hidden md:table-cell">
              <span
                class="font-stamp text-[8px] tracking-[0.1em] uppercase border px-1.5 py-px"
                :class="project.isFeatured ? 'text-nw-purple border-nw-purple/40 bg-nw-purple/[0.06]' : 'text-nw-text-dim border-nw-text-line'"
              >
                {{ project.isFeatured ? 'FEATURED' : 'STD' }}
              </span>
            </td>
            <td class="px-3 py-[7px] hidden lg:table-cell">
              <div class="flex flex-wrap gap-1">
                <span v-for="tech in (project.techStack || []).slice(0, 3)" :key="tech" class="font-stamp text-[8px] text-nw-cyan">
                  {{ tech }}
                </span>
                <span v-if="(project.techStack || []).length > 3" class="font-stamp text-[8px] text-nw-text-dim">
                  +{{ (project.techStack || []).length - 3 }}
                </span>
              </div>
            </td>
            <td class="px-3 py-[7px] text-right">
              <NuxtLink
                :to="`/admin/projects/${project.id}`"
                class="font-stamp text-[9px] tracking-[0.1em] uppercase text-nw-primary-dim hover:text-nw-primary transition-colors"
              >
                EDIT
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div v-else class="py-12 text-center font-stamp text-[10px] tracking-wider uppercase text-nw-text-dim">
      No projects found.
    </div>
  </div>
</template>
```

Keep the `<script setup>` block unchanged.

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000/admin/projects. Verify:
- Panel header shows "All Projects" + record count
- Table headers in nw-primary blue stamp font
- Row hover turns slightly cyan
- "New Project" button uses `btn` class (nw-primary fill)

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/projects/index.vue
git commit -m "✨ feat(admin): projects list nw-table pattern"
```

---

### Task 4: Contacts List — nw-table

**Files:**
- Modify: `src/pages/admin/contacts/index.vue`

- [ ] **Step 1: Replace the template**

Replace only the `<template>` block (keep `<script setup>` unchanged):

```html
<template>
  <div class="flex flex-col gap-4">
    <span class="font-stamp text-[13px] tracking-[0.14em] uppercase text-nw-text">Contacts</span>

    <!-- Loading -->
    <div v-if="loading" class="py-12 text-center font-stamp text-[10px] tracking-wider uppercase text-nw-text-dim">
      Loading…
    </div>

    <!-- Table -->
    <div v-else-if="contacts.length" class="bg-void-warm border border-nw-text-faint">
      <div class="flex justify-between items-center px-3 py-[7px] border-b border-nw-primary-dim">
        <span class="font-stamp text-[9px] tracking-[0.14em] uppercase text-nw-primary">All Contacts</span>
        <span class="font-stamp text-[8px] text-nw-text-dim">{{ contacts.length }} RECORDS</span>
      </div>
      <table class="w-full">
        <thead>
          <tr>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim">Name</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim hidden md:table-cell">Email</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim hidden lg:table-cell">Message</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-left px-3 py-[6px] border-b border-nw-primary-dim hidden md:table-cell">Date</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-center px-3 py-[6px] border-b border-nw-primary-dim">Status</th>
            <th class="font-stamp text-[8px] tracking-[0.14em] uppercase text-nw-primary text-right px-3 py-[6px] border-b border-nw-primary-dim">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="contact in contacts"
            :key="contact.id"
            class="border-b border-nw-text-faint last:border-b-0 hover:bg-nw-cyan/[0.04] transition-colors"
            :class="!contact.isRead ? 'bg-nw-primary/[0.03]' : ''"
          >
            <td class="px-3 py-[7px]">
              <span class="text-[11px] text-nw-text">{{ contact.name }}</span>
            </td>
            <td class="px-3 py-[7px] hidden md:table-cell">
              <a :href="`mailto:${contact.email}`" class="text-[10px] text-nw-primary hover:text-nw-primary-hot transition-colors">{{ contact.email }}</a>
            </td>
            <td class="px-3 py-[7px] hidden lg:table-cell">
              <span class="text-[10px] text-nw-text-dim line-clamp-1">{{ contact.message }}</span>
            </td>
            <td class="px-3 py-[7px] hidden md:table-cell">
              <span class="text-[10px] text-nw-text-dim">{{ formatDate(contact.createdAt) }}</span>
            </td>
            <td class="px-3 py-[7px] text-center">
              <span
                class="font-stamp text-[8px] tracking-[0.1em] uppercase border px-1.5 py-px"
                :class="contact.isRead ? 'text-[#555] border-[#333]' : 'text-nw-yellow border-nw-yellow/40 bg-nw-yellow/[0.06]'"
              >
                {{ contact.isRead ? 'READ' : 'UNREAD' }}
              </span>
            </td>
            <td class="px-3 py-[7px] text-right">
              <button @click="viewContact(contact)" class="font-stamp text-[9px] tracking-[0.1em] uppercase text-nw-primary-dim hover:text-nw-primary transition-colors mr-3">
                VIEW
              </button>
              <button @click="deleteContact(contact.id)" class="font-stamp text-[9px] tracking-[0.1em] uppercase text-nw-red/50 hover:text-nw-red transition-colors">
                DEL
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div v-else class="py-12 text-center font-stamp text-[10px] tracking-wider uppercase text-nw-text-dim">
      No contacts found.
    </div>

    <!-- Contact Detail Modal — keep unchanged -->
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
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000/admin/contacts. Verify:
- Unread rows have a subtle primary tint on the row background
- UNREAD badge is yellow, READ badge is dark/muted
- VIEW / DEL links in stamp uppercase

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/contacts/index.vue
git commit -m "✨ feat(admin): contacts list nw-table pattern"
```

---

### Task 5: Users List — nw-table

**Files:**
- Modify: `src/pages/admin/users/index.vue`

- [ ] **Step 1: Replace only the outer list table in the template**

Replace from the opening `<div>` through the empty state (keep the modals untouched). The new template wrapper and table:

```html
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

    <!-- Modals — keep unchanged from original -->
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
```

Keep the `<script setup>` block unchanged.

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000/admin/users. Verify:
- Role badge shows cyan `ADMIN` tag
- EDIT / DEL links in stamp uppercase
- Delete confirmation modal button now uses `btn-danger` (Nightwire red button)

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/users/index.vue
git commit -m "✨ feat(admin): users list nw-table pattern"
```

---

### Task 6: Admin Login Redesign + Password Eye Toggle

**Files:**
- Modify: `src/pages/admin/login.vue`

- [ ] **Step 1: Replace the template**

```html
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
```

- [ ] **Step 2: Add showPassword ref to script**

In `<script setup lang="ts">`, add after the existing refs:

```ts
const showPassword = ref(false)
```

The full script becomes:

```ts
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
```

- [ ] **Step 3: Verify in browser**

Open http://localhost:3000/admin/login. Verify:
- Full dark void background, centered panel
- Inputs have `nw-primary-dim` border (visible blue-ish tint), sharp corners
- Eye icon toggles password visibility on click
- Focus state shows `ring-1 nw-primary` ring

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/login.vue
git commit -m "✨ feat(admin): login Nightwire redesign + password eye toggle"
```

---

### Task 7: TypeScript Check + PR

- [ ] **Step 1: Run type check**

```bash
npx nuxi typecheck
```

Expected: no new type errors introduced by the changes.

- [ ] **Step 2: Open PR**

```bash
gh pr create \
  --base develop \
  --title "feat(admin): Nightwire redesign — remove blog, sidebar, dashboard, tables, login" \
  --body "$(cat <<'EOF'
## Summary
- Removes Blog Posts section from admin nav (pages never existed)
- Restyled sidebar with Nightwire panel patterns (left-border active indicator, nav dots, section label)
- Dashboard redesigned with 4-cell metrics strip + data panels (Recent Projects + Contacts)
- Projects / Contacts / Users lists now use nw-table pattern (blue headers, stamp badges, cyan hover)
- Login page redesigned with Nightwire inputs + password show/hide eye toggle

## Test plan
- [ ] Blog Posts is absent from admin sidebar
- [ ] Sidebar active items show cyan left-border + glowing dot
- [ ] Dashboard metrics-strip loads counts; System cell shows green LED
- [ ] Recent Projects and Contacts panels show up to 3 rows each
- [ ] Projects table shows blue headers, stamp badges, stamp EDIT link
- [ ] Contacts table UNREAD rows have yellow badge; READ rows muted
- [ ] Users table Role badge is cyan
- [ ] Login: inputs have visible nw-primary-dim border, sharp corners
- [ ] Login: eye icon toggles password visibility
- [ ] TypeScript check passes
EOF
)"
```
