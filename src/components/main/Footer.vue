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
          <span :class="getApiStatusColor(apiStatus)">●</span>
          <span>API Status: <span :class="getApiStatusColor(apiStatus)">{{ loading ? 'Checking...' : apiStatus }}</span></span>
          <span class="text-tokyo-night-gray/30">|</span>
          <span class="text-tokyo-night-blue">v{{ apiVersion }}</span>
        </div>

        <!-- Right: Social Links -->
        <div class="flex items-center gap-4">
          <a href="https://github.com/cativo23" target="_blank" rel="noopener noreferrer"
             class="text-tokyo-night-blue hover:text-tokyo-night-cyan transition-colors">
            GitHub
          </a>
          <a href="https://linkedin.com/in/carlos-cativo" target="_blank" rel="noopener noreferrer"
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
import { ref, computed, onMounted } from 'vue';

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

// API Status
const apiStatus = ref<'Operational' | 'Degraded' | 'Down'>('Operational');
const apiVersion = ref<string>('');
const loading = ref(true);

const getApiStatusColor = (status: string) => {
  if (status === 'Operational') return 'text-tokyo-night-green';
  if (status === 'Degraded') return 'text-tokyo-night-yellow';
  return 'text-tokyo-night-red';
};

async function fetchApiStatus() {
  try {
    const [healthRes, infoRes] = await Promise.all([
      $fetch<{ status: string; data: { components: Record<string, { status: string }> } }>('/api/health').catch(() => null),
      $fetch<{ status: string; data: { version?: string } }>('/api').catch(() => null),
    ]);
    if (healthRes?.status === 'success') {
      const allUp = Object.values(healthRes.data.components).every(c => c.status === 'up');
      apiStatus.value = allUp ? 'Operational' : 'Degraded';
    } else {
      apiStatus.value = 'Down';
    }
    if (infoRes?.status === 'success' && infoRes.data.version) {
      apiVersion.value = infoRes.data.version;
    }
  } catch {
    apiStatus.value = 'Down';
  } finally {
    loading.value = false;
  }
}

if (import.meta.client) {
  onMounted(() => {
    fetchApiStatus();
  });
}
</script>

<style></style>