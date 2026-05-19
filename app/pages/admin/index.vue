<template>
  <div class="sr-only" aria-live="polite">Mengarahkan ke daftar modul admin...</div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: [() => navigateTo('/admin/modules', { redirectCode: 301, replace: true })],
})
</script>
