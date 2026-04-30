<template>
  <div class="relative border-l-2 border-tokyo-night-gray/50 ml-3 space-y-8">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="relative pl-8 group"
    >
      <!-- Timeline dot -->
      <div
        class="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-tokyo-night-bg transition-colors duration-200"
        :class="index === 0 ? 'bg-tokyo-night-green border-tokyo-night-green' : 'bg-tokyo-night-bg group-hover:bg-tokyo-night-cyan'"
      />

      <!-- Content Layout -->
      <div class="flex flex-col md:flex-row gap-4 md:gap-8">
        <!-- Left Column: Meta info -->
        <div class="md:w-48 shrink-0">
          <span class="text-tokyo-night-muted font-mono text-xs block mb-1">{{ item.period }}</span>
          <p v-if="item.location" class="text-tokyo-night-muted text-xs">
            <LucideMapPin class="w-3 h-3 inline mr-1 -mt-0.5" />
            {{ item.location }}
          </p>
        </div>

        <!-- Right Column: Details -->
        <div class="flex-1">
          <h3 class="text-xl font-bold text-tokyo-night-text mb-1 font-mono">{{ item.role }}</h3>
          <p class="text-tokyo-night-cyan font-mono text-xs uppercase tracking-wider mb-4">{{ item.company }}</p>
          
          <p class="text-sm text-tokyo-night-text/80 mb-4 leading-relaxed">{{ item.description }}</p>
          
          <ul v-if="item.highlights && item.highlights.length > 0" class="space-y-2 mb-4">
            <li v-for="(highlight, i) in item.highlights" :key="i" class="text-sm text-tokyo-night-text/70 flex gap-2">
              <span class="text-tokyo-night-purple shrink-0 mt-0.5">→</span>
              <span>{{ highlight }}</span>
            </li>
          </ul>

          <div v-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-2 mt-4">
            <span v-for="tag in item.tags" :key="tag" 
                  class="px-2 py-1 text-xs font-mono rounded border border-tokyo-night-gray/30 text-tokyo-night-muted">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProfileExperience } from '~/types/profile';

defineProps<{
  items: ProfileExperience[];
}>();
</script>
