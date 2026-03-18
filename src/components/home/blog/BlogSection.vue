<template>
  <section class="mb-16">
    <h3 class="text-2xl font-bold mb-6">
      <DecryptedText text="Latest Blog Posts" animateOn="view" class="text-tokyo-night-cyan font-bold"
        encryptedClassName="text-opacity-60" :speed="40" :maxIterations="10" :sequential="true"
        revealDirection="start" />
    </h3>
    <div class="space-y-6">
      <LatestBlogPostCard v-for="post in blogPosts" :key="post.path || post.title" :post="post" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import LatestBlogPostCard from './LatestBlogPostCard.vue'
import type { BlogPost } from '~/types/blog'

const { data: posts } = await useAsyncData('latest-blog-posts', () => {
  return queryCollection('blog')
    .order('created_at', 'DESC')
    .all()
})

const blogPosts = computed(() => {
  if (!posts.value) return []
  
  // Take only the first 3 posts
  return posts.value.slice(0, 3).map((post): BlogPost => ({
    title: post.title || '',
    description: post.description,
    excerpt: post.description, // Use description as excerpt
    created_at: post.created_at,
    date: formatDate(post.created_at),
    path: post.path,
    image: post.image,
    author: post.author,
    tags: post.tags,
  }))
})

function formatDate(dateString?: string | Date) {
  if (!dateString) return ''
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

