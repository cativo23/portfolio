<template>
  <header class="navbar bg-tokyo-night-dark p-4 sticky top-0 z-10">
    <nav class="container mx-auto flex justify-between items-center">
      <NuxtLink to="/" class="md:w-[250px]">
        <h1 class="text-2xl font-bold text-tokyo-night-cyan">
          <span class="block md:hidden">
            <span class="text-tokyo-night-purple">{</span>CC<span class="text-tokyo-night-purple">}</span>
          </span> <!-- Show on mobile devices -->
          <span class="hidden md:block">
            <VueTyping :sentences="sentences" :minTypeSpeed="settings.minTypeSpeed"
              :maxTypeSpeed="settings.maxTypeSpeed" :eraseSpeed="settings.eraseSpeed" :eraseDelay="settings.eraseDelay"
              :writeDelay="settings.writeDelay" :caret="settings.caret" :loop="settings.loop">
              <template #before>
                <span class="text-tokyo-night-purple">{</span>
              </template>
              <template #after>
                <span class="text-tokyo-night-purple">}</span>
              </template>
            </VueTyping>
          </span>
        </h1>
      </NuxtLink>
      <div class="hidden md:flex space-x-4">
        <ul class="flex space-x-4">
          <li v-for="item in navItems" :key="item.name">
            <NuxtLink :href="item.link" :class="{
              'text-tokyo-night-red font-bold': currentRoute.path === item.link,
              'hover:text-tokyo-night-cyan transition-colors duration-200': currentRoute.path !== item.link
            }">{{ item.name }}</NuxtLink>
          </li>
        </ul>
      </div>
      <button @click="isMenuOpen = !isMenuOpen" class="md:hidden">
        <!-- Hamburger icon -->
        <LucideMenu/>
      </button>
    </nav>
    <transition
      enter-active-class="transition-transform transform duration-300"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform transform duration-300"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div v-if="isMenuOpen"
        class="fixed inset-0 bg-tokyo-night-dark bg-opacity-90 z-20 flex flex-col items-center justify-center md:hidden">
        <button @click="isMenuOpen = false" class="absolute top-4 right-4">
          <!-- Close icon -->
          <LucideX/>
        </button>
        <ul class="space-y-4">
          <li v-for="item in navItems" :key="item.name">
            <NuxtLink @click="isMenuOpen = false" :href="item.link" :class="{
              'text-tokyo-night-red font-bold': currentRoute.path === item.link,
              'hover:text-tokyo-night-cyan transition-colors duration-200': currentRoute.path !== item.link
            }">
              {{ item.name }}
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
  caret: undefined,
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
</script>