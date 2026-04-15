import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    root: '.',
    include: ['tests/**/*.test.ts'],
    coverage: {
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/pages/**/*', 'src/layouts/**/*', 'src/middleware/**/*'],
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
      '#app': resolve(__dirname, '.nuxt/imports.d.ts'),
    },
  },
})
