<template>
  <div class="min-h-screen bg-tokyo-night-bg text-tokyo-night-text font-mono">
    <NuxtRouteAnnouncer>
      <template #default="{ message }">
        <p>{{ message }} was loaded.</p>
      </template>
    </NuxtRouteAnnouncer>
    <!-- Header -->
    <Header />
    <!-- Main Content -->
    <main class="container mx-auto p-4">
      <NuxtPage />
    </main>
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/main/Header.vue';
import Footer from '@/components/main/Footer.vue';
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
</style>