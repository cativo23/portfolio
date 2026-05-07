<template>
  <div class="space-y-2 pb-16">
    <template v-if="profile">
      <!-- BRIEFING -->
      <div class="panel">
        <div class="panel-header">
          <span>OPERATIVE BRIEFING</span>
        </div>
        <div class="panel-body p-6 lg:p-8">
          <div class="font-stamp text-nw-cyan text-[10px] tracking-[0.2em] uppercase mb-2">
            FILE: about.md · CLASSIFICATION: PUBLIC
          </div>

          <h1
            class="compressed-title text-nw-text leading-[1.05] mb-3"
            style="font-size: clamp(36px, 7vw, 64px);"
          >
            Tech Lead. <br class="hidden sm:block" />
            El Salvador. <br class="hidden sm:block" />
            <span class="text-nw-primary">9 years</span> in production.
          </h1>

          <div class="font-mincho text-nw-primary-dim mb-6" style="font-size: 16px;">
            技術主任 · 九年間の実戦経験
          </div>

          <p class="lede mb-3">
            Senior backend engineer and Tech Lead. Currently leading development at <span class="text-nw-text">Blue Medical Guatemala</span> — payment processing, e-invoicing, and healthcare platform work.
          </p>
          <p class="text-meta mb-6">
            Based in El Salvador (UTC-6) · Full overlap with US business hours · EN/ES bilingual.
          </p>

          <div class="flex items-center gap-3 mb-2">
            <span class="led green blink"></span>
            <span class="text-meta text-nw-green font-stamp uppercase tracking-wider">
              OPEN TO OPPORTUNITIES · SENIOR BACKEND / TECH LEAD / STAFF
            </span>
          </div>
          <p class="text-meta">
            Remote-first (any timezone). Open to relocation for the right role with sponsorship.
          </p>
        </div>
      </div>

      <!-- BACKGROUND -->
      <div class="panel">
        <div class="panel-header">
          <span>BACKGROUND</span>
        </div>
        <div class="panel-body p-6 lg:p-8 space-y-5">
          <p
            v-for="(paragraph, index) in summaryParagraphs"
            :key="index"
            class="text-nw-text-dim leading-relaxed"
            v-html="formatSummaryParagraph(paragraph)"
          />
        </div>
      </div>

      <!-- DEPLOYMENT HISTORY -->
      <div class="panel">
        <div class="panel-header">
          <span>DEPLOYMENT HISTORY</span>
          <NuxtLink to="/cv" class="font-stamp uppercase tracking-wider text-[10px] text-nw-primary hover:text-nw-primary-hot">
            FULL CV →
          </NuxtLink>
        </div>
        <div class="panel-body p-0">
          <div
            v-for="entry in profile.experience"
            :key="entry.company"
            class="px-5 py-4 border-b border-nw-text-faint last:border-b-0"
          >
            <div class="flex items-baseline justify-between gap-3 flex-wrap mb-1">
              <div class="flex items-baseline gap-3 flex-wrap">
                <span class="compressed-title title-card text-nw-text">{{ entry.company }}</span>
                <span class="font-stamp uppercase tracking-wider text-[10px] text-nw-cyan">{{ entry.role }}</span>
              </div>
              <span class="font-stamp uppercase tracking-wider text-[10px] text-nw-text-dim">
                {{ entry.period }}
              </span>
            </div>
            <p class="text-meta">{{ entry.description }}</p>
          </div>
        </div>
      </div>

      <!-- CERTIFIED LOADOUT (Stack) -->
      <div class="panel">
        <div class="panel-header">
          <span>CERTIFIED LOADOUT</span>
        </div>
        <table class="nw-table">
          <thead>
            <tr>
              <th class="w-[140px] md:w-[180px]">CATEGORY</th>
              <th>STACK</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in profile.skills" :key="category.name">
              <td class="text-nw-primary uppercase tracking-wide">{{ category.name }}</td>
              <td>{{ category.skills.map(s => s.name).join(' · ') }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- WRITING -->
      <div class="panel">
        <div class="panel-header">
          <span>WRITING</span>
          <a
            href="https://blog.cativo.dev"
            target="_blank"
            rel="noopener noreferrer"
            class="text-nw-primary hover:text-nw-primary-hot text-[10px] font-stamp uppercase tracking-wider"
          >
            BLOG.CATIVO.DEV →
          </a>
        </div>
        <div class="panel-body p-6 lg:p-8">
          <p class="text-nw-text-dim leading-relaxed">
            Failure-first writeups — migrations that broke, audits, the day my server caught fire. Mostly written when I'm angry about something I shipped.
          </p>
        </div>
      </div>

      <!-- LATEST POSTS (standalone) -->
      <LatestPosts />

      <!-- OFF-DUTY -->
      <div class="panel">
        <div class="panel-header">
          <span>OFF-DUTY</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-nw-text-faint">
          <div
            v-for="item in profile?.outsideCode"
            :key="item.title"
            class="bg-void-warm p-5 flex flex-col gap-2"
          >
            <div class="flex items-center gap-2">
              <span class="text-nw-text" style="font-size: 22px; line-height: 1;">{{ item.icon }}</span>
              <div class="font-stamp uppercase tracking-[0.14em] text-[11px] text-nw-primary">
                {{ item.title }}
              </div>
            </div>
            <p class="text-meta">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <!-- CLOSING / CONTACT REQUEST -->
      <div class="panel">
        <div class="panel-header">
          <span>GET IN TOUCH</span>
        </div>
        <div class="panel-body p-6 lg:p-8">
          <p class="text-nw-text leading-relaxed mb-6">
            Building something remote that needs payment systems shipped under pressure, multi-agent AI with real safeguards, or a healthcare integration untangled at midnight? Let's talk.
          </p>

          <div class="flex flex-wrap gap-3 items-center">
            <BaseButton href="/resume.pdf" variant="primary">
              ↓ Download CV (PDF)
            </BaseButton>
            <BaseButton to="/cv" variant="secondary">
              View CV →
            </BaseButton>
            <BaseButton href="mailto:cativo@cativo.dev" variant="secondary">
              cativo@cativo.dev
            </BaseButton>
            <BaseButton href="https://linkedin.com/in/carlos-cativo" external variant="ghost">
              LinkedIn →
            </BaseButton>
            <BaseButton :href="profile?.github" external variant="ghost">
              GitHub →
            </BaseButton>
            <BaseButton to="/projects" variant="ghost">
              Case files →
            </BaseButton>
          </div>
          <p class="mt-4 text-meta font-stamp uppercase tracking-wider">
            Or <a href="https://calendly.com/cativo23" target="_blank" rel="noopener noreferrer" class="text-nw-primary hover:text-nw-primary-hot">book 30 min directly →</a>
          </p>
        </div>
      </div>

    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import LatestPosts from '@/components/home/LatestPosts.vue';
import type { Profile } from '~/types/profile';

usePageTitle('About', {
  description: 'Carlos Cativo - Tech Lead & Full-Stack Software Engineer. 9 years building healthcare platforms, payment systems, and AI-powered products.',
});

const profile: Profile = {
  name: 'Carlos Cativo',
  title: 'Tech Lead / Full-Stack Engineer',
  yearsOfExperience: 9,
  location: 'El Salvador',
  summary: [
    "9 years writing backends in El Salvador. Most of that has been microservices and full-stack tech leadership at Blue Medical Guatemala — leading BlueMeds end-to-end (Laravel API + Angular/Ionic admin), then breaking out Payment Service and Invoice Service as standalone Laravel microservices that real clinics bill against every day. The fintech and tax stack down here is hard in a specific way: no nice SDKs, sparse docs, legacy SOAP/XML on top of legacy SOAP/XML. I've implemented Visa ISO 8583 over SOAP by hand. I've integrated Guatemala's FEL e-invoicing through an authorized provider, with a Strategy Pattern designed so the next provider is a config swap, not a rewrite. Long enough in this stack to know when the framework is the wrong choice — and I have the incident reports to prove it.",
    "The last ~6 months I've been extending into AI work on top of the backend foundation. I'm the primary author of sofIA, a multi-agent voice system at Blue Medical for healthcare scheduling on ElevenLabs ConvAI, currently in production. Most of the engineering work has been on the parts AI demos skip: state-machine workflow design, validation layers around tool calls, retry and recovery logic, and the operations dashboard the team uses to see what the agent actually did. On the side: VittBot, a multi-agent crypto trading bot with three Claude agents plus a deterministic Risk Manager that never delegates the actual go/no-go to AI; Clarify, a legal contract auditor with Stripe credit billing. The pattern I care about isn't \"call an LLM\" — it's the deterministic safeguards around the LLM that keep it from blowing up in production.",
    "I also run my own infra at cativo.dev — 16 containers, 6 stacks. Running it yourself is the only way to actually understand what you ship into prod."
  ],
  experience: [
    {
      role: 'Tech Lead / Full-Stack Engineer',
      company: 'Blue Medical Guatemala',
      period: 'Apr 2022 → Present · 3+ yrs',
      location: 'Guatemala (Remote)',
      description: "Leading development across multiple healthcare systems simultaneously. Code reviews, requirement refinement, technical guidance for the team, and hands-on delivery of the hardest parts.",
      highlights: [
        "sofIA — Multi-agent voice system for healthcare scheduling, currently in production. Primary author of a state-machine workflow on ElevenLabs ConvAI + n8n with deterministic validation, retry, and recovery layers around tool calls. Designed the management platform: FastAPI API + Nuxt dashboard + Typer CLI.",
        "Payment Service — Built from scratch in Laravel. Multi-gateway abstraction (Strategy Pattern) over multiple processors (ISO 8583 over SOAP, SOAP/XML, REST). VGS card vault for PCI-friendly tokenization — raw PAN never touches the service DB. Per-commerce / per-card-token gateway routing. Async via Horizon with dedicated queues per gateway. Livewire ops dashboard with KPIs and per-commerce breakdowns. Led an OWASP-grade security audit, plus ongoing hardening waves (defense-in-depth on internal routes, retry / idempotency on payment jobs, network tokenization on top of the vault).",
        "Invoice Service — Built from scratch in Laravel. Integrates Guatemala's FEL e-invoicing through an authorized provider, with a Strategy Pattern designed for future provider swaps. SAP integration, async pipeline via Redis/Horizon, QR code generation, multi-establishment support, Livewire analytics dashboard.",
        "BlueMeds API — Core developer on medication subscription platform. 10+ third-party integrations across ERP, support tools, messaging, AI calling, and healthcare middleware. PostgreSQL with Meilisearch full-text and JSONB expression indexes.",
        "BlueMeds Admin Panel — Angular/Ionic admin for the pharmaceutical platform with i18n EN/ES, Capacitor mobile build, Tailwind."
      ],
      tags: ['Laravel', 'NestJS', 'Python', 'Angular', 'Vue/Nuxt', 'ISO 8583', 'FEL', 'ElevenLabs', 'n8n', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'Bitbucket Pipelines']
    },
    {
      role: 'Backend Developer',
      company: 'OrangeSoftCo (Publimovil Regional)',
      period: 'Sep 2020 – Apr 2022 · 1.5 yrs',
      location: 'San Marcos, El Salvador',
      description: "Rebuilt the Y.O.D.A. platform as a microservices architecture, improving application performance by 30%. Improved CI/CD pipelines in GitLab, cutting build time by 20%. Implemented inter-service communication via Redis Streams.",
      tags: ['Laravel', 'FastAPI', 'Python', 'MySQL', 'Redis Streams', 'Docker', 'Kubernetes', 'GitLab CI/CD', 'DigitalOcean']
    },
    {
      role: 'Senior Developer',
      company: 'Mussol (TripXpertz)',
      period: 'Apr 2017 – Sep 2020 · 3.5 yrs',
      location: 'El Salvador',
      description: "Built an internal dashboard managing 100+ travel websites, streamlining administration workflows. Set up CI/CD on AWS to improve deployment time and reliability. Developed mobile games in C#/Unity.",
      tags: ['Laravel', 'MySQL', 'AWS', 'C# / Unity']
    },
    {
      role: 'B.Sc. Computer Systems Engineering',
      company: 'Universidad de El Salvador',
      period: '2023',
      location: 'Education',
      description: "Specialization in Cloud Infrastructure.",
      tags: []
    }
  ],
  skills: [
    { name: 'Backend', skills: [{ name: 'Laravel' }, { name: 'NestJS' }, { name: 'FastAPI / TypeScript' }, { name: 'PHP' }, { name: 'Python / REST' }, { name: 'GraphQL' }, { name: 'SOAP/XML' }]},
    { name: 'Frontend', skills: [{ name: 'Vue/Nuxt' }, { name: 'Angular' }, { name: 'Ionic / TailwindCSS' }, { name: 'TypeScript / full-stack when needed' }]},
    { name: 'Data', skills: [{ name: 'PostgreSQL' }, { name: 'MySQL / Redis' }, { name: 'Meilisearch' }, { name: 'Supabase / Prisma' }, { name: 'TypeORM' }, { name: 'SQLAlchemy' }]},
    { name: 'Infra & DevOps', skills: [{ name: 'Docker' }, { name: 'AWS (S3, ECR, EC2) / Traefik' }, { name: 'Nginx' }, { name: 'Cloudflare / GitHub Actions' }, { name: 'Bitbucket Pipelines' }]},
    { name: 'Specialty', skills: [{ name: 'ISO 8583 over SOAP' }, { name: 'Multi-gateway payment processing' }, { name: 'VGS card vault tokenization' }, { name: 'Network tokenization' }, { name: 'Multi-provider FEL integration' }, { name: 'SAP integration' }, { name: 'Ory IAM (Kratos / Hydra / Keto)' }, { name: 'Multi-agent LLM systems' }]},
    { name: 'Integrations', skills: [{ name: 'Stripe' }, { name: 'Odoo ERP' }, { name: 'WhatsApp / Botmaker' }, { name: 'FreshDesk' }, { name: 'SAP' }, { name: 'Bland AI' }, { name: 'ElevenLabs ConvAI' }, { name: 'n8n' }, { name: 'Claude / OpenAI APIs' }]},
  ],
  outsideCode: [
    {
      title: 'Three rescued dogs',
      icon: '🐕',
      description: 'Nova, Vitto, and Kovu. They name the projects. They have strong opinions about standups.'
    },
    {
      title: 'Civic Type R FK8',
      icon: '🚗',
      description: 'Rallye Red. I\'ll track it someday. The rev counter has opinions about my schedule.'
    },
    {
      title: 'Keyboards & IEMs',
      icon: '⌨️',
      description: 'Truthear ZERO:RED currently in rotation. The collection is larger than I\'ll admit in writing.'
    },
    {
      title: 'Linux ricing',
      icon: '🖥️',
      description: 'Hyprland on Arch with a Tokyo Night cyberdeck Waybar. The dotfiles are on GitHub if you\'re into that kind of suffering.'
    },
    {
      title: 'Cyberpunk & sci-fi',
      icon: '🎌',
      description: 'Akira, Evangelion, Ghost in the Shell. The visual language of this site is not an accident.'
    },
    {
      title: 'Self-hosting tinkering',
      icon: '📡',
      description: 'cativo.dev runs apps, blog, mail, and monitoring — 16 containers across 6 stacks. Nothing teaches infra like running your own.'
    }
  ],
  github: 'https://github.com/cativo23',
  linkedin: 'https://linkedin.com/in/carlos-cativo',
  website: 'https://cativo.dev',
};

const summaryParagraphs = computed(() => {
  if (!profile.summary) return [];
  if (typeof profile.summary === 'string') {
    return [profile.summary];
  }
  return profile.summary;
});

// Safe: input is hardcoded profile.summary above, never from external/user sources
function formatSummaryParagraph(text: string) {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return escaped
    .replace(/(9 years)/g, '<span class="text-nw-cyan font-semibold">$1</span>')
    .replace(/(sofIA|VittBot|Clarify)/g, '<span class="text-nw-purple font-medium">$1</span>')
    .replace(/(Visa ISO 8583|Invoice Service|FEL|cativo\.dev)/g, '<span class="text-nw-primary font-medium">$1</span>')
}
</script>
