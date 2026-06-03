// https://nuxt.com/docs/api/configuration/nuxt-config
const isDocker = process.env.NITRO_PRESET === 'node-server'

const baseModules: string[] = ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap', 'nuxt-lucide-icons', 'motion-v/nuxt', '@nuxt/image', '@nuxtjs/mdc', 'nuxt-security']
const modules = isDocker ? baseModules : [...baseModules, '@nuxthub/core']

export default defineNuxtConfig({
  css: [
    'assets/css/main.css',
  ],
  build: {
    transpile: ['debug'],
  },
  nitro: {
    externals: {
      external: ['better-sqlite3'],
    },
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
  },
  debug: process.env.NODE_ENV !== 'production',
  runtimeConfig: {
    apiBaseUrl: '',
    apiBasePath: '',
    apiToken: '',
    githubToken: '',
    spotifyClientId: '',
    spotifyClientSecret: '',
    spotifyRefreshToken: '',
    public: {
      baseTitle: 'Carlos Cativo',
      defaultOgImage: '/img/akira.jpeg',
      defaultOgUrl: 'https://cativo.dev',
    },
  },
  srcDir: 'src/',
  serverDir: 'src/server',
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  typescript: {
    typeCheck: 'build'
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
        class: "h-full",
      },
      bodyAttrs: {
        class: "antialiased bg-void text-nw-text font-sys min-h-screen",
      },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Saira+Extra+Condensed:wght@400;600;700;800&family=Shippori+Mincho+B1:wght@500;700;800&display=swap'
        },
      ],
    },
  },
  dir: {
    public: 'src/public',
  },
  site: {
    url: 'https://cativo.dev',
    name: 'Carlos Cativo - Backend Developer',
  },
  compatibilityDate: '2024-11-01',
  modules,
  builder: "vite",
  image: {
    provider: 'ipx',
  },
  security: {
    // Phase 1: report-only. The browser reports violations to /api/csp-report
    // but nothing is blocked. Flip to `false` to enforce once reports are clean.
    contentSecurityPolicyReportOnly: true,
    headers: {
      contentSecurityPolicy: {
        // Strict scripts: nonce + strict-dynamic only (no 'unsafe-inline'/'https:').
        // nuxt-security nonces Nuxt's hydration script and the JSON-LD block.
        'script-src': ["'self'", "'strict-dynamic'", "'nonce-{{nonce}}'"],
        // Inline style="" attributes (clamp(), CSS vars) can't be nonced, so
        // 'unsafe-inline' is required for styles; plus the Google Fonts CSS host.
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        // Client only ever calls its own /api/* BFF routes.
        'connect-src': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'report-uri': ['/api/csp-report'],
      },
      // COEP would block the cross-origin Google Fonts; not needed for this site.
      crossOriginEmbedderPolicy: false,
    },
    // The backend (api.cativo.dev) owns rate limiting; don't double-limit the BFF.
    rateLimiter: false,
    // The /api/chat and /api/contact BFF routes forward arbitrary free text that
    // can look like XSS payloads; the backend sanitizes. Don't block legit input.
    xssValidator: false,
  },
})
