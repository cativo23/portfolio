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
        <h1 class="compressed-title title-lg text-nw-text leading-[1.05] mb-3">
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
            class="w-14 h-14 rounded-sm border border-nw-text-line shrink-0"
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
              <span class="text-nw-text-mute text-[10px] font-mono w-8 text-right shrink-0">{{ formatMs(nowPlaying.progressMs) }}</span>
              <div class="flex-1 h-[3px] bg-nw-text-line rounded-full overflow-hidden">
                <div class="h-full bg-nw-green rounded-full transition-all duration-1000" :style="{ width: progressPercent + '%' }" />
              </div>
              <span class="text-nw-text-mute text-[10px] font-mono w-8 shrink-0">{{ formatMs(nowPlaying.durationMs) }}</span>
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
              <span><span class="text-nw-text">CCCV CRM</span> — building the internal CRM for Blue Medical's commercial and medical operations. Laravel backend wired to the existing service mesh, centralizing doctor affiliations, commercial workflows, and scheduling data.</span>
            </li>
          </ul>
        </div>

        <div>
          <div class="font-stamp uppercase tracking-[0.14em] text-[10px] text-nw-primary mb-2">● OWNING IN PRODUCTION</div>
          <p class="text-meta mb-2">
            Systems I built that are now on stable cadence — maintenance, hardening, and incremental improvements rather than ground-up new builds.
          </p>
          <ul class="space-y-2">
            <li class="flex gap-3 text-nw-text-dim leading-relaxed">
              <span class="text-nw-text-dim shrink-0 mt-1">▸</span>
              <span><span class="text-nw-text">sofIA</span> — primary author of a multi-agent voice system for healthcare scheduling, live in production. Built on ElevenLabs ConvAI + n8n with a FastAPI + Nuxt management platform. Recently tightened the validation layer around the LLM; now extending it to a WhatsApp confirmation channel alongside voice.</span>
            </li>
            <li class="flex gap-3 text-nw-text-dim leading-relaxed">
              <span class="text-nw-text-dim shrink-0 mt-1">▸</span>
              <span><span class="text-nw-text">Payment Service</span> — multi-gateway abstraction stable in production, recently extended with a new payment provider. Strategy Pattern keeps each integration scoped to its own DTO, strategy class, and job queue.</span>
            </li>
            <li class="flex gap-3 text-nw-text-dim leading-relaxed">
              <span class="text-nw-text-dim shrink-0 mt-1">▸</span>
              <span><span class="text-nw-text">Invoice Service</span> — Guatemala FEL e-invoicing through an authorized provider, with a Strategy Pattern for future provider swaps. SAP integration, multi-establishment support. Now expanding the tax-model seam to support Costa Rica.</span>
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
          <span class="kv-value">Real-time statusline for Claude Code &amp; Qwen Code · TypeScript, zero runtime deps · v1.14 shipped with subagent-aware rendering and git-worktree fallback · published on <a href="https://www.npmjs.com/package/lumira" target="_blank" rel="noopener noreferrer" class="text-nw-primary hover:text-nw-primary-hot">npm</a> · ~4k downloads/month</span>
        </div>
        <div class="kv-row">
          <span class="kv-label">NOVA-ID</span>
          <span class="kv-value">Self-hosted identity &amp; SSO platform (OIDC via Ory Hydra) with a role/permissions demo API · actively hardening auth flows and audit logging</span>
        </div>
        <div class="kv-row">
          <span class="kv-label">NIGHTWIRE</span>
          <span class="kv-value">Compressed dark design system for developer tools · semantic tokens, intensity scale, Tailwind plugin · published on <a href="https://www.npmjs.com/package/@cativo23/nightwire" target="_blank" rel="noopener noreferrer" class="text-nw-primary hover:text-nw-primary-hot">npm</a> · v2 shipped</span>
        </div>
        <div class="kv-row">
          <span class="kv-label">KOVIA</span>
          <span class="kv-value">Smart pet adoption platform · connects rescue organizations with adopters via an automated scoring engine · NestJS + Nuxt 4 + Prisma + BullMQ</span>
        </div>
        <div class="kv-row">
          <span class="kv-label">VITTBOT</span>
          <span class="kv-value">Multi-agent crypto trading bot · 3 Claude agents + deterministic Risk Manager (10 hard-coded rules, never delegated to AI) · NestJS</span>
        </div>
        <div class="kv-row">
          <span class="kv-label">CLARIFY</span>
          <span class="kv-value">AI legal contract auditor (micro-SaaS, alpha) · Nuxt + Supabase RLS + OpenAI + Stripe credits + BullMQ</span>
        </div>
        <div class="kv-row">
          <span class="kv-label">THIS SITE</span>
          <span class="kv-value">The AI chat on this site is mine end-to-end · public chatbot grounded on my CV, now with multi-turn conversation memory and honest fit-boundary framing for comp/role questions · NestJS + Groq + Redis answer-cache · hardened against prompt-injection with a deterministic output sanitizer</span>
        </div>
      </div>
    </div>

    <!-- SELF-HOSTED -->
    <div class="panel">
      <div class="panel-header">
        <span>RUNNING / SELF-HOSTED</span>
      </div>
      <div class="panel-body p-6 lg:p-8">
        <p class="text-meta mb-4">
          This site, its API, and my side projects all run on infrastructure I operate myself — no managed PaaS.
        </p>
        <ul class="space-y-2">
          <li class="flex gap-3 text-nw-text-dim leading-relaxed">
            <span class="text-nw-cyan shrink-0 mt-1">▸</span>
            <span>A Hetzner VPS running everything in Docker Compose, behind Traefik as the reverse proxy and TLS terminator.</span>
          </li>
          <li class="flex gap-3 text-nw-text-dim leading-relaxed">
            <span class="text-nw-cyan shrink-0 mt-1">▸</span>
            <span>Self-hosted observability — metrics, uptime monitoring (alerting to Discord), and container log aggregation — so I see problems before visitors do. Admin dashboards sit behind a WireGuard VPN, not exposed to the internet.</span>
          </li>
          <li class="flex gap-3 text-nw-text-dim leading-relaxed">
            <span class="text-nw-cyan shrink-0 mt-1">▸</span>
            <span>GitFlow CI/CD: a release branch triggers an automated GitHub Release, image build, and zero-touch deploy over SSH. Merge to main, walk away.</span>
          </li>
        </ul>
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
            <span>Multi-agent LLM orchestration — production-safe pipelines, deterministic safeguards over model choice, failure modes that don't require a rollback.</span>
          </li>
          <li class="flex gap-3 text-nw-text-dim leading-relaxed">
            <span class="text-nw-cyan shrink-0 mt-1">▸</span>
            <span>LLM evals and prompt engineering — output scoring, rubric-based benchmarks, systematic regression testing for AI pipelines. Making "does this actually work" answerable.</span>
          </li>
          <li class="flex gap-3 text-nw-text-dim leading-relaxed">
            <span class="text-nw-cyan shrink-0 mt-1">▸</span>
            <span>Payment network internals — network tokenization, card scheme authorization flows, PCI scope reduction. Goes deeper than most backend engineers need, but I'm already here.</span>
          </li>
          <li class="flex gap-3 text-nw-text-dim leading-relaxed">
            <span class="text-nw-cyan shrink-0 mt-1">▸</span>
            <span>Application security in practice — I ran an owner-authorized pentest against my own stack, then shipped the fixes: enforced CSP, real rate-limiting, prompt-injection defenses, and key-only SSH. Security as something you do, not just read about.</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- LOOKING FOR -->
    <div class="panel">
      <div class="panel-header">
        <span>WHAT I'M LOOKING FOR</span>
      </div>
      <div class="panel-body p-0">
        <div class="kv-row">
          <span class="kv-label">ROLE</span>
          <span class="kv-value"><span class="text-nw-text">Senior backend or tech lead</span> at a company building real systems — payments, AI in production where the validation layer is the hard part, distributed services, the kind of work where the messy parts are the interesting parts.</span>
        </div>
        <div class="kv-row">
          <span class="kv-label">LOCATION</span>
          <span class="kv-value"><span class="text-nw-text">Remote</span> · UTC-6, works well with US hours.</span>
        </div>
        <div class="kv-row">
          <span class="kv-label">STATUS</span>
          <span class="kv-value">Not actively applying, but open to the right conversation. If what you're building sounds like it belongs on this page, reach out.</span>
        </div>

        <div class="flex flex-wrap gap-3 p-6 lg:p-8 border-t border-nw-text-line">
          <BaseButton href="/resume.pdf" variant="primary">↓ Download CV (PDF)</BaseButton>
          <BaseButton href="mailto:cativo@cativo.dev" variant="secondary">cativo@cativo.dev</BaseButton>
          <BaseButton href="https://linkedin.com/in/carlos-cativo" external variant="ghost">LinkedIn →</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NowPlayingBars from '~/components/ui/NowPlayingBars.vue';

const lastUpdated = '2026-07-14';

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
