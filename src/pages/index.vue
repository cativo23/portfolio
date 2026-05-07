<template>
  <div class="space-y-0.5">
    <Hero />

    <!-- PROOF OF WORK -->
    <ProofOfWork />

    <!-- AT A GLANCE -->
    <div class="panel">
      <div class="panel-header">
        <span>AT A GLANCE</span>
      </div>
      <div class="metrics-grid grid grid-cols-2 md:grid-cols-4">
        <div class="metric-cell">
          <div class="m-label">YEARS IN PRODUCTION</div>
          <div class="m-value">9</div>
          <div class="m-sub">backend since 2016</div>
        </div>
        <div class="metric-cell">
          <div class="m-label">CURRENT ROLE</div>
          <div class="m-value" style="font-size: 16px;">TECH LEAD</div>
          <div class="m-sub">3+ yrs · Blue Medical Guatemala</div>
        </div>
        <div class="metric-cell highlight">
          <div class="m-label">SPECIALTY</div>
          <div class="m-value" style="font-size: 13px;">PAYMENTS · FEL · INTEGRATIONS</div>
          <div class="m-sub">ISO 8583 · multi-gateway · multi-provider</div>
        </div>
        <div class="metric-cell">
          <div class="m-label">SELF-HOSTED</div>
          <div class="m-value">16</div>
          <div class="m-sub">containers · cativo.dev</div>
        </div>
      </div>
    </div>

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
