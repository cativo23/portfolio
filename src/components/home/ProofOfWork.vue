<template>
  <div class="panel">
    <div class="panel-header">
      <span>SIGNAL · PROOF OF WORK</span>
      <span class="text-nw-green font-stamp uppercase tracking-wider text-[10px]">LIVE</span>
    </div>

    <!-- Row 1: Heatmap with month axis + Stats Grid 2x3 -->
    <div class="flex items-stretch border-b border-nw-text-faint">
      <!-- Heatmap zone (flex-grow, responsive cells) -->
      <div class="flex-grow px-5 py-4 flex flex-col justify-center gap-1 overflow-hidden">
        <div v-if="signal?.github.weeks.length" class="heatmap-grid w-full">
          <div v-for="(week, wi) in signal.github.weeks" :key="wi" class="heatmap-col">
            <div
              v-for="(level, di) in week"
              :key="di"
              class="heatmap-cell"
              :style="{ background: heatColors[level] || heatColors[0] }"
            />
          </div>
        </div>
        <!-- Month axis -->
        <div v-if="signal?.github.weeks.length" class="heatmap-axis w-full">
          <span
            v-for="label in monthLabels"
            :key="label.index"
            class="font-stamp text-nw-text-dim"
            :style="{ position: 'absolute', left: `${(label.index / (signal.github.weeks.length - 1)) * 100}%` }"
            style="font-size: 8px; letter-spacing: 0.08em; text-transform: uppercase;"
          >{{ label.name }}</span>
        </div>
        <div v-else class="w-[200px] h-[84px] bg-void-panel" />
      </div>

      <!-- Stats grid 2x3 -->
      <div class="grid grid-cols-2 gap-px bg-nw-text-faint shrink-0 w-[340px]">
        <div class="metric-cell">
          <div class="m-value" style="color: var(--nw-green); text-shadow: 0 0 6px rgba(122,237,122,0.3);">
            {{ signal?.github.contributions ?? '...' }}
          </div>
          <div class="m-label">Contributions</div>
        </div>
        <div class="metric-cell">
          <div class="m-value" style="color: var(--nw-cyan); text-shadow: 0 0 6px rgba(102,221,255,0.3);">
            {{ signal?.github.publicRepos ?? '...' }}
          </div>
          <div class="m-label">Public Repos</div>
        </div>
        <div class="metric-cell">
          <div class="m-value" style="color: var(--nw-purple); text-shadow: 0 0 6px rgba(178,102,224,0.3);">
            {{ formatNumber(signal?.npm.total) }}
          </div>
          <div class="m-label">NPM DL / mo</div>
        </div>
        <div class="metric-cell">
          <div class="m-value" style="color: var(--nw-primary); text-shadow: 0 0 6px rgba(102,153,255,0.3);">
            3
          </div>
          <div class="m-label">NPM Packages</div>
        </div>
        <div class="metric-cell">
          <div class="m-value" style="font-size: 16px;">
            {{ signal ? `v${signal.api.version}` : '...' }}
          </div>
          <div class="m-label">API</div>
        </div>
        <div class="metric-cell">
          <div class="m-value" style="font-size: 14px;">
            <span class="led blink" :class="signal?.api.status === 'operational' ? 'green' : 'red'" style="display: inline-block;" />
          </div>
          <div class="m-label">Status</div>
          <div class="m-sub">api.cativo.dev</div>
        </div>
      </div>
    </div>

    <!-- Row 2: NPM Sparkline Strip -->
    <div v-if="npmPackages.length" class="flex items-center px-5 py-2.5 gap-8 border-b border-nw-text-faint">
      <span class="font-stamp uppercase tracking-wider text-[8px] text-nw-text-dim shrink-0">NPM Downloads</span>
      <div class="flex items-center gap-8 flex-grow justify-around">
        <div v-for="pkg in npmPackages" :key="pkg.name" class="flex items-center gap-3">
          <span class="font-stamp uppercase tracking-wider text-[9px] text-nw-text-dim">{{ pkg.name }}</span>
          <div class="sparkline">
            <div
              v-for="(val, i) in pkg.weekly"
              :key="i"
              class="spark-bar"
              :style="{
                height: sparkBarHeight(val, pkg.weekly) + 'px',
                background: val === sparkMax(pkg.weekly) ? 'var(--nw-primary)' : 'var(--nw-primary-dim)',
              }"
            />
          </div>
          <span class="text-nw-cyan font-bold text-[11px]">{{ formatNumber(pkg.monthly) }}</span>
        </div>
      </div>
    </div>

    <!-- Metrics strip (4 cells — API/Status moved to stats grid) -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-px bg-nw-text-faint">
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
interface NpmPackageData {
  monthly: number
  weekly: number[]
}

