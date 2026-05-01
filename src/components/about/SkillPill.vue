<template>
  <span class="tag mr-2 mb-2" :class="pillClass">
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
      return 'tag-danger';
    case 'intermediate':
      return 'tag-warning';
    case 'beginner':
      return 'tag-success';
  }
});
</script>
