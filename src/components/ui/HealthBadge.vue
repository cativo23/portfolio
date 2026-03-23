<template>
  <div class="flex items-center gap-3 text-xs font-mono">
    <span class="text-tokyo-night-muted">API Status:</span>
    <span class="flex items-center" :class="statusColor">
      <StatusIndicator :status="healthStatus === 'up' ? 'success' : healthStatus === 'down' ? 'error' : healthStatus === 'degraded' ? 'warning' : 'unknown'" :text="statusText" pulse size="sm" />
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
import StatusIndicator from './StatusIndicator.vue'

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

const healthStatus = computed(() => {
  if (loading.value) return 'unknown'
  if (!health.value) return 'down'

  const allUp = Object.values(health.value.components).every(c => c.status === 'up')
  const anyDegraded = Object.values(health.value.components).some(c => c.status === 'degraded')

  if (allUp) return 'up'
  if (anyDegraded) return 'degraded'
  return 'down'
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
