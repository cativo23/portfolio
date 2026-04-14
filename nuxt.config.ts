// https://nuxt.com/docs/api/configuration/nuxt-config
const isDocker = process.env.NITRO_PRESET === 'node-server'

const baseModules: string[] = ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap', '@nuxt/content', 'nuxt-lucide-icons', 'motion-v/nuxt', '@nuxt/image', '@nuxtjs/mdc']
const modules = isDocker ? baseModules : [...baseModules, '@nuxthub/core']

export default defineNuxtConfig({
  css: [
    'assets/css/main.css',
    '@toast-ui/editor/dist/toastui-editor.css',
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
    optimizeDeps: {
      include: ['extend'],
    },
  },
  debug: process.env.NODE_ENV !== 'production',
  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_API_BASE_URL || 'http://api:3000',
    apiBasePath: process.env.NUXT_API_BASE_PATH || '/api/v1',
    apiToken: process.env.NUXT_API_TOKEN || '',
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
  content: {
    watch: {
      enabled: true,
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
  image: {
    provider: 'none',
  },
})
