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

usePageTitle('Home', {
  description: 'Welcome to my portfolio! I am a Backend Developer and Tech Enthusiast, crafting robust server-side solutions and sharing knowledge through my projects and blog posts.',
});
</script>