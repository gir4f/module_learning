<template>
  <footer class="border-t border-slate-200 bg-white/80 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950/80">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center justify-center gap-2.5">
        <div class="flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <i class="pi pi-book text-lg text-brand-teal" aria-hidden="true" />
          <span class="text-base font-black tracking-tight">Gitronik Modul Ajar</span>
        </div>
        <p class="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
          &copy; {{ currentYear }} PT. Gitronik Dimindo Indonesia. Hak cipta dilindungi undang-undang.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
