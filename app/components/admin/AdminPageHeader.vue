<template>
  <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
    <div>
      <p v-if="eyebrow" class="text-xs font-bold uppercase text-brand-teal">{{ eyebrow }}</p>
      <h1 class="mt-1 text-2xl font-bold text-brand-navy">{{ title }}</h1>
      <p v-if="description" class="mt-1 max-w-3xl text-sm text-slate-600">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  eyebrow?: string
  description?: string
}>()
</script>
