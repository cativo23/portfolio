<template>
  <div class="space-y-12">
    <!-- About Me -->
    <section>
      <BaseSectionHeading title="About Me" />
      <BaseCard :hoverable="false">
        <div class="space-y-4 text-tokyo-night-text leading-relaxed">
          <p>
            Remote Tech Lead and Full-Stack Software Engineer based in El Salvador with
            <span class="text-tokyo-night-cyan font-semibold">9 years of experience</span>.
            Currently leading development at
            <span class="text-tokyo-night-purple font-semibold">Blue Medical</span> (Guatemala),
            building healthcare platforms, payment processing services, and conversational AI agents.
          </p>
          <p>
            I've built microservices from scratch handling payment gateway integrations
            (Visa ISO 8583, SOAP/XML), electronic invoicing systems (FEL), and a voice AI agent
            that automates patient scheduling via natural conversation in Spanish.
          </p>
          <p>
            On the side, I build multi-agent AI trading bots, AI-powered legal contract auditors,
            and open-source developer tooling. I also self-host my own production infrastructure
            on this domain.
          </p>
        </div>
      </BaseCard>
    </section>

    <!-- Career Timeline -->
    <section>
      <BaseSectionHeading title="Career Timeline" :level="3" />
      <BaseCard :hoverable="false">
        <Timeline :items="timeline" />
      </BaseCard>
    </section>

    <!-- Work Experience -->
    <section>
      <BaseSectionHeading title="Work Experience" :level="3" />
      <div class="space-y-6">
        <ExperienceCard
          v-for="exp in experiences"
          :key="exp.company"
          :company="exp.company"
          :role="exp.role"
          :period="exp.period"
          :location="exp.location"
          :description="exp.description"
          :achievements="exp.achievements"
          :tech="exp.tech"
        />
      </div>
    </section>

    <!-- Key Differentiators -->
    <section>
      <BaseSectionHeading title="What I Bring" :level="3" />
      <BaseCard :hoverable="false">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="diff in differentiators"
            :key="diff.title"
            class="flex gap-3 p-3 rounded-lg bg-tokyo-night-dark/50 border border-tokyo-night-gray/20"
          >
            <span class="text-tokyo-night-cyan mt-0.5 shrink-0">
              <component :is="diff.icon" class="w-5 h-5" />
            </span>
            <div>
              <h4 class="text-sm font-bold text-tokyo-night-text mb-1">{{ diff.title }}</h4>
              <p class="text-xs text-tokyo-night-muted leading-relaxed">{{ diff.description }}</p>
            </div>
          </div>
        </div>
      </BaseCard>
    </section>

    <!-- Skills -->
    <section>
      <BaseSectionHeading title="Technical Skills" :level="3" />
      <SkillsGrid :categories="skillCategories" />
    </section>

    <!-- Education -->
    <section>
      <BaseSectionHeading title="Education" :level="3" />
      <BaseCard :hoverable="false">
        <div class="flex items-start gap-3">
          <LucideGraduationCap class="w-6 h-6 text-tokyo-night-purple mt-1 shrink-0" />
          <div>
            <h4 class="font-bold text-tokyo-night-text">B.Sc. in Computer Systems Engineering</h4>
            <p class="text-tokyo-night-cyan font-mono text-sm">Universidad de El Salvador</p>
            <p class="text-tokyo-night-muted text-xs mt-1">2014 - 2021</p>
            <p class="text-tokyo-night-muted text-xs mt-1">Specialization in Cloud Infrastructure</p>
          </div>
        </div>
      </BaseCard>
    </section>

    <!-- API Info -->
    <section>
      <BaseSectionHeading title="API Info" :level="3" />
      <BaseCard :hoverable="false">
        <AsyncState :loading="apiLoading" :error="apiError" empty-text="No API information available">
          <template #error="{ error }">
            <span class="text-red-400">{{ error }}</span>
          </template>
          <div v-if="apiInfo" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetaInfoPair label="API Name" :value="apiInfo.name" horizontal />
              <MetaInfoPair label="Version" :value="`v${apiInfo.version}`" horizontal />
              <MetaInfoPair
                label="Environment"
                :value="apiInfo.environment"
                :color="apiInfo.environment === 'production' ? 'success' : 'warning'"
                horizontal
              />
              <MetaInfoPair
                label="Status"
                :value="apiInfo.status"
                :color="apiInfo.status === 'operational' ? 'success' : 'error'"
                horizontal
              />
            </div>
            <div class="flex flex-wrap gap-4 mt-6">
              <BaseButton
                v-if="apiInfo.documentation"
                variant="ghost"
                :href="apiInfo.documentation"
                external
              >
                <LucideBook class="w-4 h-4 mr-2" />
                Documentation
              </BaseButton>
              <BaseButton variant="ghost" :href="apiInfo.health" external>
                <LucideActivity class="w-4 h-4 mr-2" />
                Health Check
              </BaseButton>
            </div>
          </div>
        </AsyncState>
      </BaseCard>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Timeline from '@/components/about/Timeline.vue';
