<template>
  <header class="navbar bg-tokyo-night-bg border-b border-tokyo-night-gray/30 p-4 sticky top-0 z-10">
    <nav class="container mx-auto flex justify-between items-center">
      <NuxtLink to="/" class="md:w-[290px]">
        <h1 class="text-xl md:text-2xl font-bold font-mono">
          <span class="block md:hidden">
            <span class="text-tokyo-night-purple">👨‍💻 {</span><span class="text-tokyo-night-red">CC</span><span class="text-tokyo-night-purple">}</span>
          </span>
          <span class="hidden md:block">
            <ClientOnly>
              <VueTyping :sentences="sentences" :minTypeSpeed="settings.minTypeSpeed"
                :maxTypeSpeed="settings.maxTypeSpeed" :eraseSpeed="settings.eraseSpeed"
                :eraseDelay="settings.eraseDelay" :writeDelay="settings.writeDelay" :caret="settings.caret"
                :loop="settings.loop">
                <template #before>
                  <span class="text-tokyo-night-purple">👨‍💻 {</span>
                </template>
                <template #after>
                  <span class="text-tokyo-night-purple">}</span>
                </template>
              </VueTyping>
              <template #fallback>
                <span class="text-tokyo-night-purple">👨‍💻 {</span><span class="text-tokyo-night-red">Carlos Cativo</span><span
                  class="text-tokyo-night-purple">}</span>
              </template>
            </ClientOnly>
          </span>
        </h1>
      </NuxtLink>
      <div class="hidden md:flex space-x-6">
        <ul class="flex space-x-6">
          <li v-for="item in navItems" :key="item.name">
            <NuxtLink :href="item.link" :class="{
              'text-tokyo-night-red font-bold': isHighlightedRoute(item.link),
              'text-tokyo-night-muted hover:text-tokyo-night-cyan': !isHighlightedRoute(item.link)
            }" class="transition-colors duration-200 font-mono text-sm">
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <button @click="isMenuOpen = !isMenuOpen" class="md:hidden text-tokyo-night-muted" aria-label="Toggle navigation menu"
        :aria-expanded="isMenuOpen">
        <LucideMenu aria-hidden="true" />
      </button>
    </nav>
    <transition enter-active-class="transition-transform transform duration-300" enter-from-class="translate-x-full"
      enter-to-class="translate-x-0" leave-active-class="transition-transform transform duration-300"
      leave-from-class="translate-x-0" leave-to-class="translate-x-full">
      <div v-if="isMenuOpen"
        class="fixed inset-0 bg-tokyo-night-bg bg-opacity-95 z-20 flex flex-col items-center justify-center md:hidden"
        role="dialog" aria-modal="true" aria-label="Mobile navigation">
        <button @click="isMenuOpen = false" class="absolute top-4 right-4 text-tokyo-night-muted" aria-label="Close menu">
          <LucideX aria-hidden="true" />
        </button>
        <ul class="space-y-6">
          <li v-for="item in navItems" :key="item.name">
            <NuxtLink :to="item.link" @click="closeMenu" :class="{
              'text-tokyo-night-red font-bold': isHighlightedRoute(item.link),
              'text-tokyo-night-muted hover:text-tokyo-night-cyan': !isHighlightedRoute(item.link)
            }" class="transition-colors duration-200 font-mono text-lg">
              ❯ {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </transition>
  </header>
</template>

<script lang="ts" setup>
import VueTyping from "@dmncodes/vue-typing";
import { ref, reactive } from 'vue';
import { useRoute } from 'vue-router';

// Define reactive properties for the typing settings
const settings = reactive({
  minTypeSpeed: 50,
  maxTypeSpeed: 150,
  eraseSpeed: 50,
  eraseDelay: 1500,
  writeDelay: 150,
  caret: "|",
  loop: true,
});

const isMenuOpen = ref(false);

// Navigation items
const navItems = ref([
  { name: 'Home', link: '/' },
  { name: 'About', link: '/about' },
  { name: 'Projects', link: '/projects' },
  { name: 'Blog', link: '/blog' },
  { name: 'Contact', link: '/contact' },
]);

// Get the current route
const currentRoute = useRoute();

// Define the sentences to be typed
const sentences = [
  ' Carlos Cativo',
  ' cativo23'
];

const isHighlightedRoute = (link: string) => {
  if (link === '/') {
    return currentRoute.path === link;
  }
  return currentRoute.path.startsWith(link);
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>
<style lang="css">
/* Add custom styles here */
.dmn-typing .caret {
  color: inherit;
  animation: blink .5s infinite
}

.dmn-typing .typing {
  animation: none
}

@keyframes blink {
  50% {
    opacity: 0
  }
}
</style>