// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  debug: process.env.NODE_ENV !== 'production',
  runtimeConfig: {
    public: {
      baseTitle: 'Carlos Cativo',
      defaultOgImage: '/img/akira.jpeg',
      defaultOgUrl: 'https://cativo.dev',
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
      apiToken: process.env.API_TOKEN || '',
    },
  },
  srcDir: 'src/',
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  typescript: {
    typeCheck: true
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
  compatibilityDate: '2024-11-01',
  modules: ['@nuxtjs/tailwindcss', '@nuxt/content', 'nuxt-lucide-icons', '@nuxthub/core', 'motion-v/nuxt'],
  builder: "vite",
})