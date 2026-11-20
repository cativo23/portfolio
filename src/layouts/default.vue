<template>
  <div class="flex flex-col min-h-screen bg-void-warm text-nw-text font-sys">
    <Header />
    <main class="mx-auto w-full max-w-[1180px] px-[clamp(16px,4vw,48px)] py-4 pb-20 flex-grow">
      <slot />
    </main>
    <Footer />
    <ChatWidget />
  </div>
</template>

<script setup>
import Header from '@/components/main/Header.vue';
import Footer from '@/components/main/Footer.vue';
</script>
