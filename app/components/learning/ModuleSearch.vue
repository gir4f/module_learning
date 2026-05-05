<template>
  <label class="block">
    <span class="sr-only">Search modules</span>
    <input
      :value="modelValue"
      type="search"
      class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-cyan-100"
      placeholder="Search module, product, component, or keyword..."
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
