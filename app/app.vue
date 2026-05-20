<template>
  <div>
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[9999] focus:rounded-lg focus:bg-brand-teal focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg focus:outline-none"
    >Langsung ke konten utama</a>
    <NuxtLoadingIndicator color="#0d9488" :height="4" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <Toaster position="top-right" :theme="toasterTheme" richColors />
      <component :is="ScrollToTop" />
    </ClientOnly>
    <ConfirmDialog
      :pt="{
        root: { class: 'rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900' },
        header: { class: 'flex items-center justify-between gap-3 px-5 pt-4 pb-0' },
        title: { class: 'text-base font-black text-slate-900 dark:text-white' },
        headerActions: { class: 'flex items-center' },
        content: { class: 'px-5 py-3' },
        message: { class: 'flex items-center gap-3' },
        icon: { class: 'shrink-0 text-lg text-amber-500 dark:text-amber-400' },
        pcMessage: { class: 'text-sm font-semibold text-slate-600 dark:text-slate-300' },
        footer: { class: 'flex items-center justify-end gap-2 px-5 pb-4 pt-1' },
        mask: { class: 'backdrop-blur-sm bg-slate-950/50 dark:bg-slate-950/70' },
      }"
      :style="{ width: '26rem', maxWidth: '90vw' }"
    />
  </div>
</template>

<script setup lang="ts">
import ScrollToTop from '~/components/shared/ScrollToTop.vue'

const { isDark } = useDarkMode()
const toasterTheme = computed(() => isDark.value ? 'dark' : 'light')
</script>
