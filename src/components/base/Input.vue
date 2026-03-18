<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  id?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  minlength?: number
  maxlength?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  required: false,
  disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const inputId = computed(() => {
  if (props.id) return props.id
  if (props.label) return props.label.toLowerCase().replace(/\s+/g, '-')
  return undefined
})

const inputClasses = computed(() => [
  'w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text rounded font-mono placeholder-tokyo-night-muted transition',
  'focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan border',
  props.error ? 'border-tokyo-night-red' : 'border-tokyo-night-gray',
])
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="inputId" class="text-tokyo-night-cyan font-mono font-bold">
      {{ label }}
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :minlength="minlength"
      :maxlength="maxlength"
      :class="inputClasses"
    />
    <p v-if="error" class="text-tokyo-night-red font-mono text-sm mt-1">{{ error }}</p>
  </div>
</template>
