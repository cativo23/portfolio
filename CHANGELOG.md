# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [0.2.0] - 2026-03-19

### Added
- Health status page with live/ready endpoints
- Auto-release and deploy workflows (GitHub Actions)
- CI workflow with build, type check, and auto-format
- Documentation: AGENTS.md, CHANGELOG.md, RELEASE_WORKFLOW.md

### Changed
- Health API response structure

### Fixed
- Dynamic routing for projects (`blog/[...slug].vue`)
- TypeScript errors in project detail page
- Hydration mismatches in async data
- Health endpoint and page issues
- Critical CI/CD security issues

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
