<template>
  <div class="flex flex-col min-h-screen bg-tokyo-night-bg text-tokyo-night-text font-mono">
    <NuxtLoadingIndicator :height="1" :throttle="100" color="#f471B5" />
    <NuxtRouteAnnouncer>
      <template #default="{ message }">
        <p>{{ message }} was loaded.</p>
      </template>
    </NuxtRouteAnnouncer>
    <!-- Header (hidden on admin routes) -->
    <Header v-if="!isAdminRoute" />
    <!-- Main Content -->
    <main :class="isAdminRoute ? 'flex-grow' : 'container mx-auto p-4 flex-grow'">
      <NuxtPage />
    </main>
    <!-- Footer (hidden on admin routes) -->
    <Footer v-if="!isAdminRoute" />
  </div>
  <BaseToast />
</template>

<script setup>
import Header from '@/components/main/Header.vue';
import Footer from '@/components/main/Footer.vue';

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/ico',
      href: '/favicon.ico'
    },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'Carlos Cativo - Blog RSS Feed',
      href: '/feed.xml'
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Carlos Cativo',
        url: 'https://cativo.dev',
        jobTitle: 'Backend Developer',
        sameAs: [
          'https://github.com/cativo23',
          'https://linkedin.com/in/cativo23',
          'https://x.com/cativo23'
        ],
        image: 'https://cativo.dev/img/akira.jpeg',
        description: 'Backend Developer & Tech Enthusiast. Building scalable server-side solutions.',
      })
    }
  ]
});
</script>

<style>
.page-enter-active,
.page-leave-active {
  position: fixed;
  left: 0;
  transition: all .2s linear;
}

.page-enter-from {
  transform: translateX(100%);
}

.page-leave-to {
  transform: translate(-100%);
}
</style>