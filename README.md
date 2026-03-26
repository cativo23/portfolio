<pre align="center">
    ____             __  ____      ___
   / __ \____  _____/ /_/ __/___  / (_)___
  / /_/ / __ \/ ___/ __/ /_/ __ \/ / / __ \
 / ____/ /_/ / /  / /_/ __/ /_/ / / / /_/ /
/_/    \____/_/   \__/_/  \____/_/_/\____/
</pre>

<p align="center">
  <a href="https://github.com/cativo23/portfolio/actions/workflows/ci.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/cativo23/portfolio/ci.yml?branch=main&label=build&logo=github" alt="Build Status" />
  </a>
  <a href="https://github.com/cativo23/portfolio/releases">
    <img src="https://img.shields.io/github/v/release/cativo23/portfolio?label=version&logo=github" alt="Version" />
  </a>
  <a href="https://github.com/cativo23/portfolio/blob/develop/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
  </a>
  <a href="https://cativo.dev">
    <img src="https://img.shields.io/badge/demo-live-green" alt="Live Demo" />
  </a>
</p>

---

## Overview

Personal portfolio and tech blog built with **Nuxt 4** and **Vue 3**. A modern terminal-style platform showcasing projects, articles, and professional experience with a minimalist, retro-futuristic aesthetic.

The project solves the need for an online presence with unique identity, combining terminal design (inspired by real IDEs and terminals) with modern web development best practices: SSR, SEO optimization, and automated deployment.

---

## ✨ Features

- **Terminal UI/UX Design** - Retro console aesthetic with Tokyo Night color palette
- **Markdown Blog** - Content system powered by `@nuxt/content` v3 and MDC
- **Real-time Health Check** - API monitoring with status indicators
- **SEO Optimized** - Sitemap, RSS, JSON-LD, and automatic meta tags
- **Automated CI/CD** - GitHub Actions for build, test, and deploy
- **Docker Ready** - Containers for development and production
- **Type-Safe** - Strict TypeScript throughout the codebase
- **Testing** - Vitest unit tests with >80% coverage

---

## 🛠 Tech Stack

| Stack | Version | Purpose |
|-------|---------|---------|
| **Nuxt** | 4.4.x | SSR/SSG Framework |
| **Vue** | 3.x | Reactive Framework |
| **TypeScript** | 5.8.x | Type safety |
| **TailwindCSS** | 6.x | Utility-first CSS |
| **Vitest** | 3.2.x | Unit testing |
| **@nuxt/content** | 3.12.x | Markdown blog |
| **Motion-V** | 1.2.x | Animations |
| **Better-SQLite3** | 11.10.x | Local database |
| **Wrangler** | 4.20.x | Cloudflare Workers |

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/cativo23/portfolio.git
cd portfolio

# 2. Install dependencies
yarn install

# 3. Run dev server
yarn dev
```

### Using Docker

```bash
# Development
docker compose up -d

# Production
docker compose -f compose.prod.yml up -d
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📐 Architecture

```
portfolio/
├── src/
│   ├── app.vue              # Entry point
│   ├── pages/               # File-based routing
│   │   ├── index.vue        # Home
│   │   ├── about.vue        # About me
│   │   ├── blog/            # Blog posts
│   │   ├── projects/        # Projects showcase
│   │   └── health.vue       # System health status
│   ├── components/          # Vue components
│   │   ├── base/            # Base components (Button, Card, Section)
│   │   ├── ui/              # UI primitives (StatusIndicator, Badges)
│   │   └── {page}/          # Page-specific components
│   ├── composables/         # Reusable composables
│   ├── server/api/          # Server routes (H3)
│   │   ├── health.get.ts    # Health check endpoint
│   │   └── projects.get.ts  # Projects API
│   └── types/               # TypeScript types
├── .github/workflows/       # CI/CD pipelines
├── docker/                  # Docker configs
└── compose.yml              # Docker Compose
```

**Data Flow:**
1. Pages use `useFetch`/`useAsyncData` for SSR
2. Server routes in `src/server/api/` proxy to external API
3. Composables centralize state logic

---

## 📚 Documentation

- [Nuxt 4 Docs](https://nuxt.com/docs)
- [Vue 3 Docs](https://vuejs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [AGENTS.md](./AGENTS.md) - Development and contribution guide

---

## 🧪 Testing

```bash
# Run all tests
yarn test

# Watch mode
yarn test:watch

# Coverage report
yarn test:cov
```

---

## 📦 Deployment

### Docker (Production)

```bash
# Build and run
docker compose -f compose.prod.yml up -d

# View logs
docker compose -f compose.prod.yml logs -f
```

### GitHub Actions

- **CI**: Build + type check on every PR
- **Auto-Release**: Creates release when merging to `main`
- **Deploy**: Automatic deploy on release tags

---

## License

MIT © [Carlos Cativo](https://github.com/cativo23)
