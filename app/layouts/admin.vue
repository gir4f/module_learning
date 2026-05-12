<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <Toast />
    <ConfirmDialog />
    <AppTopNavbar mode="admin" />
    <main class="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppTopNavbar from '~/components/layout/AppTopNavbar.vue'
</script>
