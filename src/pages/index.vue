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

useSeoMeta({
  title: 'Carlos Cativo - Desarrollador Web',
  description: 'Desarrollador web apasionado por crear experiencias modernas y escalables.',
  ogTitle: 'Carlos Cativo - Desarrollador Web',
  ogDescription: 'Desarrollador web apasionado por crear experiencias modernas y escalables.',
  ogImage: '/og-image.png',
  ogUrl: 'https://carloscativo.com',
  twitterTitle: 'Carlos Cativo - Desarrollador Web',
  twitterDescription: 'Desarrollador web apasionado por crear experiencias modernas y escalables.',
  twitterImage: '/og-image.png',
  twitterCard: 'summary_large_image'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }
  ]
});
</script>