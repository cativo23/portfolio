<!-- Copilot instructions for contributors and AI coding agents -->
# Copilot / AI agent instructions — Portfolio

Purpose: Give AI coding agents the minimum, actionable context to be productive in this Nuxt 3 portfolio repository.

- **Project type:** Nuxt 3 single-repo site (SSR/Static) with `src/` as source directory. See [nuxt.config.ts](nuxt.config.ts).
- **Content source:** Blog and pages are authored as Markdown under [content/blog](content/blog). The site uses `@nuxt/content` to read Markdown.
- **Frontend:** Vue 3 (Composition API) components in [src/components](src/components) and page entries in [src/pages](src/pages).
- **Composables & types:** Reusable logic lives in [src/composables](src/composables) (example: `usePageTitle.ts`). Type definitions live in [types](types) (example: `types/meta.ts`).

Key developer workflows (commands):

- Local dev: `yarn dev` (or `npm run dev` / `pnpm dev`) — runs Nuxt dev server. See `scripts` in [package.json](package.json).
- Build: `yarn build` then `yarn preview` to locally verify production bundle.
- Static generation: `yarn generate` (keeps site-compatible with static hosts).
- Install deps in Docker: see README and the provided `docker` examples. A reproducible install example: `docker run --rm -v $(pwd):/app -w /app --user node node:22-alpine yarn install`.
- Type checking: `vue-tsc` is available in `devDependencies`; Nuxt's `typescript.typeCheck` is enabled in [nuxt.config.ts](nuxt.config.ts).

Important architecture and patterns (do not change without ensuring site still builds):

- `srcDir` is set to `src/` in [nuxt.config.ts](nuxt.config.ts) — all app files live under `src/`.
- The content pipeline: markdown files in [content/blog](content/blog) -> `@nuxt/content` -> pages under [src/pages/blog](src/pages/blog) (look for `[...slug].vue`).
- Components are grouped by feature: `src/components/home`, `src/components/main`, `src/components/about`, `src/components/home/blog` etc. Follow existing grouping when adding components.
- Visual/theme: TailwindCSS + `@nuxtjs/tailwindcss` and `@tailwindcss/typography` are used (see [nuxt.config.ts](nuxt.config.ts) and `tailwind.config.js`). Keep classes consistent with the existing utility-based style.

Project-specific conventions and gotchas:

- Prefer Composition API composables under `src/composables`. Example: keep page-title logic in `usePageTitle.ts`.
- Centralized metadata: `types/meta.ts` holds shared metadata shapes — use it for site/meta types.
- Animation and transitions use `motion-v` and Nuxt page transitions defined in `nuxt.config.ts` — maintain the `page` transition naming when modifying transitions.
- Blog code blocks highlight a curated set of languages; if adding new code languages, update `nuxt.config.ts` content build settings.

Integration points and external dependencies:

- `@nuxt/content` reads `content/` Markdown.
- `better-sqlite3` is present as a dependency — investigate `server/` if you need server-side persistence.
- The project uses Vite as the builder (see `builder: 'vite'` in [nuxt.config.ts](nuxt.config.ts)).

Where to look when making feature changes:

- Routing/pages: [src/pages](src/pages) — dynamic blog route: [src/pages/blog/[...slug].vue](src/pages/blog/[...slug].vue).
- Layouts and root: [src/app.vue] and [src/components/main/Header.vue], [src/components/main/Footer.vue].
- Content: [content/blog] for post sources and frontmatter patterns.
- Docker and deploy: `compose.yml`, `compose.prod.yml`, and Dockerfiles under `docker/`.
- Code-review notes and prioritized fixes: [code-review/README.md](code-review/README.md).

Behavior to avoid (observed from repo):

- Do not change `srcDir` without updating `nuxt.config.ts` and CI/deploy scripts.
- Avoid introducing global CSS changes outside `src/assets/css/main.css` without reviewing Tailwind configuration.

If you modify code, validate locally:

1. `yarn install` (or docker install command in README)
2. `yarn dev` — sanity-check pages and blog posts
3. `yarn build` && `yarn preview` — ensure production build has no errors
4. Run TypeScript check if you've changed types or interfaces (`vue-tsc` or rely on Nuxt type checking)

Questions or unclear areas — ask the repo owner or open an issue. After edits, point to changed areas and provide a short verification checklist.

---
If this file should include more specifics (CI, linting rules, or deploy steps), tell me which area to expand.
