<template>
  <div class="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
    <div class="min-w-0">
      <p v-if="eyebrow" class="mb-2 text-xs font-black uppercase tracking-[0.14em] text-brand-teal dark:text-cyan-300">{{ eyebrow }}</p>
      <h2 class="text-[17px] font-black tracking-tight text-slate-950 dark:text-white">{{ title }}</h2>
      <p v-if="description" class="mt-1 text-sm font-semibold leading-5 text-slate-500 dark:text-slate-400">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="flex shrink-0 flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  eyebrow?: string
}>()
</script>