interface SignalData {
  github: { contributions: number; weeks: number[][]; publicRepos: number }
  npm: { lumira: NpmPackageData | number; claudeSetup: NpmPackageData | number; nightwire: NpmPackageData | number; total: number }
  api: { version: string; status: string }
}

const { data: raw } = useFetch<{ status: string; data: SignalData }>('/api/signal', {
  server: false,
})

const signal = computed(() => raw.value?.data)

function getNpmPkg(val: NpmPackageData | number | undefined): { monthly: number; weekly: number[] } {
  if (val == null) return { monthly: 0, weekly: [] }
  if (typeof val === 'number') return { monthly: val, weekly: [] }
  return { monthly: val.monthly ?? 0, weekly: val.weekly ?? [] }
}

const npmPackages = computed(() => {
  if (!signal.value) return []
  const lumira = getNpmPkg(signal.value.npm.lumira)
  const nightwire = getNpmPkg(signal.value.npm.nightwire)
  const claudeSetup = getNpmPkg(signal.value.npm.claudeSetup)
  return [
    { name: 'Lumira', ...lumira },
    { name: 'Nightwire', ...nightwire },
    { name: 'Claude-Setup', ...claudeSetup },
  ].filter(p => p.monthly > 0 || p.weekly.length > 0)
})

const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const monthLabels = computed(() => {
  if (!signal.value?.github.weeks.length) return []
  const weeks = signal.value.github.weeks
  const labels: { name: string; index: number }[] = []
  let lastMonth = -1
  const now = new Date()
  weeks.forEach((_, wi) => {
    const approxDate = new Date(now.getTime() - (weeks.length - 1 - wi) * 7 * 24 * 60 * 60 * 1000)
    const month = approxDate.getMonth()
    if (month !== lastMonth) {
      labels.push({ name: MONTH_NAMES[month], index: wi })
      lastMonth = month
    }
  })
  return labels
})

const heatColors = [
  'var(--void-panel)',
  'rgba(102,153,255,0.18)',
  'rgba(80,130,220,0.45)',
  'rgba(90,145,240,0.72)',
  '#6699ff',
]

function sparkMax(weekly: number[]): number {
  return Math.max(...weekly, 1)
}

function sparkBarHeight(val: number, weekly: number[]): number {
  return Math.max(3, (val / sparkMax(weekly)) * 24)
}

function formatNumber(n: number | undefined): string {
  if (n == null) return '...'
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}
</script>

<style scoped>
/* Heatmap — responsive cells fill available width */
.heatmap-grid {
  display: flex;
  justify-content: space-between;
}
.heatmap-col {
  display: flex;
  flex-direction: column;
  gap: clamp(1px, 0.3vw, 3px);
  flex: 1;
  max-width: 20px;
}
.heatmap-cell {
  aspect-ratio: 1;
  width: 100%;
  border-radius: 2px;
  border: 1px solid rgba(102, 153, 255, 0.08);
}

/* Month axis */
.heatmap-axis {
  position: relative;
  height: 12px;
}

/* Sparklines */
.sparkline {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 24px;
}
.spark-bar {
  width: 6px;
  border-radius: 1px;
  min-height: 3px;
}
</style>
