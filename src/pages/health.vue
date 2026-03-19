<template>
  <div class="max-w-4xl mx-auto">
    <BaseSectionHeading title="System Health" />

    <!-- Health Type Tabs -->
    <div class="flex gap-2 mb-6 overflow-x-auto">
      <BaseButton
        v-for="tab in healthTabs"
        :key="tab.id"
        :variant="selectedTab === tab.id ? 'primary' : 'ghost'"
        :size="'sm'"
        @click="selectedTab = tab.id as 'basic' | 'detailed'; loadHealth()"
      >
        {{ tab.label }}
      </BaseButton>
    </div>

    <BaseCard>
      <div v-if="loading" class="text-center py-8">
        <span class="text-tokyo-night-muted">Loading health status...</span>
      </div>

      <div v-else-if="error || !health" class="text-center py-8">
        <p class="text-tokyo-night-red mb-4">Unable to load health status</p>
        <p class="text-tokyo-night-muted text-sm">{{ error }}</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Summary -->
        <div class="text-center">
          <div
            class="inline-flex items-center gap-2 text-2xl font-bold"
            :class="overallStatusColor"
          >
            <span
              class="w-4 h-4 rounded-full animate-pulse"
              :class="dotColor"
            ></span>
            {{ overallStatus }}
          </div>
          <p v-if="health.status" class="text-tokyo-night-muted mt-2 capitalize">
            Status: {{ health.status }}
          </p>
        </div>

        <!-- Components List -->
        <div class="space-y-3">
          <div
            v-for="(component, name) in health.components"
            :key="name"
            class="p-4 rounded bg-tokyo-night-bg"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-tokyo-night-text font-mono capitalize">{{ formatServiceName(name) }}</span>
              </div>
              <div class="flex items-center gap-4">
                <span
                  class="flex items-center gap-2 text-sm"
                  :class="component.status === 'up' ? 'text-tokyo-night-green' : 'text-tokyo-night-red'"
                >
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="component.status === 'up' ? 'bg-tokyo-night-green' : 'bg-tokyo-night-red'"
                  ></span>
                  {{ component.status === 'up' ? 'Operational' : 'Down' }}
                </span>
                <span v-if="component.latency !== undefined" class="text-tokyo-night-muted text-xs font-mono">
                  {{ component.latency }}ms
                </span>
                <span v-if="component.usagePercent !== undefined" class="text-tokyo-night-muted text-xs font-mono">
                  {{ component.usagePercent.toFixed(1) }}%
                </span>
              </div>
            </div>
            <p v-if="component.message" class="text-tokyo-night-muted text-xs mt-1">
              {{ component.message }}
            </p>
          </div>
        </div>

        <!-- Meta Info -->
        <div class="pt-4 border-t border-tokyo-night-gray grid grid-cols-2 gap-4 text-sm">
          <div v-if="health.version">
            <span class="text-tokyo-night-muted">Version:</span>
            <span class="text-tokyo-night-text font-mono ml-2">{{ health.version }}</span>
          </div>
          <div v-if="health.environment">
            <span class="text-tokyo-night-muted">Environment:</span>
            <span class="text-tokyo-night-text font-mono ml-2 capitalize">{{ health.environment }}</span>
          </div>
          <div v-if="health.uptime">
            <span class="text-tokyo-night-muted">Uptime:</span>
            <span class="text-tokyo-night-text font-mono ml-2">{{ health.uptime }}s</span>
          </div>
          <div v-if="requestId">
            <span class="text-tokyo-night-muted">Request ID:</span>
            <span class="text-tokyo-night-text font-mono ml-2 text-xs">{{ requestId }}</span>
          </div>
        </div>

        <!-- Refresh Button -->
        <div class="flex justify-center mt-4">
          <BaseButton variant="ghost" @click="loadHealth" :disabled="loading">
            <LucideRefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
            Refresh
          </BaseButton>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

usePageTitle('Health Check', {
  description: 'System health status and monitoring for the portfolio API.',
})

interface HealthComponent {
  status: string
  latency?: number
  used?: number
  total?: number
  usagePercent?: number
  message?: string
}

interface HealthInfo {
  status: string
  components: Record<string, HealthComponent>
  version?: string
  environment?: string
  timestamp?: string
  uptime?: number
  process?: {
    pid: number
    nodeVersion: string
    platform: string
    cpuUsage: { user: number; system: number }
    memoryUsage: { rss: number; heapTotal: number; heapUsed: number; external: number }
  }
}

const healthTabs = [
  { id: 'basic', label: 'Basic' },
  { id: 'detailed', label: 'Detailed' },
]

const selectedTab = ref<'basic' | 'detailed'>('basic')
const health = ref<HealthInfo | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const requestId = ref<string | null>(null)

const overallStatus = computed(() => {
  if (!health.value) return 'Unknown'
  const allUp = Object.values(health.value.components).every(c => c.status === 'up')
  return allUp ? 'All Systems Operational' : 'Some Services Down'
})

const overallStatusColor = computed(() => {
  if (!health.value) return 'text-tokyo-night-muted'
  const allUp = Object.values(health.value.components).every(c => c.status === 'up')
  return allUp ? 'text-tokyo-night-green' : 'text-tokyo-night-red'
})

const dotColor = computed(() => {
  if (!health.value) return 'bg-tokyo-night-muted'
  const allUp = Object.values(health.value.components).every(c => c.status === 'up')
  return allUp ? 'bg-tokyo-night-green' : 'bg-tokyo-night-red'
})

function formatServiceName(name: string): string {
  return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

async function loadHealth() {
  loading.value = true
  error.value = null
  requestId.value = null
  try {
    const endpoint = selectedTab.value === 'basic'
      ? '/api/health'
      : `/api/health/${selectedTab.value}`

    const response = await $fetch<{ status: string; data: HealthInfo; request_id?: string }>(endpoint)
    if (response.status === 'success') {
      health.value = response.data
      requestId.value = response.request_id || null
    } else {
      error.value = 'Failed to load health status'
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unable to connect to health endpoint'
  } finally {
    loading.value = false
  }
}

// Use callOnce for SSR — loadHealth manages its own state via refs
if (import.meta.server) {
  await loadHealth()
}
</script>

<style scoped>
</style>