import ExperienceCard from '@/components/about/ExperienceCard.vue';
import SkillsGrid from '@/components/about/SkillsGrid.vue';
import MetaInfoPair from '~/components/ui/MetaInfoPair.vue';
import AsyncState from '~/components/base/AsyncState.vue';

usePageTitle('About', {
  description: 'Carlos Cativo - Tech Lead & Full-Stack Software Engineer. 9 years building healthcare platforms, payment systems, and AI-powered products.',
});

interface ApiInfo {
  name: string;
  version: string;
  description: string;
  environment: string;
  status: string;
  documentation: string;
  health: string;
  timestamp: string;
}

const apiInfo = ref<ApiInfo | null>(null);
const apiLoading = ref(true);
const apiError = ref<string | null>(null);

async function loadApiInfo() {
  apiLoading.value = true;
  apiError.value = null;
  try {
    const response = await $fetch<{ status: string; data: ApiInfo | null }>('/api');
    if (response.status === 'success' && response.data) {
      apiInfo.value = response.data;
    } else {
      apiError.value = 'Failed to load API info';
    }
  } catch {
    apiError.value = 'Unable to connect to API';
  } finally {
    apiLoading.value = false;
  }
}

await useAsyncData('api-info', () => loadApiInfo());

// Career Timeline
const timeline = ref([
  {
    title: 'Tech Lead / Full-Stack Engineer',
    company: 'Blue Medical Guatemala',
    period: 'Apr 2022 - Present',
    location: 'Guatemala (Remote)',
  },
  {
    title: 'Back End Developer',
    company: 'OrangeSoftCo (Publimovil Regional)',
    period: 'Sep 2020 - Apr 2022',
    location: 'San Marcos, El Salvador',
  },
  {
    title: 'Senior Developer',
    company: 'Mussol',
    period: 'Apr 2017 - Sep 2020',
    location: 'El Salvador',
  },
]);

// Work Experience
const experiences = ref([
  {
    company: 'Blue Medical Guatemala',
    role: 'Tech Lead / Full-Stack Engineer',
    period: 'Apr 2022 - Present',
    location: 'Guatemala (Remote)',
    description:
      'Leading development of healthcare platforms, payment microservices, and AI-powered systems. Managing code reviews, requirement refinement, and technical guidance for the team.',
    achievements: [
      'Built marIA voice agent for patient scheduling using ElevenLabs ConvAI + n8n, resolving production bugs affecting 42% of conversations',
      'Built payment microservice from scratch — Visa ISO 8583, BAC SOAP/XML, card tokenization, Strategy Pattern for gateways',
      'Built electronic invoicing microservice — Guatemala FEL, SAP integration, async processing via Redis/Horizon',
      'Core developer on BlueMeds medication subscription platform with 10+ integrations (Odoo ERP, WhatsApp, FreshDesk)',
      'Containerized all services with Docker, deployed to AWS (ECR/EC2), designed CI/CD pipelines in Bitbucket',
    ],
    tech: ['Laravel', 'NestJS', 'Python', 'Angular', 'Vue/Nuxt', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'ElevenLabs'],
  },
  {
    company: 'OrangeSoftCo (Publimovil Regional)',
    role: 'Back End Developer',
    period: 'Sep 2020 - Apr 2022',
    location: 'San Marcos, El Salvador',
    description:
      'Rebuilt Y.O.D.A. platform as microservices architecture, improving application performance by 30%. Implemented inter-service communication via Redis Streams and improved CI/CD pipelines in GitLab.',
    achievements: [
      'Implemented microservices architecture for Y.O.D.A. platform, improving performance by 30%',
      'Improved CI/CD pipelines in GitLab, reducing build time by 20%',
      'Implemented inter-service communication via Redis Streams for event-driven processing',
    ],
    tech: ['Laravel', 'Python', 'FastAPI', 'MySQL', 'Redis Streams', 'GitLab CI/CD', 'Docker', 'Kubernetes'],
  },
  {
    company: 'Mussol',
    role: 'Senior Developer',
    period: 'Apr 2017 - Sep 2020',
    location: 'El Salvador',
    description:
      'Built an internal dashboard managing 100+ travel websites, streamlining administration workflows. Developed mobile games using C#/Unity and set up CI/CD on AWS.',
    achievements: [
      'Built dashboard managing 100+ travel websites',
      'Developed mobile games using C#/Unity',
      'Set up CI/CD on AWS to improve deployment time and reliability',
    ],
    tech: ['Laravel', 'MySQL', 'AWS', 'C#/Unity'],
  },
]);

