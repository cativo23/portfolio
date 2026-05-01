<template>
  <BaseCard :hoverable="false">
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h3 class="font-title font-bold text-xl text-nw-text">{{ company }}</h3>
          <p class="text-nw-cyan font-stamp uppercase tracking-wide text-xs">{{ role }}</p>
        </div>
        <div class="text-right">
          <span class="text-nw-text-dim text-sm">{{ period }}</span>
          <p v-if="location" class="text-nw-text-dim text-xs mt-1">
            <LucideMapPin class="w-3 h-3 inline mr-1 -mt-0.5" />
            {{ location }}
          </p>
        </div>
      </div>

      <!-- Description -->
      <p class="text-nw-text text-sm leading-relaxed">{{ description }}</p>

      <!-- Key Achievements -->
      <ul v-if="achievements?.length" class="space-y-2">
        <li v-for="(achievement, i) in achievements" :key="i" class="flex items-start gap-2 text-sm">
          <span class="text-nw-green mt-1 shrink-0">
            <LucideChevronRight class="w-4 h-4" />
          </span>
          <span class="text-nw-text">{{ achievement }}</span>
        </li>
      </ul>

      <!-- Tech Stack -->
      <div v-if="tech?.length" class="flex flex-wrap gap-2 pt-2 border-t border-nw-text-line/30">
        <span
          v-for="t in tech"
          :key="t"
          class="tag tag-info"
        >
          {{ t }}
        </span>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
defineProps<{
  company: string;
  role: string;
  period: string;
  location?: string;
  description?: string;
  achievements?: string[];
  tech?: string[];
}>();
</script>
