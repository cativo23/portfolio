<template>
  <div class="space-y-16 pb-16">
    <template v-if="profile">
      <!-- Hero -->
      <section class="pt-8">
        <p class="text-tokyo-night-cyan font-mono text-sm mb-6 flex items-center">
          <span class="text-tokyo-night-purple mr-2">❯</span> about.md
        </p>
        
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold font-mono leading-tight mb-8">
          Tech Lead. <br class="hidden sm:block" />
          <span class="text-tokyo-night-purple">El Salvador.</span> <br class="hidden sm:block" />
          9 years in production.
        </h1>
        
        <p class="text-lg text-tokyo-night-muted max-w-3xl mb-8 leading-relaxed">
          I lead development of healthcare platforms, payment microservices, and AI-powered systems — real money, real patients, real conversations. Currently at <span class="text-tokyo-night-purple">Blue Medical</span>, Guatemala, remote.
        </p>
        
        <div class="flex items-center gap-2 mb-4">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-tokyo-night-green opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-tokyo-night-green"></span>
          </span>
          <span class="text-sm font-mono text-tokyo-night-green">available for new engagements — sv timezone (UTC-6)</span>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <span class="px-3 py-1 text-xs font-mono rounded-full border border-tokyo-night-cyan text-tokyo-night-cyan">✓ remote contracts</span>
          <span class="px-3 py-1 text-xs font-mono rounded-full border border-tokyo-night-cyan text-tokyo-night-cyan">✓ freelance projects</span>
          <span class="px-3 py-1 text-xs font-mono rounded-full border border-tokyo-night-cyan text-tokyo-night-cyan">✓ consulting</span>
          <span class="px-3 py-1 text-xs font-mono rounded-full border border-tokyo-night-gray/50 text-tokyo-night-muted">◦ open to relocation</span>
        </div>
      </section>

      <!-- Background -->
      <section class="max-w-full overflow-hidden">
        <BaseSectionHeading title="Background" />
        <div class="space-y-6 break-words">
          <p v-for="(paragraph, index) in summaryParagraphs" :key="index"
             class="pl-4 border-l-2 border-tokyo-night-gray/30 hover:border-tokyo-night-cyan transition-colors duration-300 text-tokyo-night-text/90 leading-relaxed max-w-full break-words"
             v-html="formatSummaryParagraph(paragraph)" />
        </div>
      </section>

      <!-- Experience -->
      <section>
        <BaseSectionHeading title="Experience" />
        <Timeline :items="profile.experience" class="mb-12" />
        
        <!-- CV Strip -->
        <div class="border-l-2 border-tokyo-night-cyan bg-tokyo-night-dark/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-tokyo-night-text">Want the full picture? Full CV available on request — roles, projects, references.</p>
          <BaseButton to="/contact" variant="primary" class="shrink-0 font-mono text-sm">
            ❯ request CV →
          </BaseButton>
        </div>
      </section>

      <!-- Stack -->
      <section>
        <BaseSectionHeading title="Stack" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="category in profile.skills" :key="category.name" class="p-4 border border-tokyo-night-gray/30 rounded-lg bg-tokyo-night-dark/20">
            <h4 class="text-sm font-mono text-tokyo-night-purple mb-2">{{ category.name }}</h4>
            <div class="text-sm text-tokyo-night-text/80 leading-relaxed">
              {{ category.skills.map(s => s.name).join(' · ') }}
            </div>
          </div>
        </div>
      </section>

      <!-- Side Projects (Featured Projects) -->
      <PortfolioSection />

      <!-- Outside code -->
      <section>
        <BaseSectionHeading title="Outside code" />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="item in profile?.outsideCode" :key="item.title" class="p-5 border border-tokyo-night-gray/20 rounded-lg">
            <div class="text-2xl mb-3">{{ item.icon }}</div>
            <h4 class="font-bold text-tokyo-night-text mb-2">{{ item.title }}</h4>
            <p class="text-sm text-tokyo-night-text/70">{{ item.description }}</p>
          </div>
        </div>
      </section>

      <!-- Closing -->
      <section class="py-8 border-t border-tokyo-night-gray/20 max-w-full overflow-hidden">
        <div class="max-w-full break-words">
          <p class="text-lg text-tokyo-night-text/90 mb-6 leading-relaxed">
            I'm not here to leverage synergies or bring passion to your tech stack. I'm here to build backends that don't embarrass you in production — clean APIs, real test coverage, systems that fail gracefully and recover faster.
          </p>
          <p class="text-lg text-tokyo-night-text/90 mb-10 leading-relaxed">
            If you're building something remotely and need someone who's shipped payment systems under pressure, designed multi-agent AI pipelines, or untangled a healthcare integration at midnight — I want to hear about it. No long intake forms. Just a conversation.
          </p>
          
          <div class="flex flex-wrap gap-4">
            <BaseButton to="/contact" variant="primary" class="font-mono">
              ❯ get in touch
            </BaseButton>
            <BaseButton href="https://calendly.com/cativo23" external variant="secondary" class="font-mono">
              ❯ book a call
            </BaseButton>
            <BaseButton to="/projects" variant="ghost" class="font-mono">
              ❯ see my work
            </BaseButton>
            <BaseButton :href="profile?.github" external variant="ghost" class="font-mono">
              ❯ github
            </BaseButton>
          </div>
        </div>
      </section>

    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import Timeline from '@/components/about/Timeline.vue';
