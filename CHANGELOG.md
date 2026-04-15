# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [1.7.0] - 2026-04-14

### Added
- **Comprehensive Test Suite** — 221 unit tests across 34 test files covering all composables, base UI components, server API endpoints, and middleware
- **E2E Tests** — Playwright test coverage for admin flows, blog, projects, and users
- **Blog Content** — 18 blog posts rewritten in personal voice, covering self-hosting, Nova-ID dev log, and CLI tooling
- **About Page Components** — SkillPill, SkillsGrid, Timeline, and ExperienceCard with full test coverage
- **Server Middleware** — Admin auth middleware with httpOnly cookie validation
- **E2E Test Infrastructure** — Playwright setup with global auth session

### Changed
- Blog posts rewritten to match raw, personal voice
- tsconfig path fix for server-side tests
- Docker dev container running on develop

---

## [1.6.1] - 2026-04-14

### Security
- httpOnly cookie logout: server-side endpoint clears cookie instead of attempting client-side deletion
- Fire-and-forget logout pattern prevents blocking redirect on slow responses
- YAML injection prevention: `yaml` package replaces manual frontmatter escaping
- Body size limits (64KB) and proper 400/413 error responses on MDC parse endpoint
- Auth guard consistency: removed redundant checks in users endpoint, aligned with middleware

### Fixed
- User rehydration after page refresh via `/api/admin/me` initialization check
- Health page double API call: replaced manual SSR/client branching with `useAsyncData`
- Dead imports and type mismatches in health.vue and useAdminAuth

---

## [1.6.0] - 2026-04-11

### Added
- **Admin Panel** — Full admin area with cookie-based authentication, project CRUD, blog management, contact inbox, and user management
- **Blog Editor** — Toast UI Editor integration for rich Markdown blog post creation with draft/publish workflow
- **About Page Redesign** — Timeline view, experience cards, and skills grid with real professional data
- **Profile API** — `/api/profile` endpoint with local data fallback when external API is unreachable
- **Contact Form** — Improved validation using `useContactForm` composable with per-field error display
- **Admin Dashboard** — Projects, blog posts, users, and contacts management with sidebar navigation
- **Auth System** — Cookie-based authentication with httpOnly tokens, global 401 interceptor, and `/api/admin/me` endpoint
- **Admin UX** — Per-field validation errors, dynamic SSR-safe component loading, and nav highlighting

### Fixed
- Draft blog posts no longer leak in public listing
- Toast UI Editor SSR crash resolved with dynamic loading
- Nav highlighting now correctly reflects active routes
- Routing conflicts between admin and public pages
- TUI Editor SSR crash fixed with dynamic component loading
- Removed test blog post from production content

### Security
- Cookie-based authentication with httpOnly tokens
- Global 401 interceptor for admin API routes
- Token validation against external API with redirect on failure
- Per-field validation error display to prevent information leakage

---

## [1.5.0] - 2026-03-26

### Fixed
- Footer API status now displays real-time health check instead of hardcoded "Degraded" value
- Footer now fetches and displays actual API version from backend

---

## [1.4.0] - 2026-03-25

### Changed
- Updated about page content with rewritten bio and skills to match actual experience

---

## [1.3.0] - 2026-03-23

### Added
- Terminal-like UI/UX redesign with modern minimalist aesthetic
- Horizontal header layout with typing effect and navigation
- Footer status bar with API Status indicator

