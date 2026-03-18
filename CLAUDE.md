# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
yarn install

# Development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Generate static site
yarn generate

# Type checking
vue-tsc --noEmit

# Docker development
docker compose up -d
```

## Architecture

**Nuxt 3** portfolio site with `srcDir: 'src/'` configuration. Key patterns:

- **Content**: Blog posts in `content/blog/*.md` processed by `@nuxt/content` with Zod schema validation (`content.config.ts`)
- **Pages**: File-based routing in `src/pages/` — blog uses catch-all route `blog/[...slug].vue`
- **Components**: Organized by feature domain (`home/`, `about/`, `main/`, `ui/`)
- **Composables**: Reusable logic in `src/composables/` (e.g., `usePageTitle`, `useProjects`)
- **Types**: Shared interfaces in `src/types/` (`Project`, `BlogPost`, `MetaOptions`, `PaginationMeta`)

## External API Integration

Projects are fetched from an external API (not Nuxt Content). The `useProjects` composable handles:
- API calls to `public.apiBaseUrl` with optional `ApiKey` auth token
- Response normalization for shape `{ status, data, meta }`
- Loading/error state management

## Theming

**TailwindCSS** with custom Tokyo Night color palette (`tailwind.config.js`). Custom `prose-tokyo` typography plugin for markdown content styling.

## Docker

- Dev: `docker/dev/Dockerfile` with hot reload volume mounts
- Prod: `docker/prod/Dockerfile` multi-stage build outputting to `.output/`

## Where to Look

| Change | File(s) |
|--------|---------|
| Add page | `src/pages/*.vue` |
| Add blog post | `content/blog/*.md` |
| Add component | `src/components/{feature}/` |
| Modify theme | `tailwind.config.js`, `src/assets/css/` |
| Change SEO defaults | `nuxt.config.ts`, `src/composables/usePageTitle.ts` |
| API integration | `src/composables/useProjects.ts`, `src/types/pagination.ts` |

## Code Review & Debt

- `code-review/CODE_REVIEW.md` — architectural findings and recommendations
- `code-review/TECHNICAL_DEBT.md` — prioritized backlog with effort estimates
