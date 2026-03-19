# Reusable UI Components Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract repeated Tailwind patterns into reusable Vue 3 base components, then refactor existing components to use them.

**Architecture:** Create 4 new components in `src/components/base/` (Button, Card, Badge, SectionHeading), move Pagination from `ui/` to `base/`, then refactor all existing components and page templates to use the new base components. All components use `<script setup lang="ts">` with TypeScript interfaces.

**Tech Stack:** Vue 3 Composition API, Nuxt 3 auto-imports, Tailwind CSS, TypeScript

**Important constraint:** No Node/yarn on host. All commands run inside Docker. Build verification: `docker compose build && docker compose up -d`, then `curl http://localhost:3000`.

**Spec:** `docs/superpowers/specs/2026-03-17-ui-components-design.md`

---

## Chunk 1: Create Base Components

### Task 1: Create BaseButton

**Files:**
- Create: `src/components/base/Button.vue`

- [ ] **Step 1: Create the BaseButton component**

```vue
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
  external?: boolean
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  external: false,
  disabled: false,
  loading: false,
  type: 'button',
})

const tag = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})

const variantClasses: Record<string, string> = {
  primary: 'bg-tokyo-night-cyan text-tokyo-night-bg font-semibold hover:opacity-90 transition-opacity',
  secondary: 'border border-tokyo-night-cyan text-tokyo-night-cyan hover:bg-tokyo-night-cyan/10 transition-colors',
  ghost: 'text-tokyo-night-text hover:text-tokyo-night-cyan transition-colors',
  icon: 'border border-tokyo-night-gray text-tokyo-night-muted hover:text-tokyo-night-cyan transition-colors inline-flex items-center justify-center',
}

const sizeClasses = computed(() => {
  if (props.variant === 'icon') {
    return { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' }[props.size]
  }
  return { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2 text-base', lg: 'px-7 py-3 text-lg' }[props.size]
})

const classes = computed(() => [
  'inline-flex items-center justify-center rounded-lg cursor-pointer',
  variantClasses[props.variant],
  sizeClasses.value,
  (props.disabled || props.loading) && 'opacity-50 pointer-events-none',
])

const linkProps = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) {
    const attrs: Record<string, string> = { href: props.href }
    if (props.external) {
      attrs.target = '_blank'
      attrs.rel = 'noopener noreferrer'
    }
    return attrs
  }
  return { type: props.type, disabled: props.disabled || props.loading }
})
</script>

<template>
  <component :is="tag" :class="classes" v-bind="linkProps">
    <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <span class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    </span>
    <span :class="{ invisible: loading }">
      <slot />
    </span>
  </component>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/base/Button.vue
git commit -m "feat(ui): add BaseButton component with polymorphic rendering"
```

---

### Task 2: Create BaseCard

**Files:**
- Create: `src/components/base/Card.vue`

- [ ] **Step 1: Create the BaseCard component**

```vue
<script setup lang="ts">
import { useSlots } from 'vue'

interface Props {
  hoverable?: boolean
  padded?: boolean
}

withDefaults(defineProps<Props>(), {
  hoverable: true,
  padded: true,
})

const slots = useSlots()
</script>

<template>
  <div
    :class="[
      'relative bg-tokyo-night-dark rounded-lg transition-shadow duration-200',
      hoverable && 'hover:shadow-lg',
    ]"
  >
    <!-- Badge overlay -->
    <div v-if="slots.badge" class="absolute top-3 right-3 z-10">
      <slot name="badge" />
    </div>

    <!-- Header (edge-to-edge, no padding) -->
    <div v-if="slots.header">
      <slot name="header" />
    </div>

    <!-- Main content -->
    <div :class="padded && 'p-6'">
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="slots.footer" class="border-t border-tokyo-night-gray/20 pt-4 mt-4 px-6 pb-6">
      <slot name="footer" />
    </div>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/base/Card.vue
git commit -m "feat(ui): add BaseCard component with header/footer/badge slots"
```

---

### Task 3: Create BaseBadge

**Files:**
- Create: `src/components/base/Badge.vue`

- [ ] **Step 1: Create the BaseBadge component**

