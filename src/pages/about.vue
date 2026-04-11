<template>
  <div class="space-y-12">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]" role="status" aria-live="polite">
      <span class="text-tokyo-night-muted font-mono">Loading profile...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12" role="alert">
      <p class="text-red-400 font-mono mb-4">Failed to load profile data</p>
      <BaseButton variant="ghost" @click="loadProfile" class="font-mono">
        ❯ Retry
      </BaseButton>
    </div>

    <!-- Content -->
    <template v-else-if="profile">
      <!-- About Me -->
      <section>
        <BaseSectionHeading title="About Me" />
        <BaseCard :hoverable="false">
          <div class="space-y-4 text-tokyo-night-text leading-relaxed">
            <p v-html="summaryHtml" />
          </div>
        </BaseCard>
      </section>

      <!-- Career Timeline -->
      <section>
        <BaseSectionHeading title="Career Timeline" :level="3" />
        <BaseCard :hoverable="false">
          <Timeline :items="timelineItems" />
        </BaseCard>
      </section>

      <!-- Skills -->
      <section>
        <BaseSectionHeading title="Technical Skills" :level="3" />
        <SkillsGrid :categories="profile.skills" />
      </section>

      <!-- Key Differentiators -->
      <section>
        <BaseSectionHeading title="What I Bring" :level="3" />
        <BaseCard :hoverable="false">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(diff, index) in differentiatorItems"
              :key="index"
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

      <!-- Social Links -->
      <section>
        <BaseSectionHeading title="Connect" :level="3" />
        <div class="flex flex-wrap gap-4">
          <BaseButton variant="ghost" :href="profile.github" external>
            <LucideGithub class="w-5 h-5 mr-2" />
            GitHub
          </BaseButton>
          <BaseButton variant="ghost" :href="profile.linkedin" external>
            <LucideLinkedin class="w-5 h-5 mr-2" />
            LinkedIn
          </BaseButton>
          <BaseButton variant="ghost" :href="profile.website" external>
            <LucideGlobe class="w-5 h-5 mr-2" />
            Website
          </BaseButton>
        </div>
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
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import Timeline from '@/components/about/Timeline.vue';
import SkillsGrid from '@/components/about/SkillsGrid.vue';
import MetaInfoPair from '~/components/ui/MetaInfoPair.vue';
import AsyncState from '~/components/base/AsyncState.vue';
import type { Profile } from '~/types/profile';

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

const profile = ref<Profile | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const apiInfo = ref<ApiInfo | null>(null);
const apiLoading = ref(true);
const apiError = ref<string | null>(null);

async function loadProfile() {
  loading.value = true;
  error.value = null;
  try {
    const response = await $fetch<{ data: Profile }>('/api/profile');
    profile.value = response.data;
  } catch {
    error.value = 'Failed to connect to API. Using local data.';
    // Fallback: set to null so the template shows error state
    // In production you might want a full local fallback
  } finally {
    loading.value = false;
  }
}

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

await useAsyncData('profile-data', () => loadProfile());
await useAsyncData('api-info', () => loadApiInfo());

// Map differentiator strings to objects with icons
const differentiatorIcons = [
  'LucideBrain',
  'LucideCreditCard',
  'LucideHeartPulse',
  'LucideRocket',
  'LucideServer',
  'LucideShield',
];

const differentiatorItems = computed(() => {
  if (!profile.value) return [];
  return profile.value.differentiators.map((diff, i) => {
    const parts = diff.split(' — ');
    return {
      title: parts[0] || diff,
      description: parts.slice(1).join(' — ') || diff,
      icon: differentiatorIcons[i] || 'LucideStar',
    };
  });
});

// Map experience to timeline items
const timelineItems = computed(() => {
  if (!profile.value) return [];
  return profile.value.experience.map((exp) => ({
    title: exp.role,
    company: exp.company,
    period: exp.period,
    location: exp.location,
  }));
});

// Parse summary into paragraphs for HTML rendering
const summaryHtml = computed(() => {
  if (!profile.value) return '';
  // Split summary on double newlines or periods with capital letters for paragraph breaks
  const paragraphs = profile.value.summary.split(/(?<=[.!?])\s+(?=[A-Z])/);
  return paragraphs
    .map((p) => {
      // Highlight key terms
      let formatted = p
        .replace(/(9 years of experience)/g, '<span class="text-tokyo-night-cyan font-semibold">$1</span>')
        .replace(/(Blue Medical)/g, '<span class="text-tokyo-night-purple font-semibold">$1</span>')
        .replace(/(NestJS|Laravel|Python|AI integration)/g, '<span class="text-tokyo-night-blue font-medium">$1</span>');
      return `<p>${formatted}</p>`;
    })
    .join('');
});
</script>
