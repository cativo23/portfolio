<template>
  <div class="panel">
    <div class="panel-header">
      <div class="flex items-center gap-3">
        <span>WRITING · LATEST</span>
        <span class="flex items-center gap-1.5 text-nw-green font-stamp text-[8px] tracking-[0.12em] uppercase">
          <span class="led green blink" aria-hidden="true" />
          FEED · LIVE
        </span>
      </div>
      <a
        href="https://blog.cativo.dev"
        target="_blank"
        rel="noopener noreferrer"
        class="text-nw-primary hover:text-nw-primary-hot text-[10px] font-stamp uppercase tracking-wider"
      >
        BLOG.CATIVO.DEV →
      </a>
    </div>
    <div class="panel-body p-0">
      <template v-if="pending">
        <div class="p-6 text-nw-text-dim font-stamp uppercase tracking-wider text-xs text-center" role="status">
          Loading feed…
        </div>
      </template>

      <template v-else-if="!posts.length">
        <div class="p-6 text-nw-text-dim font-stamp uppercase tracking-wider text-xs text-center">
          Feed unavailable —
          <a href="https://blog.cativo.dev" target="_blank" rel="noopener noreferrer" class="text-nw-primary hover:text-nw-primary-hot">read on blog.cativo.dev →</a>
        </div>
      </template>

      <template v-else>
        <a
          v-for="post in posts"
          :key="post.url"
          :href="post.url"
          target="_blank"
          rel="noopener noreferrer"
          class="block px-5 py-4 border-b border-nw-text-faint last:border-b-0 hover:bg-void-panel transition-colors"
        >
          <div class="flex items-baseline justify-between gap-3 mb-1">
            <h3 class="text-nw-text font-medium title-card leading-snug">{{ post.title }}</h3>
            <span class="font-stamp uppercase tracking-wider text-[9px] text-nw-text-dim shrink-0">
              {{ formatDate(post.pubDate) }}
            </span>
          </div>
          <p class="text-meta line-clamp-2">{{ post.description }}</p>
        </a>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BlogPost {
  title: string
  url: string
  pubDate: string
  description: string
}

interface Response {
  status: 'success' | 'error'
  data: BlogPost[]
}

const { data, pending } = await useFetch<Response>('/api/blog/latest', {
  lazy: false,
  server: true,
  default: () => ({ status: 'success' as const, data: [] }),
})

const posts = computed(() => data.value?.data ?? [])

function formatDate(isoOrRfc: string): string {
  if (!isoOrRfc) return ''
  const d = new Date(isoOrRfc)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
