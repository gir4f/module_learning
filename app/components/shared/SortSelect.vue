<template>
  <label class="grid gap-1.5">
    <span v-if="label" class="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{{ label }}</span>
    <Select
      :model-value="modelValue"
      :options="options"
      option-label="label"
      option-value="value"
      class="w-full"
      @update:model-value="$emit('update:modelValue', $event as ModuleSort)"
    />
  </label>
</template>

<script setup lang="ts">
import { moduleSortOptions, type ModuleSort } from '~/utils/moduleUi'

const { options = moduleSortOptions, label = 'Sort' } = defineProps<{
  modelValue: ModuleSort
  options?: Array<{ label: string, value: ModuleSort }>
  label?: string
}>()

defineEmits<{
  'update:modelValue': [value: ModuleSort]
}>()
</script>
