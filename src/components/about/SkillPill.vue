<template>
  <span
    class="inline-block text-tokyo-night-dark px-3 py-1 rounded-full text-sm mr-2 mb-2 font-medium"
    :class="pillClass"
  >
    {{ name }}
  </span>
</template>

<script setup lang="ts">
type SkillLevel = 'advanced' | 'intermediate' | 'beginner';

const props = defineProps<{
  name: string;
  level: SkillLevel;
}>();

const pillClass = computed(() => {
  switch (props.level) {
    case 'advanced':
      return 'bg-tokyo-night-red';
    case 'intermediate':
      return 'bg-tokyo-night-yellow';
    case 'beginner':
      return 'bg-tokyo-night-green';
  }
});
</script>