import PortfolioSection from '@/components/home/portfolio/PortfolioSection.vue';
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
    "I've spent the last 9 years building production systems in El Salvador — a market where fintech infrastructure is genuinely hard. No nice SDKs. I've implemented Visa ISO 8583 over SOAP by hand, built Guatemala's FEL electronic invoicing system from scratch, and designed payment microservices that handle real billing across multiple healthcare clinics daily.",
    "My primary stack is Laravel, NestJS, FastAPI, and Vue/Nuxt, running on Docker, deployed to AWS. I've been building on top of these long enough to know when the framework is the wrong choice — and to have the production incidents to back that up.",
    "The last two years I've gone deep into AI-powered systems: marIA, a voice agent handling automated patient scheduling in Spanish via ElevenLabs ConvAI; VittBot, a multi-agent crypto trading bot with three independent Claude agents plus a deterministic risk manager; Clarify, an AI legal contract auditor with Stripe billing. I don't just call AI APIs — I design the validation layers, retry logic, and safeguards that make them production-safe.",
    "I also run my own production infrastructure at cativo.dev — Traefik, Prometheus, Uptime Kuma, self-hosted mail, monitoring stack. Not because it's cheaper, but because it's the only way to actually understand what you're deploying to."
  ],
  experience: [
    {
      role: 'Tech Lead / Full-Stack Engineer',
      company: 'Blue Medical Guatemala',
      period: 'Apr 2022 → Present · 3+ yrs',
      location: 'Guatemala (Remote)',
      description: "Leading development across multiple healthcare systems simultaneously. Code reviews, requirement refinement, technical guidance for the team, and hands-on delivery of the hardest parts.",
      highlights: [
        "marIA — AI voice agent for automated patient scheduling via ElevenLabs ConvAI + n8n. Resolved bugs affecting 42% of conversations (STT misfires, language leakage, infinite retry loops). Designed the full management platform: FastAPI API + Nuxt dashboard + Typer CLI.",
        "Payment Service — Built from scratch. Visa ISO 8583, BAC SOAP/XML, card tokenization, reversals, webhook handling. Led 6-agent parallel security audit (OWASP: hardcoded secrets, Sanctum token expiration, CORS, PHP EOL).",
        "Invoice Service — Built from scratch. Guatemala FEL tax system via Megaprint, Strategy Pattern for provider swaps, SAP integration, async pipeline via Redis/Horizon, QR code generation, multi-establishment support.",
        "BlueMeds Platform — Core developer on medication subscription platform. 10+ integrations: Odoo ERP, WhatsApp/Botmaker, FreshDesk, Bland AI, VivoLife, payment APIs.",
        "BlueMeds Admin Panel — Angular/Ionic admin panel for the pharmaceutical platform."
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
      period: '2014 – 2021',
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
    { name: 'Specialty', skills: [{ name: 'Multi-agent LLM systems / ISO 8583' }, { name: 'FEL invoicing' }, { name: 'SAP / ElevenLabs ConvAI' }, { name: 'Ory IAM' }]},
    { name: 'AI / Integrations', skills: [{ name: 'Claude API' }, { name: 'OpenAI' }, { name: 'ElevenLabs / n8n' }, { name: 'Stripe' }, { name: 'Odoo ERP / Botmaker' }, { name: 'FreshDesk' }, { name: 'Bland AI' }]},
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

function formatSummaryParagraph(text: string) {
  return text
    .replace(/(9 years)/g, '<span class="text-tokyo-night-cyan font-semibold">$1</span>')
    .replace(/(marIA|VittBot|Clarify)/g, '<span class="text-tokyo-night-purple font-medium">$1</span>')
    .replace(/(Visa ISO 8583|FEL|AI-powered systems)/g, '<span class="text-tokyo-night-blue font-medium">$1</span>');
}

function getStatusClass(status: string) {
  switch(status) {
    case 'live':
    case 'completed': return 'text-tokyo-night-green border-tokyo-night-green/30 bg-tokyo-night-green/10';
    case 'active':
    case 'in-progress': return 'text-tokyo-night-cyan border-tokyo-night-cyan/30 bg-tokyo-night-cyan/10';
    case 'alpha': return 'text-tokyo-night-yellow border-tokyo-night-yellow/30 bg-tokyo-night-yellow/10';
    case 'mvp':
    case 'planning': return 'text-tokyo-night-purple border-tokyo-night-purple/30 bg-tokyo-night-purple/10';
    default: return 'text-tokyo-night-muted border-tokyo-night-gray/30 bg-tokyo-night-dark';
  }
}
</script>
