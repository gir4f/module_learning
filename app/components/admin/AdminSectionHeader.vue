<template>
  <div class="-mx-4 flex flex-col gap-3 border-y border-slate-200 px-4 py-4 dark:border-slate-800 sm:-mx-5 sm:px-5 md:flex-row md:items-center md:justify-between">
    <div class="flex min-w-0 items-start gap-3">
      <span v-if="icon" class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-brand-teal ring-1 ring-cyan-100 dark:bg-cyan-950/30 dark:text-cyan-200 dark:ring-cyan-900/60">
        <i :class="icon" aria-hidden="true" />
      </span>
      <div class="min-w-0">
        <p v-if="eyebrow" class="mb-2 text-xs font-black uppercase tracking-[0.14em] text-brand-teal dark:text-cyan-300">{{ eyebrow }}</p>
        <h2 class="text-base font-black tracking-tight text-slate-950 dark:text-white sm:text-[17px]">{{ title }}</h2>
        <p v-if="description" class="mt-1 text-sm font-semibold leading-5 text-slate-500 dark:text-slate-400">{{ description }}</p>
      </div>
    </div>
    <div v-if="meta || $slots.actions" class="flex w-full flex-wrap items-center gap-2 pl-12 md:w-auto md:shrink-0 md:justify-end md:pl-0">
      <span v-if="meta" class="inline-flex min-h-8 max-w-full items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-black uppercase tracking-[0.08em] text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
        {{ meta }}
      </span>
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  eyebrow?: string
  icon?: string
  meta?: string
}>()
</script>
