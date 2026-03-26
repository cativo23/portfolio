<template>
  <div>
    <BaseSectionHeading title="About Me" />
    <BaseCard :hoverable="false">
      <p class="mb-4 text-justify">
        Hi, I'm Carlos Cativo — a Full-Stack Software Engineer based in El Salvador with a strong backend focus
        and growing specialization in AI-powered systems. I build healthcare platforms, payment processing services,
        and conversational AI agents at <span class="text-tokyo-night-purple font-semibold">Blue Medical</span>.
      </p>
      <p class="mb-4 text-justify">
        I've built microservices from scratch handling payment gateway integrations (Visa ISO 8583, SOAP/XML),
        electronic invoicing systems (FEL), and a voice AI agent that automates patient scheduling via natural
        conversation in Spanish. My day-to-day involves Laravel, NestJS, Python, and integrating systems that
        talk to ERPs, WhatsApp bots, and payment processors.
      </p>
      <p class="mb-4 text-justify">
        On the side, I build things like multi-agent AI trading bots, AI-powered legal contract auditors,
        and open-source developer tooling. I also self-host my own production infrastructure on this domain.
      </p>
      <h3 class="text-2xl font-bold mb-4 text-tokyo-night-purple">Skills</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Languages:
          <SkillPill v-for="language in languages" :key="language.name" :name="language.name" :level="language.level" />
        </li>
        <li>Backend:
          <SkillPill v-for="framework in backends" :key="framework.name" :name="framework.name" :level="framework.level" />
        </li>
        <li>Frontend:
          <SkillPill v-for="framework in frontends" :key="framework.name" :name="framework.name" :level="framework.level" />
        </li>
        <li>Databases:
          <SkillPill v-for="database in databases" :key="database.name" :name="database.name" :level="database.level" />
        </li>
        <li>Message Brokers:
          <SkillPill v-for="broker in brokers" :key="broker.name" :name="broker.name" :level="broker.level" />
        </li>
        <li>AI / Integrations:
          <SkillPill v-for="tool in ai" :key="tool.name" :name="tool.name" :level="tool.level" />
        </li>
        <li>Infrastructure:
          <SkillPill v-for="tool in infra" :key="tool.name" :name="tool.name" :level="tool.level" />
        </li>
        <li>Payments & Invoicing:
          <SkillPill v-for="tool in payments" :key="tool.name" :name="tool.name" :level="tool.level" />
        </li>
      </ul>
      <p>
        Always looking for interesting problems to solve. If you need someone who can own a system end-to-end —
        from database design to deployment pipeline — let's talk.
      </p>
    </BaseCard>

    <!-- API Information Section -->
    <section class="mt-12">
      <BaseSectionHeading title="API Info" :level="3" />
      <BaseCard>
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
            <BaseButton
              variant="ghost"
              :href="apiInfo.health"
              external
            >
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
import SkillPill from '@/components/about/SkillPill.vue';
import MetaInfoPair from '~/components/ui/MetaInfoPair.vue';
import AsyncState from '~/components/base/AsyncState.vue';

usePageTitle('About', {
  description: 'Carlos Cativo — Full-Stack Software Engineer specializing in backend development, AI-powered systems, and payment integrations. Based in El Salvador.',
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

const languages = ref([
  { name: 'TypeScript', level: 'advanced' },
  { name: 'PHP', level: 'advanced' },
  { name: 'JavaScript', level: 'advanced' },
  { name: 'Python', level: 'intermediate' },
  { name: 'Bash', level: 'intermediate' },
  { name: 'SQL', level: 'advanced' },
]);

const backends = ref([
  { name: 'NestJS', level: 'advanced' },
  { name: 'Laravel', level: 'advanced' },
  { name: 'FastAPI', level: 'intermediate' },
]);

const frontends = ref([
  { name: 'Nuxt / Vue 3', level: 'advanced' },
  { name: 'Angular', level: 'intermediate' },
  { name: 'TailwindCSS', level: 'advanced' },
]);

const databases = ref([
  { name: 'PostgreSQL', level: 'advanced' },
  { name: 'MySQL', level: 'advanced' },
  { name: 'Redis', level: 'intermediate' },
  { name: 'Meilisearch', level: 'intermediate' },
]);

const brokers = ref([
  { name: 'Apache Kafka', level: 'advanced' },
  { name: 'RabbitMQ', level: 'intermediate' },
]);

const ai = ref([
  { name: 'Anthropic Claude API', level: 'advanced' },
  { name: 'OpenAI API', level: 'intermediate' },
  { name: 'ElevenLabs ConvAI', level: 'advanced' },
  { name: 'n8n', level: 'intermediate' },
]);

const infra = ref([
  { name: 'Docker', level: 'advanced' },
  { name: 'AWS (S3, ECR, EC2)', level: 'intermediate' },
  { name: 'Traefik', level: 'intermediate' },
  { name: 'GitHub Actions', level: 'advanced' },
  { name: 'Bitbucket Pipelines', level: 'advanced' },
]);

const payments = ref([
  { name: 'Visa ISO 8583', level: 'advanced' },
  { name: 'SOAP/XML', level: 'advanced' },
  { name: 'FEL (Electronic Invoicing)', level: 'advanced' },
  { name: 'Stripe', level: 'intermediate' },
]);
</script>

<style></style>