<template>
  <section class="mb-16">
    <BaseSectionHeading title="Latest Blog Posts" animated :level="3" />
    <div class="space-y-6">
      <LatestBlogPostCard v-for="post in blogPosts" :key="post.path || post.title" :post="post" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { BlogPost } from '~/types/blog'
import LatestBlogPostCard from '~/components/home/blog/LatestBlogPostCard.vue'

const { data: posts } = await useAsyncData('latest-blog-posts', () => {
  return queryCollection('blog')
    .order('created_at', 'DESC')
    .all()
})

const blogPosts = computed(() => {
  if (!posts.value) return []

  return posts.value.slice(0, 3).map((post): BlogPost => ({
    title: post.title || '',
    description: post.description,
    excerpt: post.description,
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
