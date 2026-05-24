# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the favicon to a Nightwire-styled SVG, then apply focused visual improvements to the homepage (Hero, FeatureProjectCard, LatestPosts, BaseInput, BaseTextarea) to bring them fully in line with the Nightwire design system.

**Architecture:** All changes are purely in Vue templates and Tailwind class lists. No new components are created. The favicon becomes an SVG with the Nightwire `C` motif on a void background. The contact form fields (BaseInput/Textarea) receive Variant A styling agreed in the design session.

**Tech Stack:** Nuxt 3, Vue 3, Tailwind CSS, Nightwire design system (`.nightwire/nightwire.css` + `tailwind.preset.js`), Lucide icons (auto-imported), static SVG for favicon

---

### Task 0: Nightwire Favicon

**Files:**
- Create: `src/public/favicon.svg`
- Modify: `nuxt.config.ts`

- [ ] **Step 1: Create the SVG favicon**

Create `src/public/favicon.svg` with this exact content (dark void background + nw-primary `C` initial + panel border):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#000000"/>
  <rect x="1" y="1" width="30" height="30" fill="none" stroke="#4477cc" stroke-width="1"/>
  <path d="M22 10 Q10 10 10 16 Q10 22 22 22" stroke="#6699ff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>
```

Design rationale: `#000000` = `--void`, `#4477cc` = `--nw-primary-dim` (panel border), `#6699ff` = `--nw-primary` (C initial). The `C` is a single arc path readable at 16×16.

- [ ] **Step 2: Wire the SVG favicon in nuxt.config.ts**

In `nuxt.config.ts`, find the `head.link` array (currently starts at line 62) and add the SVG favicon entry at the top of the array. Keep the existing font preconnect entries unchanged:

```ts
link: [
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Saira+Extra+Condensed:wght@400;600;700;800&family=Shippori+Mincho+B1:wght@500;700;800&display=swap'
  },
],
```

The existing `src/public/favicon.ico` stays as a fallback for older browsers — do not remove it.

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:3000` and check the browser tab — the favicon should show the dark `C` icon. Zoom the tab strip to confirm it's legible.

- [ ] **Step 4: Commit**

```bash
git add src/public/favicon.svg nuxt.config.ts
git commit -m "feat(favicon): add Nightwire-styled SVG favicon"
```

---

### Task 1: Hero — Avatar Glow + DT Label Color

**Files:**
- Modify: `src/components/home/Hero.vue`

**Current state:**
- `NuxtImg` has `class="relative w-[180px] h-[180px] object-cover border border-nw-primary-dim"` (line 78)
- `<dl>` children `<dt>` elements have no explicit color class — they inherit `text-nw-text-dim` from the `<dl>` (line 83)

- [ ] **Step 1: Add avatar glow to NuxtImg**

In `src/components/home/Hero.vue` at line 78, add the Tailwind shadow utility to the `NuxtImg` class string:

Replace:
```html
class="relative w-[180px] h-[180px] object-cover border border-nw-primary-dim"
```

With:
```html
class="relative w-[180px] h-[180px] object-cover border border-nw-primary-dim shadow-[0_0_28px_rgba(102,153,255,0.18),0_0_56px_rgba(102,153,255,0.07)]"
```

- [ ] **Step 2: Update dt label color**

In `src/components/home/Hero.vue`, the `<dl>` wrapper (line 83) already has `text-nw-text-dim` which is inherited by both `<dt>` and `<dd>`. The `<dd>` elements already override to `text-nw-text`. Add explicit `text-nw-primary` class to each `<dt>`:

Replace the three `<div>` rows (lines 84–86):
```html
<div class="flex justify-between gap-2"><dt>OPERATOR</dt><dd class="text-nw-text">CATIVO-01</dd></div>
<div class="flex justify-between gap-2"><dt>CLEARANCE</dt><dd class="text-nw-text">TECH-LEAD</dd></div>
<div class="flex justify-between gap-2"><dt>UNIT</dt><dd class="text-nw-text">BLUE-MEDICAL-GT</dd></div>
```

With:
```html
<div class="flex justify-between gap-2"><dt class="text-nw-primary">OPERATOR</dt><dd class="text-nw-text">CATIVO-01</dd></div>
<div class="flex justify-between gap-2"><dt class="text-nw-primary">CLEARANCE</dt><dd class="text-nw-text">TECH-LEAD</dd></div>
<div class="flex justify-between gap-2"><dt class="text-nw-primary">UNIT</dt><dd class="text-nw-text">BLUE-MEDICAL-GT</dd></div>
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```

Navigate to `http://localhost:3000`. The Hero section should show:
- Avatar image with a subtle blue outer glow
- OPERATOR / CLEARANCE / UNIT labels in nw-primary blue (not the dim gray they were before)

- [ ] **Step 4: Commit**

```bash
git add src/components/home/Hero.vue
git commit -m "feat(hero): add avatar glow and upgrade dt label color to nw-primary"
```

---

