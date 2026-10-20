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
    githubTokenWork: '',
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
    // Enforced. A full-site browser audit (every page + all project detail pages +
    // the chat widget), cross-checked against /api/csp-report logs, found zero
    // script/style/connect violations — only images from external hosts (Spotify
    // album art, README badges in project markdown). img-src is permissive (https:)
    // below to cover those; report-uri stays wired so enforced violations are logged.
    contentSecurityPolicyReportOnly: false,
    headers: {
      contentSecurityPolicy: {
        // Strict scripts: nonce + strict-dynamic only (no 'unsafe-inline'/'https:').
        // nuxt-security nonces Nuxt's hydration script and the JSON-LD block.
        // 'self' is a CSP2 fallback (ignored by CSP3 browsers under strict-dynamic);
        // 'report-sample' includes a snippet of the offender in report-only reports.
        'script-src': ["'self'", "'strict-dynamic'", "'nonce-{{nonce}}'", "'report-sample'"],
        // Inline style="" attributes (clamp(), CSS vars) can't be nonced, so
        // 'unsafe-inline' is required for styles; plus the Google Fonts CSS host.
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        // Client only ever calls its own /api/* BFF routes.
        'connect-src': ["'self'"],
        // Permissive for images only: project markdown (README-style) embeds
        // badges/screenshots from arbitrary hosts (img.shields.io, Spotify's
        // i.scdn.co, future CDNs). Images can't execute code, so `https:` here
        // is low-risk while script-src/style-src stay strict (nonce+strict-dynamic).
        'img-src': ["'self'", 'data:', 'https:'],
        'report-uri': ['/api/csp-report'],
      },
      // COEP would block the cross-origin Google Fonts; not needed for this site.
      crossOriginEmbedderPolicy: false,
    },
    // The backend (api.cativo.dev) owns rate limiting; don't double-limit the BFF.
    rateLimiter: false,
    // xssValidator stays ON globally (free defense for admin/structured routes);
    // it's disabled per-route below only where free text legitimately flows.
  },
  routeRules: {
    // These endpoints receive arbitrary free text / report payloads that can
    // contain '<', 'script', etc. The XSS validator would reject legitimate
    // input; the backend sanitizes the forwarded chat/contact content.
    '/api/chat': { security: { xssValidator: false } },
    '/api/contacts': { security: { xssValidator: false } },
    '/api/csp-report': { security: { xssValidator: false } },
  },
})
