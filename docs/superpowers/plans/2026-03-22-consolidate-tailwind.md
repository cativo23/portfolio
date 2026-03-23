# Consolidate Repeated Tailwind Patterns

**Issue:** #35
**Created:** 2026-03-22
**Status:** Pending

## Overview

Extract three commonly duplicated Tailwind CSS patterns into reusable UI components to improve consistency and maintainability.

### Components to Create

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `StatusIndicator.vue` | Colored dot (pulsing/static) + text label | `status`, `text`, `pulse`, `size` |
| `MetaInfoPair.vue` | Semantic `<dt>`/`<dd>` for label/value pairs | `label`, `value`, `horizontal`, `color` |
| `AsyncState.vue` | Wrapper for loading/error/empty states | `loading`, `error`, `empty` |

---

## Tasks

### Task 1: Create `StatusIndicator.vue` Component

Build a reusable status indicator with configurable dot color, pulse animation, and optional text.

- [ ] Create `src/components/ui/StatusIndicator.vue`
- [ ] Define props: `status` ('success' | 'error' | 'warning' | 'info'), `text` (string, optional), `pulse` (boolean, default: false), `size` ('sm' | 'md' | 'lg')
- [ ] Map status values to Tailwind color classes (e.g., success → green, error → red)
- [ ] Implement size variants with appropriate dot dimensions and text sizing
- [ ] Add pulse animation using Tailwind's `animate-ping` for the pulsing effect
- [ ] Ensure accessibility: add `aria-label` when text is provided, `role="status"`
- [ ] Verify component renders correctly in isolation (dev server)

---

### Task 2: Create `MetaInfoPair.vue` Component

Build a semantic definition list item component for displaying metadata label/value pairs.

- [ ] Create `src/components/ui/MetaInfoPair.vue`
- [ ] Define props: `label` (string), `value` (string | number), `horizontal` (boolean, default: false), `color` (string, optional for value text)
- [ ] Render as `<dt>` for label and `<dd>` for value (semantic HTML)
- [ ] Apply flexbox layout: column when `horizontal=false`, row when `horizontal=true`
- [ ] Style label with muted/secondary text color
- [ ] Apply optional `color` prop to value text for status-specific coloring
- [ ] Verify component renders correctly in isolation (dev server)

---

### Task 3: Create `AsyncState.vue` Component

Build a wrapper component that handles loading, error, and empty states with proper accessibility attributes.

- [ ] Create `src/components/base/AsyncState.vue`
- [ ] Define props: `loading` (boolean), `error` (Error | string | null), `empty` (boolean)
- [ ] Define slots: `#loading`, `#error`, `#empty`, and default slot for content
- [ ] Implement conditional rendering priority: loading → error → empty → default
- [ ] Add `aria-live="polite"` to the loading slot for screen readers
- [ ] Add `role="alert"` to the error slot for screen readers
- [ ] Pass `error` object/string to the `#error` slot via slot props
- [ ] Verify component renders correctly in isolation (dev server)

---

### Task 4: Refactor `src/pages/health.vue`

Update the health page to use all three new components.

- [ ] Replace hardcoded pulsing dot patterns with `StatusIndicator` (pulse: true)
- [ ] Replace static status dots with `StatusIndicator` (pulse: false)
- [ ] Replace definition list markup in meta info sections with `MetaInfoPair`
- [ ] Wrap async data sections with `AsyncState` component
- [ ] Remove now-unnecessary Tailwind utility classes that are encapsulated in components
- [ ] Verify `/health` page renders correctly (dev server)
- [ ] Check loading states display properly
- [ ] Verify pulsing animations work as expected

---

### Task 5: Refactor `src/components/ui/HealthBadge.vue`

Update the HealthBadge component to use `StatusIndicator`.

- [ ] Replace internal status dot markup with `StatusIndicator` component
- [ ] Pass through relevant props (status, pulse)
- [ ] Verify `HealthBadge` renders correctly wherever it's used
- [ ] Ensure no regression in existing functionality

---

### Task 6: Refactor Project Pages

Update project listing and detail pages to use the new components.

- [ ] Wrap data fetching sections in `src/pages/projects/index.vue` with `AsyncState`
- [ ] Update `src/pages/projects/[id].vue` sidebar to use `MetaInfoPair` for:
  - Status field
  - Created date field
  - Updated date field
- [ ] Update `PortfolioSection.vue` (home page) to use `AsyncState`
- [ ] Verify `/projects` page loading state renders correctly (dev server)
- [ ] Verify `/projects/1` (or similar) detail page sidebar renders correctly
- [ ] Check that sticky sidebar layout is not affected

---

### Task 7: Refactor `src/pages/about.vue`

Update the about page to use `MetaInfoPair` for API statistics.

- [ ] Replace hardcoded API metadata markup with `MetaInfoPair` components
- [ ] Use `horizontal` layout if the current design shows label/value side-by-side
- [ ] Verify `/about` page renders correctly (dev server)
- [ ] Confirm styling matches the original design

---

### Task 8: Final Verification

Comprehensive testing across all affected pages.

- [ ] Run Nuxt dev server and confirm no TypeScript/compilation errors
- [ ] Visit `/health` — verify status indicators, meta info grid, loading states
- [ ] Visit `/projects` — verify loading/error states work
- [ ] Visit `/projects/1` — verify sidebar metadata displays correctly
- [ ] Visit `/about` — verify API metadata displays correctly
- [ ] Run `npm run build` (or project build command) to ensure production build succeeds
- [ ] Run linter/type checker if configured (`npm run lint`, `npm run type-check`)

---

## Notes

- **No TDD for UI components:** Vue template changes are best verified visually via dev server. Unit tests can be added later if needed for slot logic or prop validation.
- **Component locations:** `ui/` for reusable UI components, `base/` for foundational wrapper components.
- **Backwards compatibility:** Existing components like `HealthBadge.vue` should maintain their public API (props, events).