### Task 2: FeatureProjectCard — Featured Card Left Accent + Glow

**Files:**
- Modify: `src/components/home/portfolio/FeatureProjectCard.vue`

**Current state (line 3–8):**
```html
:class="[
  'bg-void-raised hover:bg-void-panel border hover:border-nw-primary-dim transition-all duration-200 p-5 flex flex-col gap-3',
  featured ? 'border-nw-primary-dim/50' : 'border-nw-text-line',
  'hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(102,153,255,0.08)]',
]"
```

- [ ] **Step 1: Apply featured card border + glow classes**

In `src/components/home/portfolio/FeatureProjectCard.vue`, replace the `:class` binding on the `<NuxtLink>` (lines 3–8):

Replace:
```html
:class="[
  'bg-void-raised hover:bg-void-panel border hover:border-nw-primary-dim transition-all duration-200 p-5 flex flex-col gap-3',
  featured ? 'border-nw-primary-dim/50' : 'border-nw-text-line',
  'hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(102,153,255,0.08)]',
]"
```

With:
```html
:class="[
  'bg-void-raised hover:bg-void-panel border transition-all duration-200 p-5 flex flex-col gap-3',
  featured
    ? 'border-nw-primary/40 border-l-[3px] border-l-nw-primary shadow-[inset_3px_0_16px_rgba(102,153,255,0.06),0_4px_24px_rgba(102,153,255,0.07)] hover:border-nw-primary-hot/50'
    : 'border-nw-text-line hover:border-nw-primary-dim',
  'hover:-translate-y-0.5',
]"
```

Note: the base `hover:shadow-[...]` on the last line is removed — featured already has its own shadow, and normal cards don't need the lift shadow (they get the border highlight instead).

- [ ] **Step 2: Run dev server and verify**

```bash
npm run dev
```

Navigate to `http://localhost:3000` and scroll to the Projects section. The featured card (the one at the top / first in the grid, where `featured=true`) should have:
- A visible 3px nw-primary left border accent
- A subtle inner-left blue glow
- A brighter overall border vs. normal cards

Normal (non-featured) cards should look unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/portfolio/FeatureProjectCard.vue
git commit -m "feat(portfolio): add left accent + glow to featured project card"
```

---

### Task 3: LatestPosts — FEED·LIVE LED Indicator

**Files:**
- Modify: `src/components/home/LatestPosts.vue`

**Current state (lines 3–12):**
```html
<div class="panel-header">
  <span>WRITING · LATEST</span>
  <a
    href="https://blog.cativo.dev"
    target="_blank"
    rel="noopener noreferrer"
    class="text-nw-primary hover:text-nw-primary-hot text-[10px] font-stamp uppercase tracking-wider"
  >
    BLOG.CATIVO.DEV →
  </a>
</div>
```

- [ ] **Step 1: Add FEED·LIVE indicator to panel-header**

In `src/components/home/LatestPosts.vue`, replace the `panel-header` block (lines 3–12):

Replace:
```html
<div class="panel-header">
  <span>WRITING · LATEST</span>
  <a
    href="https://blog.cativo.dev"
    target="_blank"
    rel="noopener noreferrer"
    class="text-nw-primary hover:text-nw-primary-hot text-[10px] font-stamp uppercase tracking-wider"
  >
    BLOG.CATIVO.DEV →
  </a>
</div>
```

With:
```html
<div class="panel-header">
  <div class="flex items-center gap-3">
    <span>WRITING · LATEST</span>
    <span class="flex items-center gap-1.5 text-nw-green font-stamp text-[8px] tracking-[0.12em] uppercase">
      <span class="led green blink" />
      FEED · LIVE
    </span>
  </div>
  <a
    href="https://blog.cativo.dev"
    target="_blank"
    rel="noopener noreferrer"
    class="text-nw-primary hover:text-nw-primary-hot text-[10px] font-stamp uppercase tracking-wider"
  >
    BLOG.CATIVO.DEV →
  </a>
</div>
```

The `.led.green.blink` classes come from Nightwire CSS — they render a small pulsing green dot consistent with the LED badge on the Hero section.

- [ ] **Step 2: Run dev server and verify**

```bash
npm run dev
```

Navigate to `http://localhost:3000` and scroll to the Writing section. The panel header should show:
- `WRITING · LATEST` title (unchanged)
- A small blinking green LED + `FEED · LIVE` stamp text next to the title
- `BLOG.CATIVO.DEV →` link on the right (unchanged)

- [ ] **Step 3: Commit**

```bash
git add src/components/home/LatestPosts.vue
git commit -m "feat(latest-posts): add FEED LIVE LED indicator to panel header"
```

---

### Task 4: BaseInput + BaseTextarea — Variant A Styling

**Files:**
- Modify: `src/components/base/Input.vue`
- Modify: `src/components/base/Textarea.vue`

**Design:** Variant A (Bordered Fields) — agreed during brainstorm. Changes are identical in both files.