// Key Differentiators
const differentiators = ref([
  {
    title: 'AI + Backend Hybrid',
    description:
      'Not just calling APIs — designing multi-agent systems with validation, retry logic, and deterministic safeguards.',
    icon: 'LucideBrain',
  },
  {
    title: 'Payment & Invoicing',
    description:
      'Domain expertise in ISO 8583, SOAP integrations, tokenization, electronic invoicing (FEL), SAP.',
    icon: 'LucideCreditCard',
  },
  {
    title: 'Healthcare Domain',
    description:
      'Medication subscription platforms, patient scheduling, insurance authorization, ERP integration.',
    icon: 'LucideHeartPulse',
  },
  {
    title: 'Full Product Ownership',
    description:
      'Built entire microservices from scratch — payment service, invoice service — not just feature work.',
    icon: 'LucideRocket',
  },
  {
    title: 'Infrastructure & Self-Hosting',
    description:
      'Runs production infrastructure on own domain — Traefik, Prometheus, mail server, monitoring.',
    icon: 'LucideServer',
  },
  {
    title: 'Security-Conscious',
    description:
      'Conducts security audits, identifies OWASP vulnerabilities, implements proper auth patterns.',
    icon: 'LucideShield',
  },
]);

// Skills
const skillCategories = ref([
  {
    name: 'Languages',
    skills: [
      { name: 'TypeScript', level: 'advanced' as const },
      { name: 'PHP', level: 'advanced' as const },
      { name: 'SQL', level: 'advanced' as const },
      { name: 'Python', level: 'intermediate' as const },
      { name: 'JavaScript', level: 'advanced' as const },
      { name: 'Bash', level: 'intermediate' as const },
    ],
  },
  {
    name: 'Backend',
    skills: [
      { name: 'NestJS', level: 'advanced' as const },
      { name: 'Laravel', level: 'advanced' as const },
      { name: 'FastAPI', level: 'intermediate' as const },
      { name: 'Django', level: 'intermediate' as const },
    ],
  },
  {
    name: 'Frontend',
    skills: [
      { name: 'Vue / Nuxt', level: 'advanced' as const },
      { name: 'TailwindCSS', level: 'advanced' as const },
      { name: 'Angular', level: 'intermediate' as const },
      { name: 'Ionic', level: 'intermediate' as const },
    ],
  },
  {
    name: 'Databases & Search',
    skills: [
      { name: 'PostgreSQL', level: 'advanced' as const },
      { name: 'MySQL', level: 'advanced' as const },
      { name: 'Redis', level: 'intermediate' as const },
      { name: 'Meilisearch', level: 'intermediate' as const },
    ],
  },
  {
    name: 'AI / ML',
    skills: [
      { name: 'Anthropic Claude API', level: 'advanced' as const },
      { name: 'ElevenLabs ConvAI', level: 'advanced' as const },
      { name: 'OpenAI API', level: 'intermediate' as const },
      { name: 'n8n', level: 'intermediate' as const },
    ],
  },
  {
    name: 'Infrastructure',
    skills: [
      { name: 'Docker', level: 'advanced' as const },
      { name: 'GitHub Actions', level: 'advanced' as const },
      { name: 'AWS (S3, ECR, EC2)', level: 'intermediate' as const },
      { name: 'Traefik', level: 'intermediate' as const },
      { name: 'Bitbucket Pipelines', level: 'advanced' as const },
    ],
  },
  {
    name: 'Payments',
    skills: [
      { name: 'Visa ISO 8583', level: 'advanced' as const },
      { name: 'SOAP/XML', level: 'advanced' as const },
      { name: 'FEL Electronic Invoicing', level: 'advanced' as const },
      { name: 'Stripe', level: 'intermediate' as const },
    ],
  },
]);
</script>
