<template>
  <div class="space-y-2 pb-16">
    <!-- HEADER -->
    <div class="panel">
      <div class="panel-header">
        <span>STATUS REPORT</span>
      </div>
      <div class="panel-body p-6 lg:p-8">
        <div class="font-stamp text-nw-cyan text-[10px] tracking-[0.2em] uppercase mb-2">
          FILE: now.md · LAST UPDATED {{ lastUpdated }}
        </div>
        <h1 class="compressed-title text-nw-text leading-[1.05] mb-3" style="font-size: clamp(32px, 6vw, 52px);">
          What I'm working on <span class="text-nw-primary">right now.</span>
        </h1>
        <p class="text-meta">
          Inspired by <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer" class="text-nw-primary hover:text-nw-primary-hot underline">nownownow.com</a>. Updated when life shifts, not on a schedule.
        </p>
      </div>
    </div>

    <!-- NOW PLAYING -->
    <div class="panel">
      <div class="panel-header">
        <span>NOW PLAYING · SPOTIFY</span>
        <NowPlayingBars v-if="nowPlaying?.isPlaying" />
      </div>
      <div class="panel-body p-4">
        <div v-if="nowPlaying?.isPlaying" class="flex items-center gap-4">
          <img
            v-if="nowPlaying.albumArt"
            :src="nowPlaying.albumArt"
            :alt="nowPlaying.album"
            class="w-14 h-14 rounded-sm border border-nw-text-faint/20 shrink-0"
          />
          <div class="flex-1 min-w-0 space-y-1">
            <a
              :href="nowPlaying.spotifyUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="block text-nw-text font-mono text-sm hover:text-nw-primary-hot transition-colors truncate"
            >
              {{ nowPlaying.track }}
            </a>
            <div class="text-nw-text-dim text-xs font-mono truncate">{{ nowPlaying.artist }} · {{ nowPlaying.album }}</div>
            <div class="flex items-center gap-2">
              <span class="text-nw-text-faint text-[10px] font-mono w-8 text-right shrink-0">{{ formatMs(nowPlaying.progressMs) }}</span>
              <div class="flex-1 h-[3px] bg-nw-text-faint/20 rounded-full overflow-hidden">
                <div class="h-full bg-nw-green rounded-full transition-all duration-1000" :style="{ width: progressPercent + '%' }" />
              </div>
              <span class="text-nw-text-faint text-[10px] font-mono w-8 shrink-0">{{ formatMs(nowPlaying.durationMs) }}</span>
            </div>
          </div>
          <a
            :href="nowPlaying.spotifyUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="font-stamp uppercase tracking-[0.14em] text-[10px] text-nw-green hover:text-nw-primary-hot transition-colors shrink-0 hidden sm:block"
          >
            OPEN IN SPOTIFY →
          </a>
        </div>
        <div v-else class="text-nw-text-dim text-xs font-mono py-1">
          Nothing playing right now.
        </div>
      </div>
    </div>

    <!-- AT WORK -->
    <div class="panel">
      <div class="panel-header">
        <span>AT WORK · BLUE MEDICAL GUATEMALA</span>
      </div>
      <div class="panel-body p-6 lg:p-8 space-y-5">
        <div>
          <div class="font-stamp uppercase tracking-[0.14em] text-[10px] text-nw-cyan mb-2">▶ ACTIVELY BUILDING</div>
          <ul class="space-y-3">
            <li class="flex gap-3 text-nw-text-dim leading-relaxed">
              <span class="text-nw-green shrink-0 mt-1">▸</span>
              <span><span class="text-nw-text">sofIA</span> — primary author of a multi-agent voice system for healthcare scheduling, currently in production. Built on ElevenLabs ConvAI + n8n with a FastAPI + Nuxt management platform. Working on extending the agent toolset and tightening the validation layer around the LLM.</span>
            </li>
            <li class="flex gap-3 text-nw-text-dim leading-relaxed">
              <span class="text-nw-green shrink-0 mt-1">▸</span>
              <span><span class="text-nw-text">Payment Service · gateway expansion</span> — extending the multi-gateway abstraction with another payment processor on top of the existing strategies. Strategy Pattern keeps each integration scoped to a DTO, a strategy class, and a dedicated job queue.</span>
            </li>
            <li class="flex gap-3 text-nw-text-dim leading-relaxed">
              <span class="text-nw-green shrink-0 mt-1">▸</span>
              <span><span class="text-nw-text">Payment Service · network tokenization</span> — moving from raw PAN-on-file to network tokens issued by the card scheme on top of the existing VGS card vault. Lower fraud surface, better authorization rates, fewer PCI obligations.</span>
            </li>
            <li class="flex gap-3 text-nw-text-dim leading-relaxed">
              <span class="text-nw-green shrink-0 mt-1">▸</span>
              <span><span class="text-nw-text">Payment Service · security hardening</span> — coverage tests, defense-in-depth on internal routes, retry / idempotency on payment jobs, third-party data sources reviewed and consolidated.</span>
            </li>
          </ul>
        </div>

        <div>
          <div class="font-stamp uppercase tracking-[0.14em] text-[10px] text-nw-primary mb-2">● OWNING IN PRODUCTION</div>
          <p class="text-meta mb-2">
            Systems I built that are now on stable cadence — on-call, bug fixes, occasional hardening, no new feature work right now.
          </p>
          <ul class="space-y-2">
            <li class="flex gap-3 text-nw-text-dim leading-relaxed">
              <span class="text-nw-text-dim shrink-0 mt-1">▸</span>
              <span><span class="text-nw-text">Invoice Service</span> — Guatemala FEL e-invoicing through an authorized provider, with a Strategy Pattern for future provider swaps. SAP integration, multi-establishment support.</span>
            </li>
            <li class="flex gap-3 text-nw-text-dim leading-relaxed">
              <span class="text-nw-text-dim shrink-0 mt-1">▸</span>
              <span><span class="text-nw-text">BlueMeds Platform</span> — medication subscription delivery with 10+ third-party integrations (ERP, support, messaging, healthcare middleware, AI calling).</span>
            </li>
          </ul>
        </div>

        <div>
          <div class="font-stamp uppercase tracking-[0.14em] text-[10px] text-nw-yellow mb-2">◌ ON THE ROADMAP</div>
          <ul class="space-y-2">
            <li class="flex gap-3 text-nw-text-dim leading-relaxed">
              <span class="text-nw-yellow shrink-0 mt-1">▸</span>
              <span>More complex AI chatbots beyond sofIA's scheduling scope. Scope and architecture still being defined — likely multi-agent orchestration with stronger deterministic guardrails.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- BUILDING ON THE SIDE -->
    <div class="panel">
      <div class="panel-header">
        <span>BUILDING ON THE SIDE · ACTIVE</span>
        <NuxtLink to="/projects" class="font-stamp uppercase tracking-wider text-[10px] text-nw-primary hover:text-nw-primary-hot">
          ALL PROJECTS →
        </NuxtLink>
      </div>
      <div class="panel-body p-0">
        <div class="kv-row">
          <span class="kv-label">LUMIRA</span>
          <span class="kv-value">Real-time statusline for Claude Code &amp; Qwen Code · TypeScript, zero runtime deps · published on <a href="https://www.npmjs.com/package/lumira" target="_blank" rel="noopener noreferrer" class="text-nw-primary hover:text-nw-primary-hot">npm</a> · ~1.4k downloads/month</span>
        </div>
        <div class="kv-row">
          <span class="kv-label">VITTBOT</span>
          <span class="kv-value">Multi-agent crypto trading bot · 3 Claude agents + deterministic Risk Manager (10 hard-coded rules, never delegated to AI) · NestJS</span>
        </div>
        <div class="kv-row">
          <span class="kv-label">CLARIFY</span>
          <span class="kv-value">AI legal contract auditor (micro-SaaS, alpha) · Nuxt + Supabase RLS + OpenAI + Stripe credits + BullMQ</span>
        </div>
      </div>
    </div>

    <!-- LEARNING -->
    <div class="panel">
      <div class="panel-header">
        <span>LEARNING / EXPLORING</span>
      </div>
      <div class="panel-body p-6 lg:p-8">
        <ul class="space-y-2">
          <li class="flex gap-3 text-nw-text-dim leading-relaxed">
            <span class="text-nw-cyan shrink-0 mt-1">▸</span>
            <span>Multi-agent LLM orchestration — production-safe pipelines, deterministic safeguards over model choice.</span>
          </li>
          <li class="flex gap-3 text-nw-text-dim leading-relaxed">
            <span class="text-nw-cyan shrink-0 mt-1">▸</span>
            <span>Self-hosted infra observability. The mail server keeps me humble.</span>
          </li>
          <li class="flex gap-3 text-nw-text-dim leading-relaxed">
            <span class="text-nw-cyan shrink-0 mt-1">▸</span>
            <span>Writing more — <a href="https://blog.cativo.dev" target="_blank" rel="noopener noreferrer" class="text-nw-primary hover:text-nw-primary-hot">blog.cativo.dev</a>. Failure-first.</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- LOOKING FOR -->
    <div class="panel">
      <div class="panel-header">
        <span>WHAT I'M LOOKING FOR</span>
      </div>
      <div class="panel-body p-6 lg:p-8">
        <ul class="space-y-2 mb-6">
          <li class="flex gap-3 text-nw-text-dim leading-relaxed">
            <span class="text-nw-primary shrink-0 mt-1">▸</span>
            <span><span class="text-nw-text">Senior backend / Tech Lead / Staff</span> at a company doing real systems work — payments, infra, platform, messy integrations, AI where the validation layer matters.</span>
          </li>
          <li class="flex gap-3 text-nw-text-dim leading-relaxed">
            <span class="text-nw-primary shrink-0 mt-1">▸</span>
            <span><span class="text-nw-text">Remote-first</span> (any TZ, UTC-6 base, US-hours overlap).</span>
          </li>
          <li class="flex gap-3 text-nw-text-dim leading-relaxed">
            <span class="text-nw-primary shrink-0 mt-1">▸</span>
            <span><span class="text-nw-text">Open to relocation</span> for the right role w/ sponsorship.</span>
          </li>
        </ul>

        <div class="flex flex-wrap gap-3">
          <BaseButton href="/resume.pdf" variant="primary">↓ Download CV (PDF)</BaseButton>
          <BaseButton href="mailto:cativo@cativo.dev" variant="secondary">cativo@cativo.dev</BaseButton>
          <BaseButton href="https://linkedin.com/in/cativo23" external variant="ghost">LinkedIn →</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const lastUpdated = '2026-05-01';

const { nowPlaying } = useNowPlaying();

function formatMs(ms?: number): string {
  if (!ms) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

const progressPercent = computed(() => {
  if (!nowPlaying.value?.progressMs || !nowPlaying.value?.durationMs) return 0;
  return Math.min(100, (nowPlaying.value.progressMs / nowPlaying.value.durationMs) * 100);
});

usePageTitle('Now', {
  description: 'What Carlos Cativo is working on right now — at Blue Medical Guatemala, on side projects, on his self-hosted infra, and what kind of next role he\'s looking for.',
});
</script>
