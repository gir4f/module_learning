<template>
  <div class="admin-surface-enter grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2 xl:grid-cols-6">
    <div
      v-for="metric in metrics"
      :key="metric.label"
      class="admin-row-enter border-b border-slate-200 px-5 py-4 transition-colors last:border-b-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/70 sm:border-r sm:last:border-r-0 xl:border-b-0"
      :style="{ animationDelay: `${metric.delay || 0}ms` }"
    >
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{{ metric.label }}</p>
          <p class="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{{ metric.value }}</p>
        </div>
        <span class="flex h-11 w-11 items-center justify-center rounded-xl" :class="metric.iconClass">
          <i :class="metric.icon" aria-hidden="true" />
        </span>
      </div>
      <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">{{ metric.caption }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  metrics: Array<{
    label: string
    value: string | number
    caption: string
    icon: string
    iconClass: string
    delay?: number
  }>
}>()
</script>