```vue
<script setup lang="ts">
interface Props {
  color?: 'cyan' | 'magenta' | 'green' | 'yellow' | 'muted'
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'cyan',
  size: 'md',
})

const colorClasses: Record<string, string> = {
  cyan: 'bg-tokyo-night-cyan/10 text-tokyo-night-cyan',
  magenta: 'bg-tokyo-night-magenta/10 text-tokyo-night-magenta',
  green: 'bg-tokyo-night-green/10 text-tokyo-night-green',
  yellow: 'bg-tokyo-night-yellow/10 text-tokyo-night-yellow',
  muted: 'bg-tokyo-night-gray/10 text-tokyo-night-muted',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}
</script>

<template>
  <span :class="['inline-block rounded-full font-mono', colorClasses[props.color], sizeClasses[props.size]]">
    <slot />
  </span>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/base/Badge.vue
git commit -m "feat(ui): add BaseBadge component with color variants"
```

---

### Task 4: Create BaseSectionHeading

**Files:**
- Create: `src/components/base/SectionHeading.vue`

- [ ] **Step 1: Create the BaseSectionHeading component**

```vue
<script setup lang="ts">
import { useSlots } from 'vue'

interface Props {
  title: string
  animated?: boolean
  level?: 2 | 3
  speed?: number
  maxIterations?: number
  revealDirection?: 'start' | 'center' | 'end'
}

withDefaults(defineProps<Props>(), {
  animated: false,
  level: 2,
  speed: 40,
  maxIterations: 10,
  revealDirection: 'start',
})

const slots = useSlots()
</script>

<template>
  <div class="mb-6">
    <component :is="'h' + level" :class="[
      'font-bold text-tokyo-night-cyan',
      level === 2 ? 'text-3xl' : 'text-2xl',
    ]">
      <DecryptedText
        v-if="animated"
        :text="title"
        animateOn="view"
        class="text-tokyo-night-cyan font-bold"
        encryptedClassName="text-opacity-60"
        :speed="speed"
        :maxIterations="maxIterations"
        :sequential="true"
        :revealDirection="revealDirection"
      />
      <template v-else>{{ title }}</template>
    </component>
    <p v-if="slots.subtitle" class="text-tokyo-night-muted mt-2">
      <slot name="subtitle" />
    </p>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/base/SectionHeading.vue
git commit -m "feat(ui): add BaseSectionHeading with optional DecryptedText animation"
```

---

### Task 5: Verify base components build

- [ ] **Step 1: Build and test dev image**

```bash
docker compose build
docker compose up -d
# Wait for dev server to start
sleep 20
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# Expected: 200
docker compose down
```

If build fails, check for TypeScript errors in the Docker output and fix.

---

## Chunk 2: Move Pagination & Refactor Existing Components

### Task 6: Move Pagination to base/

**Files:**
- Move: `src/components/ui/Pagination.vue` → `src/components/base/Pagination.vue`
- Modify: `src/pages/projects.vue` (update component reference from `<UiPagination>` to `<BasePagination>`)

- [ ] **Step 1: Move file and update with BaseButton**

Move `src/components/ui/Pagination.vue` to `src/components/base/Pagination.vue`.

In the moved file, replace the previous/next `<button>` elements with `<BaseButton variant="ghost">`. Keep the active page button as a plain `<button>` with its current `bg-tokyo-night-highlight text-black font-bold` styles. Replace inactive page `<button>` elements with `<BaseButton variant="ghost">`.

The updated template for previous button:
```vue
<BaseButton
  variant="ghost"
  @click="goToPage(pagination.page - 1)"
  :disabled="pagination.page === 1"
  aria-label="Previous page"
>
  <LucideChevronLeft class="w-5 h-5" />
</BaseButton>
```

Same pattern for next button (disabled when `pagination.page === pagination.totalPages`).

For inactive page number buttons:
```vue
<BaseButton
  variant="ghost"
  @click="goToPage(page as number)"
  :aria-label="`Go to page ${page}`"
>
  {{ page }}
</BaseButton>
```

Active page button stays as:
```vue
<button
  class="px-4 py-2 rounded-lg bg-tokyo-night-highlight text-black font-bold min-w-[2.5rem]"
  :aria-label="`Go to page ${page}`"
  aria-current="page"
>
  {{ page }}
</button>
```

- [ ] **Step 2: Update projects.vue reference**

In `src/pages/projects.vue`, change `<UiPagination>` to `<BasePagination>` (Nuxt auto-import handles the rest).

- [ ] **Step 3: Delete empty ui/ directory**

```bash
rm -rf src/components/ui/
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor(ui): move Pagination to base/ and use BaseButton internally"
```

---

### Task 7: Refactor PortfolioSection + FeatureProjectCard

