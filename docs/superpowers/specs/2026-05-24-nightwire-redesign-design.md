# Nightwire Redesign — Design Spec

**Date:** 2026-05-24
**Status:** Approved
**Approach:** Two PRs — Admin first, Homepage second

---

## Context

The portfolio uses the Nightwire design system (dark cyberpunk, Evangelion-inspired). Two problems:

1. The admin sidebar contains a Blog Posts section that points to non-existent pages (`/admin/blog/*`). The blog lives externally at `blog.cativo.dev` (Ghost CMS) and should not be managed from this admin.
2. Both the admin and homepage underutilize Nightwire's component patterns — the admin uses generic layout, and the homepage has inconsistencies in token usage (border colors, focus states, label hierarchy).

---

## PR 1 — Admin Redesign

**Branch:** `feature/admin-redesign`

### 1.1 Blog Section Removal

**File:** `src/layouts/admin.vue`

- Remove the Blog Posts entry from `navItems` (lines 100–107)
- Remove blog-related branches from `currentPageTitle` computed (lines 162–165)

```ts
// Remove from navItems:
{
  path: '/admin/blog',
  label: 'Blog Posts',
  icon: 'LucideFileText',
  children: [
    { path: '/admin/blog', label: 'All Posts', icon: 'LucideList' },
    { path: '/admin/blog/new', label: 'New Post', icon: 'LucidePlus' },
  ],
},

// Remove from currentPageTitle:
if (path.startsWith('/admin/blog/new')) return 'Blog / New Post'
if (path.startsWith('/admin/blog/')) return 'Blog / Edit Post'
if (path === '/admin/blog') return 'Blog Posts'
```

### 1.2 Sidebar Redesign

**File:** `src/layouts/admin.vue`

Restyle the sidebar to use Nightwire panel patterns:

- **Logo area**: `border-bottom: 1px solid nw-primary-dim` (panel-header style)
- **Section label**: small `NAVIGATION` stamp label above nav items (`font-stamp`, `text-[8px]`, `text-nw-primary-dim`, `tracking-[0.18em]`)
- **Nav items**: `border-left-2` active indicator in `nw-cyan`, bg `nw-cyan/6`, text `nw-cyan`. Inactive: `text-nw-text-dim` hover `text-nw-text`
- **Nav dot**: 5×5px circle per item, `nw-cyan` with glow when active
- **Child items**: indented (`pl-7`), 3×3px dot, same active treatment
- **User section**: avatar initial in `nw-cyan`, email in `text-[9px] text-nw-text-dim`, logout in `text-nw-red/70 hover:text-nw-red`

### 1.3 Dashboard Redesign

**File:** `src/pages/admin/index.vue`

Replace the generic 2-card grid with:

**Metrics strip** (4 cells, 1px gap on `nw-text-faint` background):
| Cell | Value | Color |
|------|-------|-------|
| Projects | count | `nw-green` + glow |
| Unread | contact count | `nw-yellow` + glow |
| Users | count | `nw-cyan` + glow |
| System | `NOMINAL` / LED | `nw-green` |

**Panel pair** below the strip (2-col grid):
- **Recent Projects** panel: last 3 projects with status badge (`LIVE` / `WIP` / `ALPHA`)
- **Contacts** panel: last 3 contacts with `UNREAD` / `READ` badge

Remove the "Quick Links" generic card.

> **Implementation note:** The dashboard currently fetches only `projects` and `contacts`. Add a `$fetch('/api/admin/users')` in `onMounted` to populate the Users count cell.

### 1.4 List Pages — nw-table Pattern

**Files:** `src/pages/admin/projects/index.vue`, `src/pages/admin/users/index.vue`, `src/pages/admin/contacts/index.vue`

Apply consistent table structure:

- **Panel wrapper**: `panel` + `panel-header` (section name + record count)
- **`<th>`**: `font-stamp`, `text-[9px]`, `text-nw-primary`, `tracking-[0.12em]`, `border-bottom border-nw-primary-dim`
- **`<td>`**: `text-[11px]`, `text-nw-text-dim`, `border-b border-nw-text-faint`
- **Row hover**: `hover:bg-nw-cyan/4`
- **Status badges**: inline `font-stamp text-[8px]` with semantic border + background:
  - `LIVE`: `text-nw-green border-nw-green-dim bg-nw-green-faint`
  - `WIP`: `text-nw-yellow border-nw-yellow/40 bg-nw-yellow/6`
  - `UNREAD`: `text-nw-yellow border-nw-yellow/40 bg-nw-yellow/6`
  - `READ`: `text-[#555] border-[#333]`
