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
        <div v-if="apiLoading" class="text-center py-8">
          <span class="text-tokyo-night-muted">Loading API info...</span>
        </div>

        <div v-else-if="apiError || !apiInfo" class="text-center py-8">
          <span class="text-red-400">Unable to load API information</span>
        </div>

        <div v-else class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-tokyo-night-muted text-sm">API Name</dt>
              <dd class="text-tokyo-night-text font-mono">{{ apiInfo.name }}</dd>
            </div>
            <div>
              <dt class="text-tokyo-night-muted text-sm">Version</dt>
              <dd class="text-tokyo-night-text font-mono">v{{ apiInfo.version }}</dd>
            </div>
            <div>
              <dt class="text-tokyo-night-muted text-sm">Environment</dt>
              <dd class="text-tokyo-night-text font-mono">
                <span :class="environmentColor">{{ apiInfo.environment }}</span>
              </dd>
            </div>
            <div>
              <dt class="text-tokyo-night-muted text-sm">Status</dt>
              <dd class="text-tokyo-night-text font-mono">
                <span :class="statusColor">{{ apiInfo.status }}</span>
              </dd>
            </div>
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
      </BaseCard>
    </section>
  </div>
</template>



<script lang="ts" setup>
import { ref, computed } from 'vue';
import SkillPill from '@/components/about/SkillPill.vue';

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

const environmentColor = computed(() => {
  if (!apiInfo.value) return 'text-tokyo-night-muted';
  return apiInfo.value.environment === 'production' ? 'text-green-400' : 'text-yellow-400';
});

const statusColor = computed(() => {
  if (!apiInfo.value) return 'text-tokyo-night-muted';
  return apiInfo.value.status === 'operational' ? 'text-green-400' : 'text-red-400';
});

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