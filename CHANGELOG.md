# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

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
