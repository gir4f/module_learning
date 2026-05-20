<template>
  <div class="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
    <LearningHeader />
    <main id="main-content">
      <NuxtErrorBoundary>
        <slot />
        <template #error="{ error, clearError }">
          <div class="mx-auto mt-12 max-w-2xl rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-lg dark:border-red-900/50 dark:bg-red-950/30">
            <i class="pi pi-exclamation-triangle mx-auto mb-5 text-5xl text-red-500 dark:text-red-400" aria-hidden="true" />
            <h2 class="text-2xl font-black tracking-tight text-red-700 dark:text-red-400">Terjadi Kesalahan Aplikasi</h2>
            <p class="mt-3 text-base font-semibold text-red-600/80 dark:text-red-300/80">{{ error?.message || 'Error tidak diketahui' }}</p>
            <button
              type="button"
              class="mt-8 inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-950"
              @click="clearError"
            >
              <i class="pi pi-refresh" aria-hidden="true" />
              Muat Ulang Halaman
            </button>
          </div>
        </template>
      </NuxtErrorBoundary>
    </main>
    <LearningFooter />
  </div>
</template>

<script setup lang="ts">
import LearningFooter from '~/components/layout/LearningFooter.vue'
import LearningHeader from '~/components/layout/LearningHeader.vue'

useHead({
  bodyAttrs: {
    class: 'app-shell-learning',
  },
})
</script>
