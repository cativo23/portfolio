<template>
  <NuxtLoadingIndicator :height="1" :throttle="100" color="#f471B5" />
  <NuxtRouteAnnouncer>
    <template #default="{ message }">
      <p>{{ message }} was loaded.</p>
    </template>
  </NuxtRouteAnnouncer>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <BaseToast />
</template>

<script setup>
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
  transform: translateX(-100%);
}
</style>
