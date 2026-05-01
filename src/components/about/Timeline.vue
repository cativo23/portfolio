<template>
  <div class="relative border-l-2 border-nw-primary-dim ml-3 space-y-2">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="relative pl-8"
    >
      <span
        class="led absolute -left-[7px] top-3"
        :class="index === 0 ? 'green blink' : 'blue'"
      />

      <div class="panel">
        <div class="panel-header">
          <span>{{ item.role }}</span>
          <span class="text-nw-text-dim font-stamp uppercase tracking-wider text-[9px]">{{ item.period }}</span>
        </div>
        <div class="panel-body">
          <div class="flex flex-col md:flex-row gap-4 md:gap-8">
            <div class="md:w-48 shrink-0">
              <span class="text-nw-cyan font-stamp uppercase tracking-wide text-xs block mb-1">{{ item.period }}</span>
              <p v-if="item.location" class="text-meta">
                <LucideMapPin class="w-3 h-3 inline mr-1 -mt-0.5" />
                {{ item.location }}
              </p>
            </div>

            <div class="flex-1">
              <p class="text-nw-primary text-xs uppercase tracking-wider mb-3 font-stamp">{{ item.company }}</p>

              <p class="text-nw-text-dim mb-4 leading-relaxed">{{ item.description }}</p>

              <ul v-if="item.highlights && item.highlights.length > 0" class="space-y-2 mb-4">
                <li v-for="(highlight, i) in item.highlights" :key="i" class="text-nw-text-dim flex gap-2">
                  <span class="text-nw-primary shrink-0 mt-0.5">→</span>
                  <span>{{ highlight }}</span>
                </li>
              </ul>

              <div v-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-2 mt-4">
                <span v-for="tag in item.tags" :key="tag" class="tag tag-info">
                  {{ tag }}
                </span>
              </div>
            </div>
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
