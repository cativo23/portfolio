<template>
  <div>
    <BaseSectionHeading title="About Me" />
    <BaseCard :hoverable="false">
      <p class="mb-4 text-justify">
        Hi, I'm Carlos Cativo, a passionate backend developer with over 8 years of experience in building scalable and
        efficient server-side applications.
        My expertise lies in designing and implementing high-performance APIs, microservices, and data processing
        systems.
      </p>
      <p class="mb-4 text-justify">
        I'm particularly interested in distributed systems, database optimization, and cloud-native technologies.
        When I'm not coding, I enjoy writing technical blog posts to share my knowledge and experiences with the
        developer community.
      </p>
      <h3 class="text-2xl font-bold mb-4 text-tokyo-night-purple">Skills</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Languages:
          <SkillPill v-for="language in languages" :key="language.name" :name="language.name" :level="language.level" />
        </li>
        <li>Databases:
          <SkillPill v-for="database in databases" :key="database.name" :name="database.name" :level="database.level" />
        </li>
        <li> Message Brokers:
          <SkillPill v-for="broker in brokers" :key="broker.name" :name="broker.name" :level="broker.level" />
        </li>
        <li>Cloud Platforms:
          <SkillPill v-for="platform in platforms" :key="platform.name" :name="platform.name" :level="platform.level" />
        </li>
        <li>DevOps:
          <SkillPill v-for="tool in devOps" :key="tool.name" :name="tool.name" :level="tool.level" />
        </li>
        <li>API Design:
          <SkillPill v-for="api in apis" :key="api.name" :name="api.name" :level="api.level" />
        </li>
      </ul>
      <p>
        I'm always eager to learn new technologies and tackle challenging problems.
        Feel free to reach out if you'd like to collaborate on a project or just chat about backend development!
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
  description: 'Learn more about Carlos Cativo, a passionate backend developer with expertise in building scalable server-side applications and sharing knowledge through technical blog posts.',
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
  { name: 'PHP', level: 'advanced' },
  { name: 'JavaScript', level: 'advanced' },
  { name: 'Python', level: 'intermediate' },
  { name: 'Go', level: 'beginner' },
]);

const databases = ref([
  { name: 'MySQL', level: 'advanced' },
  { name: 'PostgreSQL', level: 'advanced' },
  { name: 'MongoDB', level: 'intermediate' },
  { name: 'Redis', level: 'intermediate' },
]);

const brokers = ref([
  { name: 'Apache Kafka', level: 'advanced' },
  { name: 'RabbitMQ', level: 'intermediate' }
]);

const platforms = [
  { name: 'AWS', level: 'intermediate' },
  { name: 'Google Cloud Platform', level: 'intermediate' }
];

const devOps = [
  { name: 'Docker', level: 'advanced' },
  { name: 'CI/CD pipelines', level: 'intermediate' },
  { name: 'Kubernetes', level: 'beginner' },
];

const apis = [
  { name: 'RESTful APIs', level: 'advanced' },
  { name: 'GraphQL', level: 'beginner' },
];
</script>

<style></style>