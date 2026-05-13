<template>
  <div class="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 lg:flex-row flex-col">
    <AdminSidebar class="shrink-0" />
    <main class="flex-1 w-full max-w-full overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <div class="mx-auto max-w-7xl">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '~/components/layout/AdminSidebar.vue'
</script>
