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

## Color Token Reference

From `tailwind.config.js`, the `tokyo.night.*` tokens expand to `bg-tokyo-night-*` / `text-tokyo-night-*`:

| Token | Hex | Tailwind class prefix |
|-------|-----|-----------------------|
| `bg` | `#1a1b26` | `bg-tokyo-night-bg`, `text-tokyo-night-bg` |
| `dark` | `#16161e` | `bg-tokyo-night-dark` |
| `text` | `#a9b1d6` | `text-tokyo-night-text` |
| `cyan` | `#7dcfff` | `text-tokyo-night-cyan` |
| `magenta` | `#bb9af7` | `text-tokyo-night-magenta` |
| `green` | `#9ece6a` | `text-tokyo-night-green` |
| `yellow` | `#e0af68` | `text-tokyo-night-yellow` |
| `muted` | `#565f89` | `text-tokyo-night-muted` |
| `gray` | `#565f89` | `border-tokyo-night-gray` |
| `highlight` | `#7aa2f7` | `bg-tokyo-night-highlight` |

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
| `external` | `boolean` | `false` | When true (with `href`), adds `target="_blank" rel="noopener noreferrer"` |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state (disables + shows animated spinner) |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type (only when rendering as `<button>`) |

**Slots:** `#default` — button content (text, icons, etc.)

**Rendering logic:**
- `to` prop present → `<NuxtLink :to="to">`
- `href` prop present → `<a :href="href">` (with `target="_blank" rel="noopener noreferrer"` when `external` is true)
- Otherwise → `<button :type="type">`

**Loading behavior:** When `loading` is true:
- Button is visually disabled (`opacity-50 pointer-events-none`)
- Default slot content is hidden (`invisible` but still occupies space to prevent layout shift)
- A CSS-only spinner is shown centered over the button (Tailwind `animate-spin` on a `border` circle, 16px, using the button's current text color)

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
| `padded` | `boolean` | `true` | Adds `p-6` padding to default slot only |

**Slots:**

| Slot | Description |
|------|-------------|
| `#default` | Main content (receives `p-6` when `padded`) |
| `#header` | Optional top area — always edge-to-edge, no padding applied |
| `#footer` | Optional bottom area (actions, links) |
| `#badge` | Positioned top-right overlay |

**Base styles:** `relative bg-tokyo-night-dark rounded-lg transition-shadow duration-200`
- Root element includes `relative` for badge absolute positioning
- When `hoverable`: adds `hover:shadow-lg`
- When `padded`: the default slot wrapper gets `p-6` (header and footer are not affected)
- Header slot: renders above default content, no padding (for edge-to-edge images)
- Badge slot: `absolute top-3 right-3 z-10`
- Footer: separated by `border-t border-tokyo-night-gray/20 pt-4 mt-4` inside `px-6 pb-6`

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

**Note:** The existing "Featured" badge in `FeatureProjectCard` uses `bg-tokyo-night-highlight text-black`. Refactoring to `<BaseBadge color="cyan">` is a deliberate design change to unify badge colors — cyan (`#7dcfff`) with transparent background instead of highlight blue (`#7aa2f7`) with solid background.

### 4. BaseSectionHeading (`src/components/base/SectionHeading.vue`)

Section title with optional DecryptedText animation.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Heading text (required) |
| `animated` | `boolean` | `false` | Wraps title in `<DecryptedText>` |
| `level` | `2 \| 3` | `2` | Renders `<h2>` or `<h3>` |
| `speed` | `number` | `40` | DecryptedText animation speed (only used when `animated`) |
| `maxIterations` | `number` | `10` | DecryptedText max iterations (only used when `animated`) |
| `revealDirection` | `'start' \| 'center' \| 'end'` | `'start'` | DecryptedText reveal direction (only used when `animated`) |

**Slots:** `#subtitle` — optional text below heading

**Styles:**
- Heading: `text-tokyo-night-cyan font-bold mb-6` with size based on level (h2: `text-3xl`, h3: `text-2xl`)
- Subtitle: `text-tokyo-night-muted mt-2`

**Implementation:** Uses dynamic `<component :is="'h' + level">` to render the correct heading element. When `animated`, the title text is passed to `<DecryptedText>` with `animateOn="view"`, `encryptedClassName="text-opacity-60"`, `:sequential="true"`, and the `speed`, `maxIterations`, `revealDirection` props.

**DecryptedText prop defaults by current usage:**
- `PortfolioSection`, `BlogSection`, `Contact`: speed=40, maxIterations=10, revealDirection="start" (matches defaults)
- `Hero`: speed=30, maxIterations=20, revealDirection="center" (would need explicit overrides)

### 5. BasePagination (`src/components/base/Pagination.vue`)

Moved from `src/components/ui/Pagination.vue`.

**Changes from current implementation:**
- Previous/next buttons → `<BaseButton variant="ghost">`
- Active page button: keeps its current distinct style (`bg-tokyo-night-highlight text-black`) — this is NOT converted to a `BaseButton` variant because it represents a state indicator, not an interactive button style. It remains a plain `<button>` with direct Tailwind classes.
- Inactive page buttons → `<BaseButton variant="ghost">`
- Delete the empty `src/components/ui/` directory after moving

## Refactoring Map

| Existing Component | Changes |
|--------------------|---------|
| `Hero.vue` | "View Projects" link → `<BaseButton to="/projects">`. The hero heading stays custom (it's a page title with unique DecryptedText config speed=30 maxIterations=20 revealDirection="center", not a section heading). |
| `PortfolioSection.vue` | Heading → `<BaseSectionHeading title="Featured Projects" animated>`, "View All" → `<BaseButton>` |
| `BlogSection.vue` | Heading → `<BaseSectionHeading title="Latest Blog Posts" animated>`, "View All" → `<BaseButton>` |
| `Contact.vue` | Heading → `<BaseSectionHeading title="Contact me :)" animated>`, submit → `<BaseButton type="submit" :loading="...">` |
| `FeatureProjectCard.vue` | Wrap in `<BaseCard>`, "Featured" badge → `<BaseBadge>` (color change to cyan, see note in BaseBadge section), tech tags → `<BaseBadge color="magenta" size="sm">` |
| `LatestBlogPostCard.vue` | Wrap in `<BaseCard>`, "Read More" link → `<BaseButton variant="ghost" :to="post.path">` (the post path comes from the parent via props) |
| `Footer.vue` | Social icon links → `<BaseButton variant="icon" :href="url" external>` |
| `Pagination.vue` | Move to `base/`, update nav buttons to use `<BaseButton variant="ghost">` (active page stays custom) |
| Page templates (`projects.vue`, `blog/index.vue`, `about.vue`) | Replace inline card styling with `<BaseCard>`, badges with `<BaseBadge>` |

## Constraints

- All components use `<script setup lang="ts">` with TypeScript interfaces for props
- Follow existing Tokyo Night color tokens already defined in Tailwind config
- No new dependencies — pure Vue 3 + Tailwind
- Nuxt auto-import handles component registration (no manual imports)
- `SkillPill.vue` stays as-is (specialized level-indicator logic)
