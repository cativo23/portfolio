<template>
  <div class="max-w-2xl mx-auto">
    <BaseSectionHeading title="System Health" />

    <BaseCard>
      <div v-if="loading" class="text-center py-8">
        <span class="text-tokyo-night-muted">Loading health status...</span>
      </div>

      <div v-else-if="error || !health" class="text-center py-8">
        <p class="text-red-400 mb-4">Unable to load health status</p>
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
          <p class="text-tokyo-night-muted mt-2">{{ health.summary }}</p>
        </div>

        <!-- Individual Checks -->
        <div class="space-y-3">
          <div
            v-for="(check, name) in allChecks"
            :key="name"
            class="flex items-center justify-between p-3 rounded bg-tokyo-night-bg"
          >
            <span class="text-tokyo-night-text font-mono capitalize">{{ formatServiceName(name) }}</span>
            <span
              class="flex items-center gap-2 text-sm"
              :class="check.status === 'up' || check.status === 'ok' ? 'text-green-400' : 'text-red-400'"
            >
              <span
                class="w-2 h-2 rounded-full"
                :class="check.status === 'up' || check.status === 'ok' ? 'bg-green-400' : 'bg-red-400'"
              ></span>
              {{ check.status === 'up' || check.status === 'ok' ? 'Operational' : 'Down' }}
            </span>
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

interface HealthInfo {
  status: string
  info?: Record<string, { status: string }>
  error?: Record<string, { status: string; message?: string }>
  details?: Record<string, { status: string }>
}

const health = ref<HealthInfo | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const allChecks = computed(() => {
  if (!health.value) return {}
  // Combine info and error checks
  const checks: Record<string, { status: string }> = {}
  if (health.value.info) {
    Object.assign(checks, health.value.info)
  }
  if (health.value.error) {
    Object.assign(checks, health.value.error)
  }
  return checks
})

const overallStatus = computed(() => {
  if (!health.value) return 'Unknown'
  const allUp = Object.values(allChecks.value).every(c => c.status === 'up' || c.status === 'ok')
  return allUp ? 'All Systems Operational' : 'Some Services Down'
})

const overallStatusColor = computed(() => {
  if (!health.value) return 'text-tokyo-night-muted'
  const allUp = Object.values(allChecks.value).every(c => c.status === 'up' || c.status === 'ok')
  return allUp ? 'text-green-400' : 'text-red-400'
})

const dotColor = computed(() => {
  if (!health.value) return 'bg-tokyo-night-muted'
  const allUp = Object.values(allChecks.value).every(c => c.status === 'up' || c.status === 'ok')
  return allUp ? 'bg-green-400' : 'bg-red-400'
})

function formatServiceName(name: string): string {
  return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

async function loadHealth() {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch<{ status: string; data: HealthInfo }>('/api/health')
    if (response.status === 'success') {
      health.value = response.data
    } else {
      error.value = 'Failed to load health status'
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unable to connect to health endpoint'
  } finally {
    loading.value = false
  }
}

await useAsyncData('health-check', () => loadHealth())
</script>

<style scoped>
</style>
