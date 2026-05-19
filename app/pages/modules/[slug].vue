<template>
  <div>
    <!-- Loading skeleton -->
    <div v-if="pending" class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div class="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside class="space-y-3">
          <div class="h-4 w-24 animate-shimmer skeleton-shimmer rounded" />
          <div v-for="i in 4" :key="i" class="h-8 w-full animate-shimmer skeleton-shimmer rounded-lg" />
        </aside>
        <div class="space-y-5">
          <div class="space-y-3">
            <div class="h-3 w-32 animate-shimmer skeleton-shimmer rounded" />
            <div class="h-8 w-2/3 animate-shimmer skeleton-shimmer rounded" />
            <div class="h-4 w-1/2 animate-shimmer skeleton-shimmer rounded" />
          </div>
          <div v-for="i in 2" :key="i" class="space-y-3 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div class="h-6 w-1/3 animate-shimmer skeleton-shimmer rounded" />
            <div class="h-3 w-full animate-shimmer skeleton-shimmer rounded" />
            <div class="h-3 w-5/6 animate-shimmer skeleton-shimmer rounded" />
            <div class="h-3 w-2/3 animate-shimmer skeleton-shimmer rounded" />
          </div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <section v-else-if="error" class="mx-auto max-w-3xl px-4 py-16 text-center">
      <div class="rounded-2xl border border-red-200 bg-red-50 p-8 dark:border-red-900 dark:bg-red-950/40">
        <i class="pi pi-exclamation-triangle text-3xl text-red-500" aria-hidden="true" />
        <h1 class="mt-4 text-xl font-bold text-red-800 dark:text-red-100">Gagal memuat modul</h1>
        <p class="mt-2 text-sm text-red-700 dark:text-red-200">Terjadi kesalahan saat mengambil data modul. Silakan coba lagi.</p>
        <NuxtLink to="/" class="mt-6 inline-flex rounded-md bg-brand-teal px-4 py-2 font-semibold text-white">
          Kembali ke modul
        </NuxtLink>
      </div>
    </section>

    <!-- Module document -->
    <ModuleDocument v-else-if="module" :module="module" />

    <!-- Not found -->
    <section v-else class="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Modul tidak ditemukan</h1>
      <p class="mt-2 text-slate-600 dark:text-slate-300">Modul pembelajaran yang diminta belum tersedia atau belum dipublikasikan.</p>
      <NuxtLink to="/" class="mt-6 inline-flex rounded-md bg-brand-teal px-4 py-2 font-semibold text-white">
        Kembali ke modul
      </NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import ModuleDocument from '~/components/learning/ModuleDocument.vue'
import { useLearningModulesStore } from '~/stores/learningModules'

const route = useRoute()
const learningStore = useLearningModulesStore()

await learningStore.fetchModuleBySlug(String(route.params.slug))

const module = computed(() => learningStore.currentModule)
const pending = computed(() => learningStore.pendingDetail)
const error = computed(() => learningStore.detailError)

watch(() => route.params.slug, async (slug, previousSlug) => {
  if (!slug || slug === previousSlug) return
  learningStore.setCurrentModule(null)
  await learningStore.fetchModuleBySlug(String(slug))
})

useHead({
  title: computed(() => module.value ? `${module.value.title} | Modul Ajar` : 'Modul tidak ditemukan'),
})

useSeoMeta({
  title: computed(() => module.value ? `${module.value.title} | Modul Ajar` : 'Modul tidak ditemukan'),
  description: computed(() => module.value?.description || 'Modul pembelajaran internal PT. Gitronik Dimindo Indonesia.'),
  ogTitle: computed(() => module.value ? `${module.value.title} | Modul Ajar` : 'Modul tidak ditemukan'),
  ogDescription: computed(() => module.value?.description || 'Modul pembelajaran internal PT. Gitronik Dimindo Indonesia.'),
})
</script>
