<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <Toast />
    <ConfirmDialog />
    <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <NuxtLink to="/admin/modules" class="flex min-w-0 items-center gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-white shadow-sm dark:bg-brand-teal-dark">
            <i class="pi pi-database" aria-hidden="true" />
          </span>
          <span class="min-w-0">
            <span class="block truncate text-sm font-bold text-brand-navy dark:text-cyan-200">Admin Modul Ajar</span>
            <span class="block truncate text-xs text-slate-500 dark:text-slate-400">Content operations</span>
          </span>
        </NuxtLink>
        <nav class="flex items-center gap-2 text-sm">
          <NuxtLink to="/admin/modules" class="rounded-lg px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100 hover:text-brand-navy dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-cyan-200">Modules</NuxtLink>
          <NuxtLink to="/" class="hidden rounded-lg px-3 py-2 font-semibold text-slate-600 hover:bg-slate-100 hover:text-brand-navy dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-cyan-200 sm:inline-flex">Learner View</NuxtLink>
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-brand-navy dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-cyan-200"
            :aria-label="isDark ? 'Use light mode' : 'Use dark mode'"
            @click="toggle"
          >
            <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" aria-hidden="true" />
          </button>
          <NuxtLink to="/login" class="rounded-lg bg-brand-teal px-3 py-2 font-semibold text-white shadow-sm hover:bg-brand-teal-dark">Login</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { isDark, init, toggle } = useDarkMode()
onMounted(init)
</script>