**Current label class (both files):** `text-nw-cyan font-stamp uppercase tracking-wide font-bold`

**Target label class:** `text-nw-primary font-stamp uppercase tracking-[0.16em] text-[9px]`

**Current inputClasses/textareaClasses:**
```ts
'w-full px-3 py-2 bg-void-warm text-nw-text rounded font-sys placeholder-nw-text-dim transition',
'focus:outline-none focus:ring-2 focus:ring-nw-cyan border',
props.error ? 'border-nw-red' : 'border-nw-text-line',
```

**Target inputClasses/textareaClasses:**
```ts
'w-full px-3 py-2 bg-void-warm text-nw-text rounded-none font-sys placeholder-nw-text-dim transition',
'focus:outline-none focus:ring-1 focus:ring-nw-primary focus:border-nw-primary border',
props.error ? 'border-nw-red' : 'border-nw-primary-dim',
```

- [ ] **Step 1: Update BaseInput**

In `src/components/base/Input.vue`:

Replace `inputClasses` computed (lines 34–38):
```ts
const inputClasses = computed(() => [
  'w-full px-3 py-2 bg-void-warm text-nw-text rounded font-sys placeholder-nw-text-dim transition',
  'focus:outline-none focus:ring-2 focus:ring-nw-cyan border',
  props.error ? 'border-nw-red' : 'border-nw-text-line',
])
```

With:
```ts
const inputClasses = computed(() => [
  'w-full px-3 py-2 bg-void-warm text-nw-text rounded-none font-sys placeholder-nw-text-dim transition',
  'focus:outline-none focus:ring-1 focus:ring-nw-primary focus:border-nw-primary border',
  props.error ? 'border-nw-red' : 'border-nw-primary-dim',
])
```

Replace label class (line 43):
```html
<label v-if="label" :for="inputId" class="text-nw-cyan font-stamp uppercase tracking-wide font-bold">
```

With:
```html
<label v-if="label" :for="inputId" class="text-nw-primary font-stamp uppercase tracking-[0.16em] text-[9px]">
```

- [ ] **Step 2: Update BaseTextarea**

In `src/components/base/Textarea.vue`:

Replace `textareaClasses` computed (lines 34–38):
```ts
const textareaClasses = computed(() => [
  'w-full px-3 py-2 bg-void-warm text-nw-text rounded font-sys placeholder-nw-text-dim transition',
  'focus:outline-none focus:ring-2 focus:ring-nw-cyan border',
  props.error ? 'border-nw-red' : 'border-nw-text-line',
])
```

With:
```ts
const textareaClasses = computed(() => [
  'w-full px-3 py-2 bg-void-warm text-nw-text rounded-none font-sys placeholder-nw-text-dim transition',
  'focus:outline-none focus:ring-1 focus:ring-nw-primary focus:border-nw-primary border',
  props.error ? 'border-nw-red' : 'border-nw-primary-dim',
])
```

Replace label class (line 43):
```html
<label v-if="label" :for="textareaId" class="text-nw-cyan font-stamp uppercase tracking-wide font-bold">
```

With:
```html
<label v-if="label" :for="textareaId" class="text-nw-primary font-stamp uppercase tracking-[0.16em] text-[9px]">
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```

Navigate to `http://localhost:3000` and scroll to the Contact section. All form fields should show:
- Labels in nw-primary blue (not nw-cyan), smaller and lighter (no bold)
- Input borders in `nw-primary-dim` (not the faint `nw-text-line`)
- No border radius (sharp corners)
- On focus: a 1px ring + border in `nw-primary` (not the 2px cyan ring)

The error state (red border) remains unchanged — no need to test this path visually.

Note: BaseInput and BaseTextarea are also used in the admin login form. After this change, the admin login fields will pick up the same Variant A styling automatically — this is intentional per the design spec (section 1.5 refers to "same treatment as Contact form").

- [ ] **Step 4: Commit**

```bash
git add src/components/base/Input.vue src/components/base/Textarea.vue
git commit -m "feat(forms): apply Nightwire Variant A styling to BaseInput and BaseTextarea"
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Task 0 — Favicon (added per Carlos's request during session)
- ✅ Task 1 — Hero: avatar glow + dt labels → nw-primary (spec §2.1)
- ✅ Task 2 — FeatureProjectCard: featured border-left + glow (spec §2.3)
- ✅ Task 3 — LatestPosts: FEED·LIVE LED (spec §2.4)
- ✅ Task 4 — BaseInput + BaseTextarea: Variant A (spec §2.5)
- ProofOfWork (spec §2.2): "No changes. Already fully Nightwire-compliant." — correctly excluded.
- Footer (spec §2.6): "No changes. Already fully Nightwire-compliant." — correctly excluded.
- Hero copy/layout/CTA buttons (spec §2.1 "No changes"): unchanged — correctly excluded.

**Placeholder scan:** No TBDs, TODOs, or incomplete steps. Every code block is complete.

**Type consistency:** No shared types between tasks — each task is self-contained DOM/class changes.
