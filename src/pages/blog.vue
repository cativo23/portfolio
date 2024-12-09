<template>
  <div>
    <h2 class="text-3xl font-bold mb-8 text-tokyo-night-cyan">Blog Posts</h2>
    <div class="space-y-8">
      <article v-for="post in blogPosts" :key="post.id" 
               class="bg-tokyo-night-dark p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
        <h3 class="text-2xl font-bold mb-2">{{ post.title }}</h3>
        <p class="mb-4">{{ post.excerpt }}</p>
        <div class="flex justify-between items-cente">
          <span class="text-tokyo-night-purple">{{ post.date }}</span>
          <router-link :to="`/blog/${post.id}`" class="flex items-center text-tokyo-night-green hover:text-tokyo-night-cyan transition-colors duration-200">
            Read More
            <ArrowRightIcon class="w-4 h-4 ml-2" />
          </router-link>
        </div>
      </article>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ArrowRightIcon } from 'lucide-vue-next'

const blogPosts = ref([
  { id: 1, title: 'Optimizing Database Queries for Scale', excerpt: 'Learn how to optimize your database queries to handle millions of requests.', date: 'June 15, 2024' },
  { id: 2, title: 'Building Resilient Microservices', excerpt: 'Explore strategies for creating fault-tolerant and scalable microservices.', date: 'May 22, 2024' },
  { id: 3, title: 'The Future of Backend Development', excerpt: 'Discover emerging trends and technologies shaping the future of backend development.', date: 'April 10, 2024' },
  { id: 4, title: 'Securing Your API: Best Practices', excerpt: 'Learn essential techniques to protect your API from common security threats.', date: 'March 5, 2024' },
  { id: 5, title: 'Mastering Concurrent Programming', excerpt: 'Dive deep into concurrent programming concepts and techniques for better performance.', date: 'February 18, 2024' }
])
</script>