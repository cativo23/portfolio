// https://nuxt.com/docs/api/configuration/nuxt-config
const isDocker = process.env.NITRO_PRESET === 'node-server'

const baseModules: string[] = ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap', 'nuxt-lucide-icons', 'motion-v/nuxt', '@nuxt/image', '@nuxtjs/mdc']
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
    apiBaseUrl: process.env.NUXT_API_BASE_URL || 'http://api:3000',
    apiBasePath: process.env.NUXT_API_BASE_PATH || '/api/v1',
    apiToken: process.env.NUXT_API_TOKEN || '',
    githubToken: process.env.POW_GH_TOKEN || '',
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
    provider: 'none',
  },
})
