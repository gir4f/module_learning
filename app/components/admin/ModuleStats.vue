<template>
  <div class="grid gap-3 sm:grid-cols-3">
    <div
      v-for="item in items"
      :key="item.label"
      class="rounded-lg border border-slate-200 bg-white px-4 py-3"
    >
      <p class="text-xs font-semibold uppercase text-slate-500">{{ item.label }}</p>
      <p class="mt-1 text-2xl font-bold text-brand-navy">{{ item.value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{ label: string, value: string | number }>
}>()
</script>
