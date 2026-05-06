<template>
  <div class="admin-surface-enter rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-xs font-bold uppercase tracking-wide text-brand-teal dark:text-cyan-300">{{ eyebrow }}</p>
        <h1 class="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{{ title }}</h1>
        <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{{ description }}</p>
        <p v-if="meta" class="mt-2 text-xs font-semibold text-slate-400 dark:text-slate-500">{{ meta }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description: string
  meta?: string
}>()
</script>
