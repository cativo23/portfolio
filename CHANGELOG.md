# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.12.0] - 2026-06-03

### Added
- **Content Security Policy + security headers** via `nuxt-security`, running in **report-only** mode first. Nonce-based `script-src` with `strict-dynamic` (no `unsafe-inline` for scripts), hardened `style-src`/`font-src`/`connect-src`/`img-src`, and a `/api/csp-report` violation sink that logs path-only reports. Report-only lets us surface real-traffic violations before flipping the policy to enforced. (#123)

### Changed
- **Node 22 → 24** across CI and the dev/prod Docker images, required by `nuxt-security` 2.6.0 (its first-class report-only CSP support needs Node ≥ 24). (#123)

---

## [1.11.0] - 2026-05-29

### Added
- **AI chat assistant widget** — a floating, nightwire-styled chat (site-wide, public) that answers visitor questions about Carlos: experience, projects, stack, and how to get in touch. It calls the backend `/chat` endpoint through a Nuxt server proxy (the request stays server-side), and handles loading, error, and rate-limit (429, with a cooldown) states. Reuses `BaseButton` and `useFocusTrap`; goes full-screen on mobile. (#120)

---

## [1.10.16] - 2026-05-28

### Fixed
- **ProofOfWork npm data** — Signal API was fetching downloads for `claude-setup`, a package not owned by this account, inflating the total DL count. Replaced with `claude-style` (own package). NPM Packages metric corrected from hardcoded `2` → `4` (actual published count: lumira, nightwire, claude-style, claudesm).

### Added
- **Sparkline tooltips** — Hovering any bar in the NPM Downloads sparkline strip now shows a small tooltip with the weekly download count for that week.

### Changed
- **About & CV content refresh** — Updated lumira (~3.4K dl/mo) and nightwire (~475 dl/mo) download counts and descriptions to reflect current reality. Removed `claude-style` as a separate OSS entry (low traction). CV role title, summary, and LinkedIn URL updated.

---

## [1.10.15] - 2026-05-24

### Fixed
- ProofOfWork section now responsive on mobile: heatmap and stats grid stack vertically below md breakpoint, NPM sparkline strip wraps correctly on narrow viewports

---

## [1.10.14] - 2026-05-24

### Changed
- **Admin Nightwire redesign** — Removes the Blog Posts section from the admin sidebar (blog lives externally at blog.cativo.dev). Restyled sidebar with left-border active indicators, nav dots, and NAVIGATION stamp label. Dashboard replaced with a 4-cell metrics strip (Projects / Unread / Users / System LED) plus Recent Projects and Contacts panels. Projects, Contacts, and Users lists now use the nw-table pattern with blue stamp headers and semantic status badges. Login page redesigned with Nightwire panel frame and password show/hide eye toggle. (#114)
- **Homepage Nightwire polish** — New SVG favicon (void background, nw-primary C initial). Hero avatar gets a subtle nw-primary glow; OPERATOR/CLEARANCE/UNIT labels upgraded to nw-primary. Featured project card gains a 3px left accent and inner glow. LatestPosts panel header adds a blinking FEED · LIVE green LED. Contact form fields (BaseInput/Textarea) updated to Variant A: nw-primary-dim borders, sharp corners, 1px nw-primary focus ring. (#115)

---

## [1.10.13] - 2026-05-21

### Changed
- **`/now` content refresh** — AT WORK: gateway expansion + security hardening shipped, replaced with CCCV CRM; Payment Service moved to OWNING IN PRODUCTION. SIDE PROJECTS: LUMIRA ~1.9k dl/mo, added NIGHTWIRE and KOVIA. LEARNING: swapped self-hosted infra + writing for LLM evals/prompt engineering and payment network internals. LOOKING FOR: AI/payments focus, remote-only (dropped relocation), softer tone. (#112)

---

## [1.10.12] - 2026-05-21

### Fixed
- **`useNowPlaying` duplicate intervals** — Composable was instantiated in both `Footer.vue` and `now.vue`, creating two independent `setInterval` callbacks that each added 1000ms to the same shared `useState`. Result: 2s/tick progress jumps and periodic rewinds on every Spotify API poll. Intervals are now module-level singletons guarded by an `_activeConsumers` counter. (#110)

---

## [1.10.11] - 2026-05-21

### Changed
- Bump nightwire submodule to v2-alpha (530c4a8) — adds v2 semantic tokens,
  intensity system, and new components while keeping all v1 classes intact.

---

## [1.10.10] - 2026-05-15

### Changed
- **CV copy refresh on `/cv` and `/about`** — Generalized payments
  wording (processors described by protocol — ISO 8583, SOAP/XML, REST —
  not by vendor name) behind the existing Strategy-pattern abstraction.
  Softened FEL framing to "shipped through an authorized provider".
  Side projects (VittBot, nova-id, Clarify) now visibly tagged
  `personal · in development` to avoid implying they're shipped
  products; sofIA stays as "in production at Blue Medical". (#107)

### Added
- **Open Source · npm section on `/cv` and `/about`** — Surfaces
  published Claude Code tooling: `lumira` (~1.9K dl/mo), `claude-style`
  (~850 dl/mo), `nightwire` (~200 dl/mo). Strengthens AI-tooling
  positioning. (#107)

### Internal
- **`/release` skill + `release-runner` subagent** — Mechanical release
  flow per `AGENTS.md` (version bump, CHANGELOG validation, release
  branch + PR to main). No runtime impact. (#106)

---

## [1.10.9] - 2026-05-14

### Added
- **Global error page** — New `src/error.vue` (Nuxt 3 picks it up automatically). Renders uncaught errors and 404s in the Nightwire idiom (panel + compressed `[ERR-xxx]` title) inside `NuxtLayout`. Return-to-base button calls `clearError({ redirect: '/' })`. (#104, #30)
- **`BaseAsyncState` panel variant** — Non-breaking addition: `variant: 'plain' | 'panel'`, `panelHeader`, and `errorCode` props. Panel variant renders the full Nightwire shell so future adopters get the idiom for free. Loading branch now sets `role="status"`. JSDoc documents it as the canonical async wrapper, satisfying the `LoadingSpinner` / `ErrorMessage` intent of #30 under one component. (#104, #30)
- **Traefik security headers** — `traefik.http.routers.portfolio.middlewares=security-headers@file` label wired to the existing space-server middleware. HSTS (1y + includeSubdomains), X-Frame-Options DENY, X-Content-Type-Options nosniff, X-XSS-Protection now enforced on `cativo.dev`. (#103, #55)

### Changed
- **Healthcheck** — `compose.prod.yml` switches from a Node.js process (`node -e fetch(...)`) to busybox `wget -q --spider`. Same coverage (any non-2xx exits non-zero), near-zero CPU/memory cost, faster timeout (15s → 10s). (#103, #55)
- **Compose hygiene** — Dropped the redundant `traefik.docker.network=space-server_web` label. The service is on a single network; Traefik auto-detects. (#103, #55)

---

## [1.10.8] - 2026-05-14

### Fixed
- **Prod runtime env wiring** — Wired `NUXT_API_BASE_URL` / `NUXT_API_BASE_PATH` / `NUXT_API_TOKEN` into `compose.prod.yml` with `:?` guards. v1.10.7 dropped the hardcoded fallbacks in `runtimeConfig` but the compose was never updated to pass them, so server-side `$fetch` in `projects.get.ts` / `profile.get.ts` resolved to relative paths and looped back into Nitro, allocating ~30 MB/s until the V8 heap cap killed the container ~130 s after start. (#99)
- **Spotify env naming** — Renamed `SPOTIFY_*` → `NUXT_SPOTIFY_*` so Nuxt 3's `NUXT_`-prefix runtime override actually populates `runtimeConfig.spotify*`. Spotify credentials now reach the container. (#99)
- **Container memory guard** — Added `mem_limit: 1g` and lowered `--max-old-space-size` from 4096 to 768 so a future regression dies cleanly via cgroup OOM instead of dragging the host. (#99)
- **Type safety** — Replaced `as any` in `health.get.ts` with an `isHealthType` predicate; dropped `: any` in `projects.get.ts` via local narrowing. (#100, #68)

### Added
- **Mobile menu focus trap** — New `useFocusTrap` composable; the mobile nav drawer now traps Tab/Shift+Tab, closes on Escape, and restores focus to the trigger on close. Covered by 7 unit tests. (#101, #67)
- **Image optimization** — Enabled the bundled `ipx` provider for `@nuxt/image`; below-fold images get explicit `loading="lazy"`. `Hero.vue` avatar stays `eager` as above-the-fold. (#101, #67)

### Changed
- **Code quality** — Extracted `DEFAULT_SCRAMBLE_SPEED_MS`, `DEFAULT_MAX_ITERATIONS`, `OBSERVER_THRESHOLD` constants in `DecryptedText.vue` (no more inline magic numbers); normalized `<script setup lang="ts">` attribute order across 12 .vue files. (#100, #68)

---

## [1.10.7] - 2026-05-14

### Fixed
- **Memory Limit** — Increased Node.js heap memory limit to 4096MB in `compose.prod.yml` to resolve OOM crashes on startup.

---

## [1.10.6] - 2026-05-14

### Fixed
- **Spotify Config** — Updated configuration to use NUXT_ prefix for production env var injection.

---

## [1.10.5] - 2026-05-14

### Fixed
- **Spotify Config** — Updated production environment variables to use NUXT_ prefix and injected via deployment pipeline.

---

## [1.10.4] - 2026-05-13

### Added
- **Spotify Now Playing Widget** — Integrated live Spotify tracking via server-side polling. Features a sticky footer indicator and a detailed panel on the `/now` page.

### Changed
- **Deployment** — Injected `SPOTIFY_*` environment variables into the production deployment pipeline via GitHub Secrets.

### Fixed
- **CI/CD** — Addressed code review feedback: extracted shared UI components for equalizer bars, added progress bar interpolation, and improved API error handling/logging.

---

## [1.10.3] - 2026-05-07

### Fixed
- **POW signal token actually reaching Nuxt runtime** — Map the `POW_GH_TOKEN` repo secret onto `NUXT_GITHUB_TOKEN` (not `POW_GH_TOKEN`) inside the container. Nuxt runtime config only overrides `runtimeConfig.githubToken` from env vars matching the `NUXT_*` + key pattern; the previous mapping left the runtime token empty and the GitHub GraphQL call returning an early-fallback zero. POW heatmap now shows real contribution data.

---

## [1.10.2] - 2026-05-07

### Fixed
- **Prod healthcheck timeout** — Bumped `compose.prod.yml` healthcheck `timeout` 5s → 15s and `start_period` 10s → 30s. The home-page SSR now takes ~6s due to the POW signal data, which was causing every healthcheck to fail and Traefik to stop routing traffic (404s on cativo.dev).

---

## [1.10.1] - 2026-05-07

### Fixed
- **POW signal token wiring** — Renamed runtime env from `GITHUB_TOKEN` to `POW_GH_TOKEN` to avoid clashing with the Actions auto-injected token. Threaded the secret through the SSH deploy step and the prod compose file (with `:?` fail-fast) so the GitHub GraphQL call in `/api/signal` actually authenticates in production.
- **Dev compose parity** — `compose.yml` now passes `POW_GH_TOKEN` instead of the orphaned `GITHUB_TOKEN`, so local Docker dev gets real GitHub data.

### Added
- **`.env.example`** — Documents the required `NUXT_API_TOKEN` and `POW_GH_TOKEN` env vars for new contributors.

---

## [1.10.0] - 2026-05-07

### Added
- **Proof of Work panel** — Live signal dashboard with GitHub contribution heatmap, NPM download sparklines, and API health status. Data fetched from `/api/signal` (cached 1hr).
- **NPM weekly sparklines** — Per-package download trend bars (Lumira, Nightwire, Claude-Setup) with real weekly data from the NPM registry.
- **Month axis on heatmap** — Temporal labels (OCT, NOV, ...) below the contribution grid for context.
- **Scroll-triggered reveals** — `reveal.client.ts` plugin using IntersectionObserver for below-fold fade-in animations.

### Changed
- **Heatmap layout (Combo C)** — Responsive cells (`flex:1` + `aspect-ratio:1`) fill available width. Stats grid expanded to 2x3 with API/Status moved from metrics strip.
- **Metrics strip** — Reduced from 8 to 4 focused cells (Years, Tech Lead, Specialty, Containers).
- **Featured project cards** — First card spans full width with accent border and larger title.
- **Contact page** — Rewritten with Nightwire panels (Direct Channels grid + Send a Message form).
- **Blog truncation** — Word-boundary cut at 140 chars instead of hard slice at 200.
- **Typography** — GPU-accelerated compressed titles, `.title-card-lg` token, `.text-meta` prose utility.

### Fixed
- **Hero layout** — Removed extra wrapper causing spacing inconsistency.
- **About page XSS** — `formatSummaryParagraph()` now HTML-escapes input before regex highlights.
- **Heatmap color contrast** — 5-level blue ramp with distinct steps for low-activity cells.

---

## [1.9.0] - 2026-05-01

### Added
- **Nightwire design system** — Adopted as a git submodule (`.nightwire`); design tokens, components, and skill docs now travel with the project.
- **`/cv` page** — Printable, ATS-friendly CV view with a downloadable `resume.pdf` generated by `scripts/build-cv-pdf.sh`.
- **`/now` page** — Status report covering active work, side projects, learning, and what I'm looking for next.
- **Blog RSS integration** — `/api/blog/latest` (cached 30 min) feeds a `LatestPosts` component on home and `/about`.

### Changed
- **Visual migration** — Hero, About, Now, Projects, Contact, Health, and admin pages restyled to the Nightwire dark-cyberpunk aesthetic (panels, kanji decorations, LED status indicators, military-stamp typography, compressed serif headlines).
- **Job-hunt repositioning** — Senior backend / Tech Lead / Staff framing across hero, about, and now. Remote-first, open to relocation.
- **Content scrub** — Length cut ~40% on About and Now per copy audit; confidentiality scrubbed (no internal feature names, vendor names, or hostnames).
- **Typography homogenized** — Body 19–20px, dedicated `.text-meta` and `.title-card` utilities replace ad-hoc 9–11px ghost text on prose pages.

### Fixed
- **`/projects/[id]` SEO** — Replaced `usePageTitle`-inside-`watch` with a reactive `useSeoMeta`; the title now updates correctly on client-side navigation.
- **`isValidLiveUrl`** — Removed misleading allowlist branch that was bypassed by the hostname-dot fallback.
- **Component test suite** — 22 tests updated to assert Nightwire class names (`.led`, `bg-nw-*`, `tag-success`, etc.) instead of legacy Tokyonight tokens.
- **CI** — Build jobs now check out the `.nightwire` submodule (required by the Tailwind preset).

---

## [1.8.2] - 2026-05-01

### Changed
- **CI** — Bumped `actions/checkout` from v4 to v5 across all workflows to stay ahead of the Node.js 20 → 24 deprecation on GitHub Actions runners.

### Fixed
- **Deploy** — Restored automatic production deploys after migrating the server from homelab to Hetzner. Updated `SSH_HOST`, `SSH_PORT`, and `SSH_PRIVATE_KEY` secrets in the `prod` environment.

---

## [1.8.1] - 2026-05-01

### Fixed
- **Docker Build** — Removed `better-sqlite3` and sqlite dependencies from production Dockerfile after blog removal
- **Test Suite** — Fixed 30 failing tests by updating mocking strategy to use `globalThis` instead of `vi.stubGlobal`

---

## [1.8.0] - 2026-05-01

### Changed
- **About Page Rewrite** — Replaced API-fetched bio with hardcoded static copy. New sections: Hero, Background, Experience timeline, Stack, Featured Projects, Outside Code, and Closing.
- **Side Projects → Featured Projects** — About page now reuses the `PortfolioSection` component to display live featured projects from the API instead of a static list.
- **Page Transition Fix** — Fixed horizontal overflow caused by Vue page transitions pushing content off-screen to the right.

### Removed
- **Blog** — Removed all blog content, pages (`/blog/*`), admin blog management, and related components after migrating to Ghost at `blog.cativo.dev`.
- **Blog Dependencies** — Uninstalled `@nuxt/content`, `@nuxtjs/mdc`, and `better-sqlite3`.
- **AdminMarkdownEditor** — Removed unused markdown editor component.

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
