<template>
  <div class="panel">
    <div class="panel-header">
      <span>SIGNAL · PROOF OF WORK</span>
      <span class="text-nw-green font-stamp uppercase tracking-wider text-[10px]">LIVE</span>
    </div>

    <!-- GitHub Heatmap -->
    <div class="px-5 py-4 flex items-center gap-6 border-b border-nw-text-faint">
      <div v-if="signal?.github.weeks.length" class="heatmap-grid shrink-0">
        <div v-for="(week, wi) in signal.github.weeks" :key="wi" class="heatmap-col">
          <div
            v-for="(level, di) in week"
            :key="di"
            class="heatmap-cell"
            :style="{ background: heatColors[level] || heatColors[0] }"
          />
        </div>
      </div>
      <div v-else class="w-[200px] h-[84px] bg-void-panel" />
      <div class="font-stamp uppercase tracking-wider text-[9px] text-nw-text-dim leading-loose whitespace-nowrap">
        <span class="text-nw-green font-bold text-xs">{{ signal?.github.contributions ?? '...' }}</span> contributions<br>
        <span class="text-nw-cyan font-bold text-xs">{{ signal?.github.publicRepos ?? '...' }}</span> public repos<br>
        <span class="text-nw-purple font-bold text-xs">3</span> npm packages
      </div>
    </div>

    <!-- Metrics strip -->
    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px bg-nw-text-faint">
      <div class="metric-cell">
        <div class="m-label">YEARS</div>
        <div class="m-value">9</div>
        <div class="m-sub">backend since 2016</div>
      </div>
      <div class="metric-cell">
        <div class="m-label">CURRENT ROLE</div>
        <div class="m-value" style="font-size: 16px;">TECH LEAD</div>
        <div class="m-sub">Blue Medical Guatemala</div>
      </div>
      <div class="metric-cell highlight">
        <div class="m-label">SPECIALTY</div>
        <div class="m-value" style="font-size: 12px;">PAYMENTS · FEL</div>
        <div class="m-sub">ISO 8583 · multi-gateway</div>
      </div>
      <div class="metric-cell">
        <div class="m-label">CONTAINERS</div>
        <div class="m-value">16</div>
        <div class="m-sub">self-hosted · 6 stacks</div>
      </div>
      <div class="metric-cell">
        <div class="m-label">NPM DL / MO</div>
        <div class="m-value" style="color: var(--nw-purple); text-shadow: 0 0 6px rgba(178,102,224,0.3);">
          {{ formatNumber(signal?.npm.total) }}
        </div>
      </div>
      <div class="metric-cell">
        <div class="m-label">LUMIRA</div>
        <div class="m-value" style="color: var(--nw-cyan); text-shadow: 0 0 6px rgba(102,221,255,0.3);">
          {{ formatNumber(signal?.npm.lumira) }}
        </div>
        <div class="m-sub">downloads / mo</div>
      </div>
      <div class="metric-cell">
        <div class="m-label">API</div>
        <div class="m-value" style="font-size: 16px;">
          {{ signal ? `v${signal.api.version}` : '...' }}
        </div>
      </div>
      <div class="metric-cell">
        <div class="m-label">STATUS</div>
        <div class="m-value" style="font-size: 14px;">
          <span class="led blink" :class="signal?.api.status === 'operational' ? 'green' : 'red'" style="display: inline-block;" />
        </div>
        <div class="m-sub">api.cativo.dev</div>
      </div>
    </div>

    <!-- Terminal one-liner -->
    <div class="px-5 py-3 border-t border-nw-text-faint font-sys text-[11px] text-nw-text-dim leading-relaxed">
      <span class="text-nw-green">$</span>
      <span> curl </span>
      <span class="text-nw-cyan">api.cativo.dev</span>
      <span> → </span>
      <span class="text-nw-green">"{{ signal?.api.status ?? '...' }}"</span>
      <span> · </span>
      <span class="text-nw-yellow">16</span>
      <span> containers · </span>
      <span class="text-nw-yellow">6</span>
      <span> stacks</span>
      <span class="inline-block w-[7px] h-[13px] bg-nw-green align-text-bottom" style="animation: nw-caret-blink 1s steps(2) infinite;" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface SignalData {
  github: { contributions: number; weeks: number[][]; publicRepos: number }
  npm: { lumira: number; claudeSetup: number; nightwire: number; total: number }
  api: { version: string; status: string }
}

const { data: raw } = useFetch<{ status: string; data: SignalData }>('/api/signal', {
  server: false,
})

const signal = computed(() => raw.value?.data)

const heatColors = ['var(--void-panel)', 'var(--nw-primary-fill)', 'rgba(68,119,204,0.45)', 'var(--nw-primary-dim)', 'var(--nw-primary)']

function formatNumber(n: number | undefined): string {
  if (n == null) return '...'
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}
</script>

<style scoped>
.heatmap-grid {
  display: flex;
  gap: 2px;
  overflow: hidden;
}
.heatmap-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.heatmap-cell {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}
</style>
