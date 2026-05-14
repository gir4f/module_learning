<template>
  <div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100" role="alert">
    <p class="font-semibold">{{ title }}</p>
    <p v-if="message" class="mt-1">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
const { title = 'Something went wrong', message } = defineProps<{
  title?: string
  message?: string
}>()
</script>