**Files:**
- Modify: `src/components/home/portfolio/PortfolioSection.vue`
- Modify: `src/components/home/portfolio/FeatureProjectCard.vue`

- [ ] **Step 1: Refactor PortfolioSection.vue**

Replace lines 3-7 (the `<h3>` with `<DecryptedText>`) with:
```vue
<BaseSectionHeading title="Featured Projects" animated :level="3" />
```

Remove the `import FeatureProjectCard` line — Nuxt auto-imports handle it.

- [ ] **Step 2: Refactor FeatureProjectCard.vue**

Replace the entire template with:
```vue
<template>
  <BaseCard>
    <template v-if="project.isFeatured" #badge>
      <BaseBadge>Featured</BaseBadge>
    </template>
    <h4 class="mb-2 text-xl font-bold text-tokyo-night-highlight">{{ project.title }}</h4>
    <p class="mb-4">{{ project.description }}</p>
    <div class="flex flex-wrap gap-1 mb-4" v-if="project.techStack">
      <BaseBadge
        v-for="tech in (Array.isArray(project.techStack) ? project.techStack : [project.techStack])"
        :key="tech"
        color="magenta"
        size="sm"
      >
        {{ tech }}
      </BaseBadge>
    </div>
  </BaseCard>
</template>
```

Remove the `<style scoped>` block (now empty/unused). Remove the `techList` computed property and `LucideCode` usage — tech is now displayed as badges instead of a comma-separated string.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/portfolio/PortfolioSection.vue src/components/home/portfolio/FeatureProjectCard.vue
git commit -m "refactor(ui): use BaseSectionHeading, BaseCard, BaseBadge in portfolio components"
```

---

### Task 8: Refactor BlogSection + LatestBlogPostCard

**Files:**
- Modify: `src/components/home/blog/BlogSection.vue`
- Modify: `src/components/home/blog/LatestBlogPostCard.vue`

- [ ] **Step 1: Refactor BlogSection.vue**

Replace lines 3-7 (the `<h3>` with `<DecryptedText>`) with:
```vue
<BaseSectionHeading title="Latest Blog Posts" animated :level="3" />
```

Remove the `import LatestBlogPostCard` line — Nuxt auto-imports handle it.

- [ ] **Step 2: Refactor LatestBlogPostCard.vue**

Replace the entire template with:
```vue
<template>
  <BaseCard>
    <h4 class="text-xl font-bold mb-2 text-tokyo-night-highlight">{{ post.title }}</h4>
    <p class="mb-4">{{ post.excerpt }}</p>
    <template #footer>
      <div class="flex justify-between items-center">
        <span class="text-tokyo-night-yellow">{{ post.date }}</span>
        <BaseButton variant="ghost" size="sm" :to="(post as any).path">
          Read More
          <LucideArrowRight class="w-4 h-4 ml-2" />
        </BaseButton>
      </div>
    </template>
  </BaseCard>
</template>
```

Note: The home section's blog posts are hardcoded data without `path`. The `:to` prop will be `undefined` in that case, causing `<BaseButton>` to render as a plain `<button>`. When real blog data with paths is used, it will automatically render as `<NuxtLink>`.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/blog/BlogSection.vue src/components/home/blog/LatestBlogPostCard.vue
git commit -m "refactor(ui): use BaseSectionHeading, BaseCard, BaseButton in blog components"
```

---

### Task 9: Refactor Hero, Contact, Footer

**Files:**
- Modify: `src/components/home/Hero.vue`
- Modify: `src/components/home/Contact.vue`
- Modify: `src/components/main/Footer.vue`

- [ ] **Step 1: Refactor Hero.vue**

Replace lines 13-16 (the `<NuxtLink>` button) with:
```vue
<BaseButton to="/projects">View Projects</BaseButton>
```

The hero heading stays custom (unique DecryptedText config).

- [ ] **Step 2: Refactor Contact.vue**

Replace lines 3-6 (the `<h3>` with `<DecryptedText>`) with:
```vue
<BaseSectionHeading title="Contact me :)" animated :level="3" />
```

Replace lines 27-30 (the submit `<button>`) with:
```vue
<BaseButton type="submit" :loading="loading" :disabled="loading">
  Send message
</BaseButton>
```

- [ ] **Step 3: Refactor Footer.vue**