### Changed
- Updated all text colors to use bright Tokyo Night blue (#7aa2f7) for better contrast
- Redesigned cards with border styling instead of shadows
- Applied font-mono class to headings and text elements throughout
- Added ❯ prefix to section headings and navigation elements
- Updated tech stack display to use [Tech] format instead of badges

### Fixed
- SSR hydration bug in featured projects loading on home page refresh
- Text contrast issues on blog and project titles
- BaseCard link text color inheritance

### Security
- URL validation for external links to prevent open redirect attacks

---

## [1.2.0] - 2026-03-23

### Added
- **New reusable UI components** for consistent Tailwind patterns:
  - `StatusIndicator.vue` - Colored status dot with optional pulse animation and text label
  - `MetaInfoPair.vue` - Semantic label/value pairs for metadata display
  - `AsyncState.vue` - Wrapper component for loading, error, and empty states
- Accessibility improvements:
  - `aria-label` support in StatusIndicator for screen readers
  - `aria-pressed` and `role="tab"` for health check tab buttons
  - `aria-live` regions for dynamic content announcements
- URL validation for external links to prevent open redirect attacks:
  - Strict validation for repository URLs (GitHub, GitLab, Bitbucket)
  - Flexible validation for live demo URLs (HTTPS required)

### Changed
- Refactored health page to use new UI components with cleaner computed properties
- Updated about page to use AsyncState for API info loading states
- Improved grid layout for projects pages by using inline state templates
- Enhanced TypeScript type safety in AsyncState slot definitions
- Error messages now sanitized to prevent information leakage

### Fixed
- Missing `computed` import in StatusIndicator and MetaInfoPair components
- Invalid HTML structure in MetaInfoPair (changed `<dt>/<dd>` to `<span>` elements)
- TypeScript error in Header.vue click handler
- Grid layout issues caused by AsyncState wrapper breaking CSS grid
- Complex ternary expressions extracted to computed properties for readability

### Security
- Added URL sanitization for all external links in project pages
- Error messages sanitized before display to prevent sensitive info exposure

---

## [1.1.0] - 2026-03-22

### Added
- Redesigned 'Case Study + Sidebar' layout for project detail pages
- Hero image and sticky sidebar in project details
- `useContactForm` composable for modular contact logic

### Changed
- Refactored Dockerfile to use `alpine` base image
- Replaced `@nuxt/image` ipx provider with `none` to simplify build
- Updated `@tailwindcss/typography` to `^0.5.19`

### Fixed
- Markdown rendering in project detail page using `@nuxtjs/mdc` and `<MDC>` component
- NuxtLink `href` syntax changed to `to`

---

## [1.0.3] - 2026-03-19

### Fixed
- Use correct image name 'portfolio' in compose.prod.yml

---

## [1.0.2] - 2026-03-19

### Changed
- Updated compose.prod.yml with Traefik labels and external network config

### Fixed
- Add API environment variables to compose.prod.yml

---

## [1.0.1] - 2026-03-19

### Changed
- Auto-release workflow now uses RELEASE_PAT for GitHub API authentication

---

## [1.0.0] - 2026-03-19

### Added
- Health status page with live/ready endpoints
- Auto-release and deploy workflows (GitHub Actions)
- CI workflow with build, type check, and auto-format
- Documentation: AGENTS.md, CHANGELOG.md, RELEASE_WORKFLOW.md
- Vitest testing setup with useToast unit tests

### Changed
- Health API response structure
- Upgraded to Nuxt 4 with Vue 3

### Fixed
- Dynamic routing for projects (`blog/[...slug].vue`)
- TypeScript errors in project detail page
- Hydration mismatches in async data
- Health endpoint and page issues
- Critical CI/CD security issues
- Project card links and navigation

---

## [0.2.0] - 2026-03-19

### Added
- Health status page with live/ready endpoints
- Auto-release and deploy workflows (GitHub Actions)
- CI workflow with build, type check, and auto-format

### Changed
- Health API response structure

### Fixed
- Dynamic routing for projects (`blog/[...slug].vue`)
- TypeScript errors in project detail page
- Hydration mismatches in async data

---

## [0.1.0] - 2026-03-18

### Added
- Nuxt 3 portfolio site with `srcDir: 'src/'` configuration
- TailwindCSS with Tokyo Night color palette
- Blog functionality with `@nuxt/content` v3
- Projects integration with external API (`useProjects` composable)
- SEO enhancements: sitemap, RSS feed, JSON-LD structured data
- Image optimization with `@nuxt/image`
- Accessibility improvements
- Docker support (dev and prod)

### Changed
- Removed DaisyUI dependency
- Migrated to vanilla CSS with Tailwind

### Fixed
- Project card links and navigation
- Sitemap compatibility with `@nuxt/content` v3
- Type annotations in API endpoints
