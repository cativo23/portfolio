<template>
  <div class="space-y-0.5">
    <Hero />

    <!-- PROOF OF WORK -->
    <ProofOfWork />

    <!-- FEATURED CASE FILES -->
    <PortfolioSection />

    <!-- WRITING -->
    <LatestPosts />

    <!-- OPEN CHANNEL -->
    <Contact />
  </div>
</template>

<script setup lang="ts">
import Contact from '@/components/home/Contact.vue';
import Hero from '@/components/home/Hero.vue';
import LatestPosts from '@/components/home/LatestPosts.vue';
import PortfolioSection from '@/components/home/portfolio/PortfolioSection.vue';
import ProofOfWork from '@/components/home/ProofOfWork.vue';

usePageTitle('Home', {
  description: 'Carlos Cativo - Tech Lead & Full-Stack Software Engineer. 9 years building healthcare platforms, payment systems, and AI-powered products.',
});
</script>
