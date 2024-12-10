<template>
  <div>
    <h2 class="text-3xl font-bold mb-8 text-tokyo-night-cyan">My Projects</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="project in projects" :key="project.title"
        class="bg-tokyo-night-dark p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
        <h3 class="text-2xl font-bold mb-4">{{ project.title }}</h3>
        <p class="mb-4">{{ project.description }}</p>
        <div class="flex items-center text-tokyo-night-cyan mb-4">
          <LucideCode class="w-5 h-5 mr-2" />
          <span>{{ project.tech.join(', ') }}</span>
        </div>
        <div class="card-actions justify-start">
          <NuxtLink external :href="project.github" target="_blank" rel="noopener noreferrer"
            class="btn inline-flex items-center text-tokyo-night-purple hover:text-tokyo-night-cyan transition-colors duration-200">
            <LucideGithub class="w-5 h-5 mr-2" />View on GitHub
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const projects = ref([
  {
    title: 'API Gateway',
    description: 'High-performance API gateway with load balancing and caching',
    tech: ['Go', 'Redis'],
    github: 'https://github.com/johndoe/api-gateway'
  },
  {
    title: 'Data Pipeline',
    description: 'Scalable data processing pipeline for real-time analytics',
    tech: ['Python', 'Apache Kafka'],
    github: 'https://github.com/johndoe/data-pipeline'
  },
  {
    title: 'Auth Microservice',
    description: 'Secure authentication and authorization service',
    tech: ['Node.js', 'JWT'],
    github: 'https://github.com/johndoe/auth-microservice'
  },
  {
    title: 'Database Optimizer',
    description: 'Tool for optimizing database queries and schema',
    tech: ['SQL', 'Rust'],
    github: 'https://github.com/johndoe/db-optimizer'
  }
])
</script>