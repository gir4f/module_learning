<template>
  <div class="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 lg:flex-row flex-col">
    <AdminSidebar class="shrink-0" />
    <main id="main-content" class="flex-1 w-full max-w-full overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <div class="mx-auto max-w-7xl">
        <NuxtErrorBoundary>
          <slot />
          <template #error="{ error, clearError }">
            <div class="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/30">
              <i class="pi pi-exclamation-triangle mx-auto mb-4 text-4xl text-red-500 dark:text-red-400" aria-hidden="true" />
              <h2 class="text-lg font-black tracking-tight text-red-700 dark:text-red-400">Terjadi Kesalahan Aplikasi</h2>
              <p class="mt-2 text-sm font-semibold text-red-600/80 dark:text-red-300/80">{{ error?.message || 'Error tidak diketahui' }}</p>
              <button
                type="button"
                class="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-950"
                @click="clearError"
              >
                <i class="pi pi-refresh" aria-hidden="true" />
                Coba Lagi
              </button>
            </div>
          </template>
        </NuxtErrorBoundary>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '~/components/layout/AdminSidebar.vue'

useHead({
  bodyAttrs: {
    class: 'app-shell-admin',
  },
})
</script>
