<template>
  <div class="space-y-16 pb-16">
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

    <template v-else-if="profile">
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
      <section>
        <BaseSectionHeading title="Background" />
        <div class="space-y-6">
          <p v-for="(paragraph, index) in profile.summary" :key="index"
             class="pl-4 border-l-2 border-tokyo-night-gray/30 hover:border-tokyo-night-cyan transition-colors duration-300 text-tokyo-night-text/90 leading-relaxed max-w-4xl"
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

      <!-- Side Projects -->
      <section>
        <BaseSectionHeading title="Side Projects" />
        <div class="space-y-4">
          <div v-if="projectsLoading" class="text-center py-4"><span class="text-tokyo-night-muted font-mono">Loading projects...</span></div>
          <div v-else-if="projectsError" class="text-center py-4"><span class="text-red-400 font-mono">Failed to load projects</span></div>
          <div v-else v-for="project in projects" :key="project.id || project.title" class="p-5 border border-tokyo-night-gray/30 rounded-lg bg-tokyo-night-dark/40 hover:border-tokyo-night-blue transition-colors">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-bold text-tokyo-night-text">
                <NuxtLink :to="'/projects/' + project.id" class="hover:text-tokyo-night-cyan transition-colors">{{ project.title }}</NuxtLink>
              </h3>
              <span class="text-tokyo-night-muted">—</span>
              <span class="text-tokyo-night-text/80">{{ project.shortDescription || 'A software project' }}</span>
              <span :class="getStatusClass(project.status || 'live')" class="ml-auto text-xs font-mono px-2 py-0.5 rounded border lowercase">{{ project.status || 'live' }}</span>
            </div>
            <p class="text-sm text-tokyo-night-text/70 mb-4">{{ project.description }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="tech in project.techStack" :key="tech" class="px-2 py-1 text-xs font-mono rounded bg-tokyo-night-bg text-tokyo-night-muted">
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </section>

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
      <section class="py-8 border-t border-tokyo-night-gray/20">
        <div class="max-w-3xl">
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
import { ref } from 'vue';
import { useProjects } from '~/composables/useProjects';
import Timeline from '@/components/about/Timeline.vue';
import type { Profile } from '~/types/profile';

usePageTitle('About', {
  description: 'Carlos Cativo - Tech Lead & Full-Stack Software Engineer. 9 years building healthcare platforms, payment systems, and AI-powered products.',
});

const profile = ref<Profile | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

async function loadProfile() {
  loading.value = true;
  error.value = null;
  try {
    const response = await $fetch<{ data: Profile }>('/api/profile');
    profile.value = response.data;
  } catch {
    error.value = 'Failed to connect to API.';
  } finally {
    loading.value = false;
  }
}

await useAsyncData('profile-data', () => loadProfile());

const { projects, loading: projectsLoading, error: projectsError, fetchProjects } = useProjects();
await useAsyncData('projects-data', () => fetchProjects({ limit: 10 }));

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
