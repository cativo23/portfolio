# Design: Reusable UI Components (#35)

## Goal

Extract repeated Tailwind CSS patterns into reusable Vue 3 components in `src/components/base/`, reducing duplication across the portfolio site and providing a consistent design system foundation.

## Scope

**In scope:** BaseButton, BaseCard, BaseBadge, BaseSectionHeading, move Pagination to `base/`, refactor existing components to use them.

**Out of scope:** Form input components (#29), toast component (#28), SkillPill (has specialized logic).

## Tech Stack

- Vue 3 Composition API with `<script setup lang="ts">`
- Nuxt 3 auto-imports (directory-based naming: `base/Button.vue` → `<BaseButton>`)
- Tailwind CSS with Tokyo Night color palette
- TypeScript interfaces for all props

## Components

### 1. BaseButton (`src/components/base/Button.vue`)

Polymorphic button that renders as `<button>`, `<NuxtLink>`, or `<a>` depending on props.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'icon'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size preset |
| `to` | `string` | — | If set, renders as `<NuxtLink>` |
| `href` | `string` | — | If set, renders as `<a>` |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state (disables + shows spinner) |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type (only when rendering as `<button>`) |

**Slots:** `#default` — button content (text, icons, etc.)

**Rendering logic:**
- `to` prop present → `<NuxtLink :to="to">`
- `href` prop present → `<a :href="href">`
- Otherwise → `<button :type="type">`

**Variant styles (Tailwind):**
- `primary`: `bg-tokyo-night-cyan text-tokyo-night-bg font-semibold rounded-lg hover:opacity-90 transition-opacity`
- `secondary`: `border border-tokyo-night-cyan text-tokyo-night-cyan rounded-lg hover:bg-tokyo-night-cyan/10 transition-colors`
- `ghost`: `text-tokyo-night-text hover:text-tokyo-night-cyan rounded-lg transition-colors`
- `icon`: `border border-tokyo-night-gray text-tokyo-night-muted hover:text-tokyo-night-cyan rounded-lg transition-colors inline-flex items-center justify-center`

**Size styles:**
- `sm`: `px-3 py-1.5 text-sm` (icon: `w-8 h-8`)
- `md`: `px-5 py-2 text-base` (icon: `w-10 h-10`)
- `lg`: `px-7 py-3 text-lg` (icon: `w-12 h-12`)

### 2. BaseCard (`src/components/base/Card.vue`)

Content container with Tokyo Night dark styling.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hoverable` | `boolean` | `true` | Adds hover shadow effect |
| `padded` | `boolean` | `true` | Adds `p-6` padding |

**Slots:**

| Slot | Description |
|------|-------------|
| `#default` | Main content |
| `#header` | Optional top area (images, title bars) |
| `#footer` | Optional bottom area (actions, links) |
| `#badge` | Positioned top-right overlay |

**Base styles:** `bg-tokyo-night-dark rounded-lg transition-shadow duration-200`
- When `hoverable`: adds `hover:shadow-lg`
- When `padded`: main content area gets `p-6`
- Badge slot: `absolute top-3 right-3`
- Footer: separated by `border-t border-tokyo-night-gray/20 pt-4 mt-4`

### 3. BaseBadge (`src/components/base/Badge.vue`)

Inline label for tags, statuses, and categories.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `'cyan' \| 'magenta' \| 'green' \| 'yellow' \| 'muted'` | `'cyan'` | Color variant |
| `size` | `'sm' \| 'md'` | `'md'` | Size |

**Slots:** `#default` — badge text

**Color mapping (bg/text Tailwind classes):**
- `cyan`: `bg-tokyo-night-cyan/10 text-tokyo-night-cyan`
- `magenta`: `bg-tokyo-night-magenta/10 text-tokyo-night-magenta`
- `green`: `bg-tokyo-night-green/10 text-tokyo-night-green`
- `yellow`: `bg-tokyo-night-yellow/10 text-tokyo-night-yellow`
- `muted`: `bg-tokyo-night-gray/10 text-tokyo-night-muted`

**Base styles:** `inline-block rounded-full font-mono`
- `sm`: `px-2 py-0.5 text-xs`
- `md`: `px-3 py-1 text-sm`

### 4. BaseSectionHeading (`src/components/base/SectionHeading.vue`)

Section title with optional DecryptedText animation.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Heading text (required) |
| `animated` | `boolean` | `false` | Wraps title in `<DecryptedText>` |
| `level` | `2 \| 3` | `2` | Renders `<h2>` or `<h3>` |

**Slots:** `#subtitle` — optional text below heading

**Styles:**
- Heading: `text-tokyo-night-cyan font-bold` with size based on level (h2: `text-3xl`, h3: `text-2xl`)
- Subtitle: `text-tokyo-night-muted mt-2`

**Implementation:** Uses dynamic `<component :is="'h' + level">` to render the correct heading element.

### 5. BasePagination (`src/components/base/Pagination.vue`)

Moved from `src/components/ui/Pagination.vue`. Internal buttons refactored to use `<BaseButton variant="ghost">`.

## Refactoring Map

| Existing Component | Changes |
|--------------------|---------|
| `Hero.vue` | Section heading → `<BaseSectionHeading>`, "View Projects" → `<BaseButton to="/projects">` |
| `PortfolioSection.vue` | Heading → `<BaseSectionHeading animated>`, "View All" → `<BaseButton>` |
| `BlogSection.vue` | Heading → `<BaseSectionHeading animated>`, "View All" → `<BaseButton>` |
| `FeatureProjectCard.vue` | Wrap in `<BaseCard>`, "Featured" badge → `<BaseBadge>`, tech tags → `<BaseBadge color="magenta">` |
| `LatestBlogPostCard.vue` | Wrap in `<BaseCard>`, "Read More" → `<BaseButton variant="ghost">` |
| `Contact.vue` | Submit → `<BaseButton type="submit" :loading="...">` |
| `Footer.vue` | Social icons → `<BaseButton variant="icon" href="...">` |
| `Pagination.vue` | Move to `base/`, use `<BaseButton variant="ghost">` internally |
| Page templates | Replace inline card/badge patterns with `<BaseCard>`, `<BaseBadge>` |

## Constraints

- All components use `<script setup lang="ts">` with TypeScript interfaces for props
- Follow existing Tokyo Night color tokens already defined in Tailwind config
- No new dependencies — pure Vue 3 + Tailwind
- Nuxt auto-import handles component registration (no manual imports)
- `SkillPill.vue` stays as-is (specialized level-indicator logic)
