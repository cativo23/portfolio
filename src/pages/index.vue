<template>
  <div>
    <!-- Hero Section -->
    <Hero />

    <!-- Portfolio Section -->
    <PortfolioSection />

    <!-- Contact Section -->
    <Contact />
  </div>
</template>

<script setup lang="ts">
import Contact from '@/components/home/Contact.vue';
import Hero from '@/components/home/Hero.vue';
import PortfolioSection from '@/components/home/portfolio/PortfolioSection.vue';

usePageTitle('Home', {
  description: 'Carlos Cativo - Tech Lead & Full-Stack Software Engineer. 9 years building healthcare platforms, payment systems, and AI-powered products.',
});
</script>
