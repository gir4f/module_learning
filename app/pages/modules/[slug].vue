<template>
  <div>
    <ModuleDocument v-if="module" :module="module" />
    <section v-else class="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 class="text-2xl font-bold text-slate-900">Module not found</h1>
      <p class="mt-2 text-slate-600">The requested learning module is unavailable or unpublished.</p>
      <NuxtLink to="/" class="mt-6 inline-flex rounded-md bg-brand-teal px-4 py-2 font-semibold text-white">
        Back to modules
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
  title: computed(() => module.value ? `${module.value.title} | Modul Ajar` : 'Module not found'),
})
</script>
