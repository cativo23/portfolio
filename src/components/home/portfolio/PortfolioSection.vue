<template>
  <section class="mb-16">
    <h3 class="text-2xl font-bold mb-6">
      <DecryptedText text="Featured Projects" animateOn="view" class="text-tokyo-night-cyan font-bold"
        encryptedClassName="text-opacity-60" :speed="40" :maxIterations="10" :sequential="true"
        revealDirection="start" />
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="project in projects" :key="project.title">
        <FeatureProjectCard :project="project" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import FeatureProjectCard from './FeatureProjectCard.vue';


const projects = ref([
  { title: 'API Gateway', description: 'High-performance API gateway with load balancing and caching', tech: ['Go', 'Redis'] },
  { title: 'Data Pipeline', description: 'Scalable data processing pipeline for real-time analytics', tech: ['Python', 'Apache Kafka'] },
  { title: 'Auth Microservice', description: 'Secure authentication and authorization service', tech: ['Node.js', 'JWT'] },
  { title: 'Database Optimizer', description: 'Tool for optimizing database queries and schema', tech: ['SQL', 'Rust'] },
  { title: 'API Gateway', description: 'High-performance API gateway with load balancing and caching', tech: ['Go', 'Redis'] },
  { title: 'Data Pipeline', description: 'Scalable data processing pipeline for real-time analytics', tech: ['Python', 'Apache Kafka'] },
  { title: 'Auth Microservice', description: 'Secure authentication and authorization service', tech: ['Node.js', 'JWT'] },
  { title: 'Database Optimizer', description: 'Tool for optimizing database queries and schema', tech: ['SQL', 'Rust'] }
])
</script>

<style></style>