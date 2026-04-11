<template>
  <div class="space-y-4">
    <div
      v-for="(category, index) in categories"
      :key="index"
      class="bg-tokyo-night-dark/50 rounded-lg p-4 border border-tokyo-night-gray/20"
    >
      <h4 class="text-sm font-bold text-tokyo-night-purple mb-3 font-mono">
        <LucideTerminal class="w-4 h-4 inline mr-2 -mt-0.5" />
        {{ category.name }}
      </h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="skill in category.skills"
          :key="skill.name"
          class="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full font-mono transition-colors duration-200 hover:brightness-110 cursor-default"
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
      return 'bg-tokyo-night-red/20 text-tokyo-night-red border border-tokyo-night-red/30';
    case 'intermediate':
      return 'bg-tokyo-night-yellow/20 text-tokyo-night-yellow border border-tokyo-night-yellow/30';
    case 'basic':
      return 'bg-tokyo-night-green/20 text-tokyo-night-green border border-tokyo-night-green/30';
    default:
      return 'bg-tokyo-night-muted/20 text-tokyo-night-muted border border-tokyo-night-muted/30';
  }
}

function levelDotColor(level: string): string {
  switch (level) {
    case 'advanced':
      return 'bg-tokyo-night-red';
    case 'intermediate':
      return 'bg-tokyo-night-yellow';
    case 'basic':
      return 'bg-tokyo-night-green';
    default:
      return 'bg-tokyo-night-muted';
  }
}
</script>
