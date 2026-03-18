# Design: Accessibility Audit Fixes (#33 + #36)

## Goal

Fix identified accessibility gaps across existing components — ARIA labels, focus styles, live regions, semantic roles, and form attributes.

## Scope

**In scope:** 8 categories of a11y fixes across existing files. No new components.

**Out of scope:** Focus trap for mobile menu, DecryptedText keyboard animation, color contrast audit (require visual testing — follow-up work).

## Fixes

### 1. Mobile menu close button (`src/components/main/Header.vue`)

Add `aria-label="Close menu"` to the close button (currently icon-only with no accessible name).

### 2. Mobile menu dialog semantics (`src/components/main/Header.vue`)

- Add `role="dialog"` and `aria-modal="true"` to the mobile menu overlay div
- Add `aria-label="Mobile navigation"` to the overlay
- Add `:aria-expanded="isMenuOpen"` to the hamburger toggle button

### 3. Form fields aria-required (`src/components/base/Input.vue`, `src/components/base/Textarea.vue`)

Add `:aria-required="required"` to the `<input>` and `<textarea>` elements. The `required` prop already exists — just bind it to the ARIA attribute too.

### 4. Focus styles on BaseButton (`src/components/base/Button.vue`)

Add `focus:ring-2 focus:ring-tokyo-night-cyan focus:outline-none` to the base classes computed. This gives all button variants (primary, secondary, ghost, icon) visible focus indicators for keyboard users.

### 5. Error/loading ARIA live regions

**`src/components/home/portfolio/PortfolioSection.vue`:**
- Loading div: add `role="status"` and `aria-live="polite"`
- Error div: add `role="alert"`

**`src/pages/projects.vue`:**
- Loading div: add `role="status"` and `aria-live="polite"`
- Error div: add `role="alert"`

### 6. Hero image alt text (`src/components/home/Hero.vue`)

Change `alt="Foto de perfil"` to `alt="Carlos Cativo profile photo"` (English for international audience).

### 7. PortfolioSection error UI (#36)

The error template already exists (`<div>Failed to load projects</div>`). Fix #5 adds `role="alert"` to it. The TODO comment on the catch block can be removed since error UI is already wired via the `error` ref. No additional work needed beyond #5.

### 8. Contact page aria-required (`src/pages/contact.vue`)

The standalone contact page at `src/pages/contact.vue` has inline form fields (not using BaseInput/BaseTextarea). Add `aria-required="true"` to the required input/textarea elements there.

## Constraints

- No new files or components
- Minimal changes — only add a11y attributes
- No visual changes
- Follow WCAG 2.1 Level AA guidelines
