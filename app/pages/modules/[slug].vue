<template>
  <div>
    <ModuleDocument v-if="module" :module="module" />
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
import type { LearningModule } from '~/types/learning'
import ModuleDocument from '~/components/learning/ModuleDocument.vue'

const route = useRoute()
const { data: module } = await useFetch<LearningModule>(`/api/modules/${route.params.slug}`)

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
