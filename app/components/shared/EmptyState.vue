<template>
  <div v-auto-animate="{ duration: 180, easing: 'ease-out' }" class="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900">
    <div class="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
      <i :class="icon" aria-hidden="true" />
    </div>
    <h2 class="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h2>
    <p v-if="description" class="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">{{ description }}</p>
    <div v-if="$slots.default" class="mt-5">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const { title, description, icon = 'pi pi-inbox' } = defineProps<{
  title: string
  description?: string
  icon?: string
}>()
</script>
