<template>
  <footer class="sticky bottom-0 z-40 bg-void border-t border-nw-text-faint">
    <div class="container mx-auto px-4 py-2">
      <!-- Now Playing -->
      <div v-if="nowPlaying?.isPlaying" class="flex items-center justify-center gap-2 pb-1.5 mb-1.5 border-b border-nw-text-faint/30">
        <span class="font-stamp uppercase tracking-[0.14em] text-[10px] text-nw-text-faint shrink-0">NOW PLAYING</span>
        <NowPlayingBars />
        <a
          :href="nowPlaying.spotifyUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-[10px] normal-case tracking-normal text-nw-green hover:text-nw-primary-hot transition-colors truncate max-w-[280px] md:max-w-[400px]"
        >
          {{ nowPlaying.track }} <span class="text-nw-text-dim">— {{ nowPlaying.artist }}</span>
        </a>
      </div>

      <div class="flex flex-col md:flex-row justify-between items-center gap-2 font-stamp uppercase tracking-[0.1em] text-[10px]">
        <!-- Left: System status + version -->
        <div class="flex items-center gap-2 text-nw-text-dim">
          <span class="led" :class="ledClass" />
          <span class="text-nw-text">cativo.dev API</span>
          <span class="text-nw-text-faint">·</span>
          <span :class="getApiStatusColor(apiStatus)">{{ loading ? 'checking…' : apiStatus.toLowerCase() }}</span>
          <span v-if="apiVersion" class="text-nw-text-faint">·</span>
          <span v-if="apiVersion" class="font-mono normal-case text-nw-text-dim tracking-normal">v{{ apiVersion }}</span>
          <span class="text-nw-text-faint">·</span>
          <span class="font-mincho text-nw-primary-dim normal-case tracking-normal text-[12px]">自家管理</span>
        </div>

        <!-- Center: live clock SV -->
        <div class="flex items-center gap-2 text-nw-text-dim">
          <span class="font-mono normal-case tracking-normal">{{ clock }}</span>
          <span class="text-nw-text-faint">·</span>
          <span>UTC-6 SV</span>
        </div>

        <!-- Right: socials + © -->
        <div class="flex items-center gap-3 text-nw-text-dim">
          <a
            href="https://github.com/cativo23"
            target="_blank"
            rel="noopener noreferrer"
            class="text-nw-primary hover:text-nw-primary-hot transition-colors"
          >GitHub</a>
          <span class="text-nw-text-faint">·</span>
          <a
            href="https://linkedin.com/in/carlos-cativo"
            target="_blank"
            rel="noopener noreferrer"
            class="text-nw-primary hover:text-nw-primary-hot transition-colors"
          >LinkedIn</a>
          <span class="text-nw-text-faint">·</span>
          <a
            href="https://x.com/cativo23"
            target="_blank"
            rel="noopener noreferrer"
            class="text-nw-primary hover:text-nw-primary-hot transition-colors"
          >X</a>
          <span class="text-nw-text-faint">·</span>
          <span>© {{ currentYear }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const { nowPlaying } = useNowPlaying();

const currentYear = new Date().getFullYear();

// Live clock for UTC-6 (El Salvador)
const clock = ref('--:--:--');
let clockInterval: ReturnType<typeof setInterval> | null = null;

function updateClock() {
  const now = new Date();
  const sv = new Date(now.getTime() + (now.getTimezoneOffset() - 360) * 60 * 1000);
  const hh = String(sv.getHours()).padStart(2, '0');
  const mm = String(sv.getMinutes()).padStart(2, '0');
  const ss = String(sv.getSeconds()).padStart(2, '0');
  clock.value = `${hh}:${mm}:${ss}`;
}

// API Status
const apiStatus = ref<'Operational' | 'Degraded' | 'Down'>('Operational');
const apiVersion = ref<string>('');
const loading = ref(true);

const getApiStatusColor = (status: string) => {
  if (status === 'Operational') return 'text-nw-green';
  if (status === 'Degraded') return 'text-nw-yellow';
  return 'text-nw-red';
};

const ledClass = computed(() => {
  if (loading.value) return '';
  if (apiStatus.value === 'Operational') return 'green blink';
  if (apiStatus.value === 'Degraded') return 'yellow blink';
  return 'red';
});

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
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
  });
  onUnmounted(() => {
    if (clockInterval) clearInterval(clockInterval);
  });
}
</script>
