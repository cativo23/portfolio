# Portfolio Code Review

**Reviewer**: Senior Frontend Engineer  
**Date**: December 30, 2025  
**Project**: Carlos Cativo Portfolio (Nuxt 3)

---

## Executive Summary

This review focuses on maintainability, performance, accessibility, and developer experience for a small but public-facing Nuxt 3 portfolio. The codebase is well-organized and mostly production-ready; primary gaps are type-safety, image delivery, accessibility details, and a few CI/production hygiene items. The recommended work is prioritized so a few targeted changes will materially improve reliability and performance.

**Overall Rating**: 8.5/10

---

## Major Findings (high impact)

- Image handling: many images lack optimized delivery (src/static usage, missing dimensions, no lazy loading). Use `@nuxt/image` / `<NuxtImg>` or native `loading="lazy"` and explicit width/height.
- Accessibility: some interactive elements are missing ARIA labels and focus styles (mobile menu, footer icons). Replace `alert()` with an accessible toast/inline errors and ensure keyboard focus states.
- Data duplication: project and blog metadata are scattered. If projects are fetched from an API, centralize at the API-consumption layer rather than a static `src/data/` file. Add a typed adapter and a single composable so components consume a normalized `Project` shape (see Actionable Next Steps below).
- CI/production: Dockerfile and image build steps need multi-stage optimizations and a `.dockerignore` to reduce image size and avoid leaking dev files.

---

## Performance & Lighthouse

- Serve optimized images (WebP/AVIF fallbacks) and add responsive srcsets for hero/project images.
- Prefetch critical fonts and limit font weights to what’s used. Consider `font-display: swap` (already present?) and subset in production.
- Reduce JS payload by ensuring no heavy runtime dependencies are imported in client-only code. Use dynamic imports for non-critical components.

---

## Accessibility (a11y)

- Replace `alert()` usage and ensure form errors are announced via `role="alert"` or an ARIA live region.
- Add `aria-label` to icon-only buttons, ensure all links have discernible text, and confirm color contrast meets WCAG AA.
- Keyboard navigation: test tab order for modals, mobile nav, and the contact form. Add visible focus outlines with `ring` utilities where necessary.

---

## TypeScript & DX

- Add interfaces for shared models in `types/meta.ts` (e.g., `Project`, `BlogPost`, `Author`) and update components to use them.
- Replace generic `any`/`Object` props and add return types for composables (`useProjects`, `usePageTitle`).
- Enable stricter compiler options gradually (turn on `noImplicitAny` or `strict` in a follow-up PR if feasible).

---

## Architecture & Code Organization

- Centralize API consumption and normalization: implement a small adapter layer (e.g. `src/lib/adapters/projects.ts`) that maps upstream API responses to a canonical `Project` interface in `types/`. Expose a single composable (`src/composables/useProjects.ts`) that fetches, normalizes, caches, and exposes loading/error states. Keep an optional `src/data/mock-projects.ts` for local development and tests.
- Create small presentational components for repeated UI bits (tag pill, project meta row) to reduce Tailwind duplication.
- Keep composables focused and well-typed; prefer `use` prefix and export small public APIs.

---

## Tests & CI

- Add a lightweight test matrix: unit tests for critical composables and snapshot tests for key components.
- Add a GitHub Actions workflow to run `yarn build` and `vue-tsc --noEmit` on PRs to catch regressions early.

---

## Security & Privacy

- Server-side contact validation is required before storing or forwarding messages. Add server-side rate-limiting/anti-spam (simple honeypot and server checks).
- Do not include secrets in Docker images or in the repo; validate `.env` usage in CI.

---

## Actionable Next Steps (prioritized)

1) High (ship in next 1–2 PRs)
- Add `types/` interfaces for `Project` and `BlogPost` and update `FeatureProjectCard.vue` and `LatestBlogPostCard.vue` to use `defineProps<T>()`.
- Centralize project/blog metadata into `src/data/` (or standardize on `content/` frontmatter) and update components to consume it.
- Replace `alert()` with an accessible toast component and wire form errors into an ARIA live region.
- Add `.dockerignore` and convert `docker/prod/Dockerfile` to a minimal multi-stage build.

2) Medium (next sprint)
- Integrate `@nuxt/image` (or `nuxt/image` module) and replace static img usage with `<NuxtImg>` including responsive sizes.
- Consolidate repeated Tailwind patterns into small components or `@apply` utilities; add a `src/components/ui/` set for primitives.
- Add a GitHub Action to run `yarn build` and `vue-tsc --noEmit` on PRs.

3) Low (backlog)
- Run a full a11y audit (axe / Lighthouse) and address keyboard/contrast issues.
- Add unit/E2E tests for contact flow and project listing.

---

## Quick Wins (<= 30m)

- Update a couple of icon-only buttons with `aria-label` and focus styles.  
- Remove remaining `console.log` and `alert` calls.  
- Add `loading="lazy"` and width/height attributes where obvious on large images.

---

## Checklist (updated)

- [x] Fix stray HTML syntax in `src/app.vue`  
- [x] Remove development `console.log` statements  
- [x] Disable/move debug flags for production  
- [x] Replace placeholder project URLs  
- [x] Improve frontend contact form UX (client)  
- [ ] Add `types/` interfaces and update public components  
- [ ] Centralize `src/data/` datasets or standardize on `content/`  
- [ ] Implement server-side contact validation + anti-spam  
- [ ] Add image optimization & lazy loading with responsive sizes  
- [ ] Create `.dockerignore` and finalize production Dockerfile

---

If you want, I can open a PR that implements the high-priority items: adding types for the project model, centralizing data, and replacing `alert()` with a toast component. Which should I start with?
