<template>
  <footer class="bg-tokyo-night-dark text-center p-4 mt-16">
    <p>&copy; {{ currentYear }} Carlos Cativo. All rights reserved.</p>
    <div class="flex justify-center space-x-4 mt-2">
      <a href="https://github.com/cativo23" target="_blank" rel="noopener noreferrer" 
         aria-label="GitHub" class="hover:text-tokyo-night-cyan transition-colors">
        <LucideGithub />
      </a>
      <a href="https://linkedin.com/in/cativo23" target="_blank" rel="noopener noreferrer"
         aria-label="LinkedIn" class="hover:text-tokyo-night-cyan transition-colors">
        <LucideLinkedin />
      </a>
      <a href="https://x.com/cativo23" target="_blank" rel="noopener noreferrer"
         aria-label="X (Twitter)" class="hover:text-tokyo-night-cyan transition-colors">
        <XIcon />
      </a>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { createLucideIcon } from 'lucide-vue-next';

// Create the XIcon component
const XIcon = createLucideIcon("X", [
  [
    "path",
    {
      d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
      stroke: "none",
      fill: "currentColor",
    },
  ],
]);

// Add a reactive property for the current year
const currentYear = new Date().getFullYear();
</script>

<style></style>