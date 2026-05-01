<template>
  <header class="bg-void border-b border-nw-primary-dim px-4 py-3 sticky top-0 z-10">
    <nav class="container mx-auto flex justify-between items-center gap-4">
      <!-- Org mark -->
      <NuxtLink to="/" class="flex flex-col leading-none shrink-0">
        <span class="font-title font-black tracking-[0.15em] uppercase text-nw-text text-base md:text-lg">
          cativo<span class="text-nw-primary">.dev</span><span class="caret" aria-hidden="true">_</span>
        </span>
        <span class="hidden md:block font-mincho text-nw-primary-dim text-[11px] mt-0.5">
          個人作戦記録
        </span>
      </NuxtLink>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-6">
        <ul class="flex gap-5 font-stamp uppercase tracking-[0.14em] text-[13px]">
          <li v-for="item in navItems" :key="item.path">
            <NuxtLink
              :to="item.path"
              :class="isActive(item.path)
                ? 'text-nw-primary border-b border-nw-primary pb-0.5'
                : 'text-nw-text-dim hover:text-nw-primary'"
              class="transition-colors duration-150"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
        <span class="hidden lg:flex items-center gap-2 pl-5 border-l border-nw-text-faint text-[12px] font-stamp uppercase tracking-wider">
          <span class="led green blink" aria-hidden="true"></span>
          <span class="text-nw-green">OPEN TO ROLES</span>
        </span>
      </div>

      <!-- Mobile toggle -->
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="md:hidden text-nw-text-dim hover:text-nw-primary"
        aria-label="Toggle navigation menu"
        :aria-expanded="isMenuOpen"
      >
        <LucideMenu aria-hidden="true" />
      </button>
    </nav>

    <!-- Mobile drawer -->
    <transition
      enter-active-class="transition-transform transform duration-300"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform transform duration-300"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 bg-void/95 z-20 flex flex-col items-center justify-center md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <button
          @click="isMenuOpen = false"
          class="absolute top-4 right-4 text-nw-text-dim hover:text-nw-primary"
          aria-label="Close menu"
        >
          <LucideX aria-hidden="true" />
        </button>
        <ul class="space-y-6 font-stamp uppercase tracking-[0.14em] title-card">
          <li v-for="item in navItems" :key="item.path">
            <NuxtLink
              :to="item.path"
              :class="isActive(item.path) ? 'text-nw-primary' : 'text-nw-text-dim hover:text-nw-primary'"
              class="transition-colors"
              @click="closeMenu"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
        <div class="absolute bottom-8 flex items-center gap-2 text-[11px] font-stamp uppercase tracking-wider">
          <span class="led green blink" aria-hidden="true"></span>
          <span class="text-nw-green">OPEN TO ROLES</span>
        </div>
      </div>
    </transition>
  </header>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const isMenuOpen = ref(false);

const navItems = ref([
  { label: 'Home', path: '/' },
  { label: 'Profile', path: '/about' },
  { label: 'Case Files', path: '/projects' },
  { label: 'Now', path: '/now' },
  { label: 'Contact', path: '/contact' },
]);

const currentRoute = useRoute();

function isActive(path: string) {
  if (path === '/') return currentRoute.path === '/';
  return currentRoute.path.startsWith(path);
}

function closeMenu() {
  isMenuOpen.value = false;
}
</script>
