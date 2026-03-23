<template>
  <footer class="bg-tokyo-night-dark border-t border-tokyo-night-gray/30">
    <div class="container mx-auto px-4 py-3">
      <div class="flex flex-col md:flex-row justify-between items-center gap-3 font-mono text-xs">
        <!-- Left: Copyright -->
        <div class="text-tokyo-night-muted">
          <span class="text-tokyo-night-purple">© {{ currentYear }}</span> Carlos Cativo
        </div>

        <!-- Center: API Status -->
        <div class="flex items-center gap-2 text-tokyo-night-muted">
          <span :class="apiStatusDotColor">●</span>
          <span>API Status: <span :class="apiStatusTextColor">{{ apiStatus }}</span></span>
          <span class="text-tokyo-night-gray/30">|</span>
          <span class="text-tokyo-night-blue">v2.4.1</span>
        </div>

        <!-- Right: Social Links -->
        <div class="flex items-center gap-4">
          <a href="https://github.com/cativo23" target="_blank" rel="noopener noreferrer"
             class="text-tokyo-night-blue hover:text-tokyo-night-cyan transition-colors">
            GitHub
          </a>
          <a href="https://linkedin.com/in/cativo23" target="_blank" rel="noopener noreferrer"
             class="text-tokyo-night-blue hover:text-tokyo-night-cyan transition-colors">
            LinkedIn
          </a>
          <a href="https://x.com/cativo23" target="_blank" rel="noopener noreferrer"
             class="text-tokyo-night-blue hover:text-tokyo-night-cyan transition-colors">
            X
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { createLucideIcon } from 'lucide-vue-next';
import { computed } from 'vue';
import HealthBadge from '~/components/ui/HealthBadge.vue';

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

// API Status - TODO: Replace with actual API health check
const apiStatus = 'Degraded';
const apiStatusDotColor = computed(() => {
  if (apiStatus === 'Operational') return 'text-tokyo-night-green';
  if (apiStatus === 'Degraded') return 'text-tokyo-night-yellow';
  return 'text-tokyo-night-red';
});
const apiStatusTextColor = computed(() => {
  if (apiStatus === 'Operational') return 'text-tokyo-night-green';
  if (apiStatus === 'Degraded') return 'text-tokyo-night-yellow';
  return 'text-tokyo-night-red';
});
</script>

<style></style>