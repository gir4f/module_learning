<template>
  <div v-auto-animate="{ duration: 180, easing: 'ease-out' }" class="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <div v-auto-animate="{ duration: 160, easing: 'ease-out' }" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      <div v-for="index in rows" :key="index" class="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
        <div class="h-1.5 animate-shimmer skeleton-shimmer" />
        <div class="space-y-4 p-5">
          <div class="flex gap-3">
            <div class="h-10 w-10 rounded-lg animate-shimmer skeleton-shimmer" />
            <div class="flex-1 space-y-2">
              <div class="h-3 w-20 rounded animate-shimmer skeleton-shimmer" />
              <div class="h-5 w-3/4 rounded animate-shimmer skeleton-shimmer" />
            </div>
          </div>
          <div class="space-y-2">
            <div class="h-3 rounded animate-shimmer skeleton-shimmer" />
            <div class="h-3 w-5/6 rounded animate-shimmer skeleton-shimmer" />
            <div class="h-3 w-2/3 rounded animate-shimmer skeleton-shimmer" />
          </div>
          <div class="flex gap-2">
            <div class="h-6 w-20 rounded-md animate-shimmer skeleton-shimmer" />
            <div class="h-6 w-24 rounded-md animate-shimmer skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { rows = 3 } = defineProps<{
  rows?: number
}>()
</script>
