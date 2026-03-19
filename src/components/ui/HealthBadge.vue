<template>
  <div class="flex items-center gap-3 text-xs font-mono">
    <span class="text-tokyo-night-muted">API Status:</span>
    <span
      class="flex items-center gap-1.5"
      :class="statusColor"
    >
      <span
        class="w-2 h-2 rounded-full animate-pulse"
        :class="dotColor"
      ></span>
      {{ statusText }}
    </span>
    <span v-if="apiInfo?.version" class="text-tokyo-night-muted">v{{ apiInfo.version }}</span>
    <NuxtLink
      to="/health"
      class="text-tokyo-night-blue hover:text-tokyo-night-text hover:underline transition-colors"
      title="View detailed health status"
    >
      <LucideActivity class="w-3.5 h-3.5" />
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

interface HealthComponent {
  status: string
}

interface HealthData {
  status: string
  components: Record<string, HealthComponent>
}

interface ApiInfo {
  version: string
  status: string
}

interface HealthResponse {
  status: 'success' | 'error'
  data: HealthData
}

const health = ref<HealthData | null>(null)
const apiInfo = ref<ApiInfo | null>(null)
const loading = ref(true)

const statusText = computed(() => {
  if (loading.value) return 'Checking...'
  if (!health.value) return 'Unavailable'

  const allUp = Object.values(health.value.components).every(c => c.status === 'up')
  return allUp ? 'Operational' : 'Degraded'
})

const statusColor = computed(() => {
  if (loading.value) return 'text-tokyo-night-muted'
  if (!health.value) return 'text-red-400'

  const allUp = Object.values(health.value.components).every(c => c.status === 'up')
  return allUp ? 'text-green-400' : 'text-yellow-400'
})

const dotColor = computed(() => {
  if (loading.value) return 'bg-tokyo-night-muted'
  if (!health.value) return 'bg-red-400'

  const allUp = Object.values(health.value.components).every(c => c.status === 'up')
  return allUp ? 'bg-green-400' : 'bg-yellow-400'
})

async function fetchHealth() {
  try {
    const [healthRes, infoRes] = await Promise.all([
      $fetch<HealthResponse>('/api/health').catch(() => null),
      $fetch<{ status: string; data: { version?: string; status?: string } }>('/api').catch(() => null),
    ])

    if (healthRes?.status === 'success') {
      health.value = healthRes.data
    }

    if (infoRes?.status === 'success' && infoRes.data.version) {
      apiInfo.value = {
        version: infoRes.data.version,
        status: infoRes.data.status || 'unknown',
      }
    }
  } catch {
    // Silently fail - health check is non-critical
  } finally {
    loading.value = false
  }
}

// Fetch on mount (client-side only)
if (import.meta.client) {
  onMounted(() => {
    fetchHealth()
  })
}
</script>
