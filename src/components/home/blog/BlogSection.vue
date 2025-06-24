<template>
  <section class="mb-16">
    <h3 class="text-2xl font-bold mb-6">
      <DecryptedText text="Latest Blog Posts" animateOn="view" class="text-tokyo-night-cyan font-bold"
        encryptedClassName="text-opacity-60" :speed="40" :maxIterations="10" :sequential="true"
        revealDirection="start" />
    </h3>
    <div class="space-y-6">
      <div v-for="post in blogPosts" :key="post.title">
        <LatestBlogPostCard :post="post" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import LatestBlogPostCard from './LatestBlogPostCard.vue';

const blogPosts = ref([
  { title: 'Optimizing Database Queries for Scale', excerpt: 'Learn how to optimize your database queries to handle millions of requests.', date: 'June 15, 2024' },
  { title: 'Building Resilient Microservices', excerpt: 'Explore strategies for creating fault-tolerant and scalable microservices.', date: 'May 22, 2024' },
  { title: 'The Future of Backend Development', excerpt: 'Discover emerging trends and technologies shaping the future of backend development.', date: 'April 10, 2024' }
])
</script>