- **Action links**: `font-stamp text-[9px] text-nw-primary-dim hover:text-nw-primary` for EDIT, `text-nw-red/50 hover:text-nw-red` for DELETE

### 1.5 Admin Login Redesign

**File:** `src/pages/admin/login.vue`

- Center-aligned form on `bg-void` full-screen
- Logo / title: `{ Admin }` in Nightwire panel-header style, centered
- Input fields: same treatment as Contact form (Variant A — see PR 2)
- **Password field**: add show/hide toggle with `LucideEye` / `LucideEyeOff` icon button inside the input (right side). Toggle switches `type="password"` ↔ `type="text"`
- Submit button: full-width `btn` (nw-primary)

---

## PR 2 — Homepage Redesign

**Branch:** `feature/homepage-redesign`

### 2.1 Hero (`src/components/home/Hero.vue`)

**Changes:**
- **Avatar glow**: add `box-shadow: 0 0 28px rgba(102,153,255,0.18), 0 0 56px rgba(102,153,255,0.07)` to the `<NuxtImg>` element (maps to Tailwind: `shadow-[0_0_28px_rgba(102,153,255,0.18),0_0_56px_rgba(102,153,255,0.07)]`)
- **ID metadata dt labels**: change from `text-nw-text-dim` → `text-nw-primary` for the `<dt>` elements (OPERATOR / CLEARANCE / UNIT)

**No changes:** Layout, compressed title, hero copy, LED badge, CTA buttons, Japanese subtitle, links row.

### 2.2 ProofOfWork (`src/components/home/ProofOfWork.vue`)

No changes. Already fully Nightwire-compliant.

### 2.3 PortfolioSection / FeatureProjectCard

**File:** `src/components/home/portfolio/FeatureProjectCard.vue`

**Featured card only** (when `featured === true`):
- Border: change from `border-nw-primary-dim/50` → `border-nw-primary/40`
- Add left accent: `border-l-[3px] border-l-nw-primary`
- Add inner glow: `shadow-[inset_3px_0_16px_rgba(102,153,255,0.06),0_4px_24px_rgba(102,153,255,0.07)]`

**Normal cards**: no changes.

### 2.4 LatestPosts (`src/components/home/LatestPosts.vue`)

**Panel header change only:**

Add a `FEED · LIVE` LED indicator next to the title:

```html
<!-- in panel-header, next to the WRITING · LATEST text -->
<span class="flex items-center gap-1.5 text-nw-green font-stamp text-[8px] tracking-[0.12em] uppercase">
  <span class="led green blink" />
  FEED · LIVE
</span>
```

The existing `BLOG.CATIVO.DEV →` link stays on the right.

### 2.5 Contact Form — Variant A (Bordered Fields)

**Files:** `src/components/base/Input.vue`, `src/components/base/Textarea.vue`

**Label changes** (`<label>` element):
- `text-nw-cyan` → `text-nw-primary`
- Remove `font-bold`
- Reduce tracking: `tracking-wide` → `tracking-[0.16em]`
- Reduce size: add `text-[9px]` override

**Input / Textarea changes:**
- Border: `border-nw-text-line` → `border-nw-primary-dim`
- Border radius: `rounded` → `rounded-none`
- Focus ring: `focus:ring-2 focus:ring-nw-cyan` → `focus:ring-1 focus:ring-nw-primary focus:border-nw-primary`

### 2.6 Footer (`src/components/main/Footer.vue`)

No changes. Already fully Nightwire-compliant.

---

## Files Changed Summary

### PR 1 — Admin
| File | Change |
|------|--------|
| `src/layouts/admin.vue` | Remove blog nav + sidebar redesign |
| `src/pages/admin/index.vue` | Dashboard metrics-strip + panel pair |
| `src/pages/admin/login.vue` | Full redesign + password eye toggle |
| `src/pages/admin/projects/index.vue` | nw-table |
| `src/pages/admin/users/index.vue` | nw-table |
| `src/pages/admin/contacts/index.vue` | nw-table |

### PR 2 — Homepage
| File | Change |
|------|--------|
| `src/components/home/Hero.vue` | Avatar glow + dt label color |
| `src/components/home/portfolio/FeatureProjectCard.vue` | Featured card border-left + glow |
| `src/components/home/LatestPosts.vue` | FEED·LIVE indicator in panel header |
| `src/components/base/Input.vue` | Label + border + radius + focus ring |
| `src/components/base/Textarea.vue` | Label + border + radius + focus ring |

---

## Out of Scope

- Admin pages for projects new/edit forms (forms already work; styling is low priority for now)
- Any Ghost / blog.cativo.dev integration changes
- New homepage sections
- Mobile-specific layout changes
- Any backend / API changes
