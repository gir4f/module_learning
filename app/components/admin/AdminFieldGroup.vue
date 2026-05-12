<template>
  <label class="grid gap-2">
    <span class="text-sm font-bold text-slate-700 dark:text-slate-200">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </span>
    <slot />
    <small v-if="error" class="text-xs font-semibold text-red-600 dark:text-red-300">{{ error }}</small>
    <small v-else-if="help" class="text-xs font-semibold text-slate-500 dark:text-slate-400">{{ help }}</small>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  help?: string
  error?: string
  required?: boolean
}>()
</script>