Replace each social `<a>` link with `<BaseButton variant="icon" ... external>`. The footer template becomes:
```vue
<template>
  <footer class="bg-tokyo-night-dark text-center p-4 mt-16">
    <p>&copy; {{ currentYear }} Carlos Cativo. All rights reserved.</p>
    <div class="flex justify-center space-x-4 mt-2">
      <BaseButton variant="icon" href="https://github.com/cativo23" external aria-label="GitHub">
        <LucideGithub />
      </BaseButton>
      <BaseButton variant="icon" href="https://linkedin.com/in/cativo23" external aria-label="LinkedIn">
        <LucideLinkedin />
      </BaseButton>
      <BaseButton variant="icon" href="https://x.com/cativo23" external aria-label="X (Twitter)">
        <XIcon />
      </BaseButton>
    </div>
  </footer>
</template>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/home/Hero.vue src/components/home/Contact.vue src/components/main/Footer.vue
git commit -m "refactor(ui): use BaseButton and BaseSectionHeading in Hero, Contact, Footer"
```

---

### Task 10: Refactor page templates

**Files:**
- Modify: `src/pages/projects.vue`
- Modify: `src/pages/blog/index.vue`
- Modify: `src/pages/about.vue`

- [ ] **Step 1: Refactor projects.vue**

Replace the `<h2>` heading (line 3) with:
```vue
<BaseSectionHeading title="My Projects" />
```

Replace the inline card div (lines 16-34) wrapping each project with `<BaseCard>`:
```vue
<BaseCard v-else v-for="project in displayed" :key="project.id || project.title">
  <h3 class="mb-4 text-2xl font-bold">{{ project.title }}</h3>
  <p class="mb-4">{{ project.description }}</p>
  <div class="flex items-center mb-4 text-tokyo-night-cyan">
    <LucideCode class="w-5 h-5 mr-2" />
    <span>{{ techList(project) }}</span>
  </div>
  <div class="justify-start card-actions">
    <BaseButton variant="ghost" :href="project.repoUrl" external>
      <LucideGithub class="w-5 h-5 mr-2" />View on GitHub
    </BaseButton>
    <BaseButton v-if="project.liveUrl" variant="ghost" :href="project.liveUrl" external>
      <LucideExternalLink class="w-5 h-5 mr-2" />Live Demo
    </BaseButton>
  </div>
</BaseCard>
```

- [ ] **Step 2: Refactor blog/index.vue**

Replace the `<h2>` heading (line 3) with:
```vue
<BaseSectionHeading title="Blog Posts" />
```

Replace each `<article>` (lines 5-16) with:
```vue
<BaseCard v-for="post in posts" :key="post.path">
  <h3 class="mb-2 text-2xl font-bold">{{ post.title }}</h3>
  <p class="mb-4">{{ post.description }}</p>
  <template #footer>
    <div class="flex justify-between items-center">
      <span class="text-tokyo-night-purple">{{ formatDate(post.created_at) }}</span>
      <BaseButton variant="ghost" :to="post.path ?? '/404'" size="sm">
        Read More
        <LucideArrowRight class="w-4 h-4 ml-2" />
      </BaseButton>
    </div>
  </template>
</BaseCard>
```

- [ ] **Step 3: Refactor about.vue**

Replace the `<h2>` heading (line 3) with:
```vue
<BaseSectionHeading title="About Me" />
```

Replace the outer `<div class="bg-tokyo-night-dark p-6 rounded-lg">` (line 4) with:
```vue
<BaseCard :hoverable="false">
```

Close the `</BaseCard>` where the `</div>` was (line 42).

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects.vue src/pages/blog/index.vue src/pages/about.vue
git commit -m "refactor(ui): use base components in page templates"
```

---

### Task 11: Final verification

- [ ] **Step 1: Build and test dev image**

```bash
docker compose build
docker compose up -d
sleep 20
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# Expected: 200
docker compose down
```

- [ ] **Step 2: Visually verify key pages**

Start the dev server and manually check in a browser:
- Homepage: Hero button, PortfolioSection heading + cards, BlogSection heading + cards, Contact form + heading, Footer social icons
- `/projects`: Page heading, project cards with GitHub/Live Demo buttons, pagination
- `/blog`: Page heading, blog post cards with Read More links
- `/about`: Page heading, about card

Verify no visual regressions except:
- Deliberate "Featured" badge color change (cyan instead of highlight blue)
- Pagination inactive buttons lose `bg-tokyo-night-dark` background (ghost variant has no background)
- Contact submit button shows spinner instead of "Sending..." text when loading

- [ ] **Step 3: Commit any fixes if needed**
