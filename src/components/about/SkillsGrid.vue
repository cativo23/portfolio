<template>
  <div class="space-y-4">
    <div
      v-for="(category, index) in categories"
      :key="index"
      class="bg-void-warm/50 rounded-lg p-4 border border-nw-text-line/20"
    >
      <h4 class="font-stamp uppercase tracking-wide text-sm font-bold text-nw-purple mb-3">
        <LucideTerminal class="w-4 h-4 inline mr-2 -mt-0.5" />
        {{ category.name }}
      </h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="skill in category.skills"
          :key="skill.name"
          class="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full font-sys transition-colors duration-200 hover:brightness-110 cursor-default"
          :class="levelColor(skill.level)"
        >
          {{ skill.name }}
          <span class="w-1.5 h-1.5 rounded-full" :class="levelDotColor(skill.level)" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Skill {
  name: string;
  level: 'advanced' | 'intermediate' | 'basic';
}

interface Category {
  name: string;
  skills: Skill[];
}

defineProps<{
  categories: Category[];
}>();

function levelColor(level: string): string {
  switch (level) {
    case 'advanced':
      return 'bg-nw-red/20 text-nw-red border border-nw-red/30';
    case 'intermediate':
      return 'bg-nw-yellow/20 text-nw-yellow border border-nw-yellow/30';
    case 'basic':
      return 'bg-nw-green/20 text-nw-green border border-nw-green/30';
    default:
      return 'bg-nw-text-dim/20 text-nw-text-dim border border-nw-text-dim/30';
  }
}

function levelDotColor(level: string): string {
  switch (level) {
    case 'advanced':
      return 'bg-nw-red';
    case 'intermediate':
      return 'bg-nw-yellow';
    case 'basic':
      return 'bg-nw-green';
    default:
      return 'bg-nw-text-dim';
  }
}
</script>
