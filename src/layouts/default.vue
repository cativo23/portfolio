<template>
  <div class="flex flex-col min-h-screen bg-tokyo-night-bg text-tokyo-night-text font-mono">
    <Header />
    <main class="container mx-auto p-4 flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/main/Header.vue';
import Footer from '@/components/main/Footer.vue';
</script>
