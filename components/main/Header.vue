<template>
  <header class="navbar bg-tokyo-night-dark p-4 sticky top-0 z-10">
    <nav class="container mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-bold text-tokyo-night-cyan">
        <VueTyping :sentences="sentences" :minTypeSpeed="settings.minTypeSpeed" :maxTypeSpeed="settings.maxTypeSpeed"
          :eraseSpeed="settings.eraseSpeed" :eraseDelay="settings.eraseDelay" :writeDelay="settings.writeDelay"
          :caret="settings.caret" :loop="settings.loop">
          <template #before>
            <span class="text-tokyo-night-purple">{</span>
          </template>
          <template #after>
            <span class="text-tokyo-night-purple">}</span>
          </template>
        </VueTyping>
      </h1>
      <ul class="flex space-x-4">
        <li v-for="item in navItems" :key="item.name">
          <a :href="item.link" :class="{
            'text-tokyo-night-red font-bold': currentRoute.path === item.link,
            'hover:text-tokyo-night-cyan transition-colors duration-200': currentRoute.path !== item.link
          }">{{ item.name }}</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import VueTyping from "@dmncodes/vue-typing";

// Define reactive properties for the typing settings
const settings = reactive({
  minTypeSpeed: 50,
  maxTypeSpeed: 150,
  eraseSpeed: 50,
  eraseDelay: 1500,
  writeDelay: 150,
  caret: undefined,
  loop: true,
});

//Navigation items
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
</script>

<style>
.dmn-typing .caret {
  color: inherit;
  animation: blink 1s infinite;
}

.dmn-typing .typing {
  animation: none;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>