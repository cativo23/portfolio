<pre align="center">
 ____           _              ____      _   _
/ ___|__ _ _ __| | ___  ___   / ___|__ _| |_(_)_   _____
| |   / _` | '__| |/ _ \/ __| | |   / _` | __| \ \ / / _ \
| |__| (_| | |  | | (_) \__ \ | |__| (_| | |_| |\ V / (_) |
\____\__,_|_|  |_|\___/|___/  \____\__,_|\__|_| \_/ \___/
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

Portfolio personal y blog técnico construido con **Nuxt 4** y **Vue 3**. Una plataforma moderna tipo terminal que muestra proyectos, artículos y experiencia profesional con una estética minimalista y retro-futurista.

El proyecto resuelve la necesidad de tener presencia online con identidad propia, combinando diseño terminal (inspirado en IDEs y terminales reales) con las mejores prácticas de desarrollo web moderno: SSR, SEO optimizado, y deployment automatizado.

---

## ✨ Features

- **Diseño Terminal UI/UX** - Estética retro tipo consola con paleta Tokyo Night
- **Blog con Markdown** - Sistema de contenido con `@nuxt/content` v3 y MDC
- **Health Check en Tiempo Real** - Monitoreo de API con indicadores de estado
- **SEO Optimizado** - Sitemap, RSS, JSON-LD y meta tags automáticos
- **CI/CD Automatizado** - GitHub Actions para build, test y deploy
- **Docker Ready** - Contenedores para desarrollo y producción
- **Type-Safe** - TypeScript estricto en todo el código
- **Testing** - Vitest para unit tests con cobertura >80%

---

## 🛠 Tech Stack

| Stack | Versión | Propósito |
|-------|---------|-----------|
| **Nuxt** | 4.4.x | Framework SSR/SSG |
| **Vue** | 3.x | Framework reactivo |
| **TypeScript** | 5.8.x | Type safety |
| **TailwindCSS** | 6.x | Estilos utilitarios |
| **Vitest** | 3.2.x | Unit testing |
| **@nuxt/content** | 3.12.x | Blog markdown |
| **Motion-V** | 1.2.x | Animaciones |
| **Better-SQLite3** | 11.10.x | Base de datos local |
| **Wrangler** | 4.20.x | Cloudflare Workers |

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/cativo23/portfolio.git
cd portfolio

# 2. Install
yarn install

# 3. Run dev server
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000)

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
1. Pages usan `useFetch`/`useAsyncData` para SSR
2. Server routes en `src/server/api/` hacen proxy a API externa
3. Composables centralizan lógica de estado

---

## 📚 Documentation

- [Nuxt 4 Docs](https://nuxt.com/docs)
- [Vue 3 Docs](https://vuejs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [AGENTS.md](./AGENTS.md) - Guía de desarrollo y contribución

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

### Docker (Producción)

```bash
# Build and run
docker compose -f compose.prod.yml up -d

# View logs
docker compose -f compose.prod.yml logs -f
```

### GitHub Actions

- **CI**: Build + type check en cada PR
- **Auto-Release**: Crea release al mergear a `main`
- **Deploy**: Deploy automático en release tags

---

## License

MIT © [Carlos Cativo](https://github.com/cativo23)
