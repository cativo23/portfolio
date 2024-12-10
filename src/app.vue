<template>
  <div class="flex flex-col min-h-screen bg-tokyo-night-bg text-tokyo-night-text font-mono">
    <NuxtRouteAnnouncer>
      <template #default="{ message }">
        <p>{{ message }} was loaded.</p>
      </template>
    </NuxtRouteAnnouncer>
    <!-- Header -->
    <Header />
    <!-- Main Content -->
    <main class="container mx-auto p-4 flex-grow"">
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
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap');
</style>