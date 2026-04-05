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

      <!-- Content -->
      <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
        <div>
          <h3 class="text-lg font-bold text-tokyo-night-text">{{ item.title }}</h3>
          <p class="text-tokyo-night-cyan font-mono text-sm">{{ item.company }}</p>
        </div>
        <span class="text-tokyo-night-muted font-mono text-xs whitespace-nowrap">{{ item.period }}</span>
      </div>
      <p v-if="item.location" class="text-tokyo-night-muted text-sm mt-1">
        <LucideMapPin class="w-3 h-3 inline mr-1 -mt-0.5" />
        {{ item.location }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TimelineItem {
  title: string;
  company: string;
  period: string;
  location?: string;
}

defineProps<{
  items: TimelineItem[];
}>();
</script>
