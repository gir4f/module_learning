<template>
  <footer class="border-t border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80">
    <div class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div>
        <p class="font-semibold text-slate-700 dark:text-slate-200">PT. Gitronik Dimindo Indonesia</p>
        <p>Modul Pembelajaran Internal</p>
      </div>
      <p>v0.1.0 | {{ currentYear }}</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
