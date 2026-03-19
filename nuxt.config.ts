// https://nuxt.com/docs/api/configuration/nuxt-config
const isDocker = process.env.NITRO_PRESET === 'node-server'

const baseModules: string[] = ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap', '@nuxt/content', 'nuxt-lucide-icons', 'motion-v/nuxt', '@nuxt/image']
const modules = isDocker ? baseModules : [...baseModules, '@nuxthub/core']

export default defineNuxtConfig({
  debug: process.env.NODE_ENV !== 'production',
  runtimeConfig: {
    apiBaseUrl: process.env.API_BASE_URL || 'http://host.docker.internal:3003',
    apiBasePath: '/api/v1',
    apiToken: process.env.API_TOKEN || '',
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
    typeCheck: process.env.NODE_ENV !== 'production'
  },
  content: {
    watch: {
      enabled: false,
    },
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'tokyo-night',
            dark: 'tokyo-night',
            light: 'tokyo-night',
          },
          langs: ['c', 'php', 'typescript', 'json', 'html', 'css', 'scss', 'bash', 'js'],
        },
      },
    }
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      htmlAttrs: {
        lang: "en",
        class: "h-full",
      },
      bodyAttrs: {
        class: "antialiased bg-gray-50 dark:bg-black min-h-screen",
      },
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
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
  },
  image: {
    // Use IPX provider for image optimization
    provider: 'ipx',
    ipx: {
      maxAge: 3600,
    },
  },
})