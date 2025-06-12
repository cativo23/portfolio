<template>
  <div>
    <!-- Hero Section -->
    <Hero />

    <!-- Portfolio Section -->
    <PortfolioSection />

    <!-- Blog Section -->
    <BlogSection />

    <!-- Contact Section -->
    <Contact />
  </div>
</template>

<script setup lang="ts">
import BlogSection from '@/components/home/blog/BlogSection.vue';
import Contact from '@/components/home/Contact.vue';
import Hero from '@/components/home/Hero.vue';
import PortfolioSection from '@/components/home/portfolio/PortfolioSection.vue';

usePageTitle('Home');
</script>