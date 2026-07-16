<template>
  <NuxtLoadingIndicator :height="1" :throttle="100" color="#6699ff" />
  <NuxtRouteAnnouncer>
    <template #default="{ message }">
      <p>{{ message }} was loaded.</p>
    </template>
  </NuxtRouteAnnouncer>
  <div :class="route.path.startsWith('/admin') ? '' : 'page-transition-wrapper'">
    <NuxtLayout>
      <NuxtPage :transition="route.path.startsWith('/admin') ? false : { name: 'page', mode: 'out-in' }" />
    </NuxtLayout>
  </div>
  <BaseToast />
</template>

<script setup>
const route = useRoute()

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/ico',
      href: '/favicon.ico'
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
          'https://linkedin.com/in/carlos-cativo',
          'https://x.com/cativo23'
        ],
        image: 'https://cativo.dev/img/akira.jpeg',
        description: 'Backend Developer & Tech Enthusiast. Building scalable server-side solutions.',
      })
    }
  ]
});
</script>
