<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
      <div>
        <p class="text-sm font-bold uppercase text-brand-teal">PT. Gitronik Dimindo Indonesia</p>
        <h1 class="mt-3 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
          Modul pembelajaran safety device
        </h1>
        <p class="mt-4 max-w-2xl text-lg text-slate-600">
          Cari modul, detail produk, komponen, dan lampiran dari dokumentasi pembelajaran internal.
        </p>
      </div>
      <img
        :src="'/module-assets/Fototruk.png'"
        alt="Truk dengan safety device"
        class="h-64 w-full rounded-lg object-cover shadow-sm ring-1 ring-slate-200"
      >
    </div>

    <div class="mt-8">
      <ModuleSearch v-model="search" />
    </div>

    <div v-if="pending" class="mt-8 rounded-lg bg-white p-6 text-slate-600">
      Loading modules...
    </div>

    <div v-else-if="error" class="mt-8 rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
      {{ error }}
    </div>

    <div v-else class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="module in modules"
        :key="module.slug"
        :to="`/modules/${module.slug}`"
        class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-teal hover:shadow-md"
      >
        <div class="flex items-start justify-between gap-3">
          <h2 class="text-lg font-bold text-brand-navy">{{ module.title }}</h2>
          <span class="rounded-full bg-cyan-50 px-2 py-1 text-xs font-bold text-brand-teal">
            {{ module.details.length }}
          </span>
        </div>
        <p class="mt-2 line-clamp-2 text-sm text-slate-600">{{ module.description || module.keywords }}</p>
        <p class="mt-4 text-sm font-semibold text-brand-teal">Open module</p>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { LearningModule } from '~/types/learning'
import ModuleSearch from '~/components/learning/ModuleSearch.vue'

const search = ref('')
const debouncedSearch = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

watch(search, (value) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    debouncedSearch.value = value
  }, 200)
})

const { data, pending, error } = await useFetch<LearningModule[]>('/api/modules', {
  query: computed(() => debouncedSearch.value ? { search: debouncedSearch.value } : {}),
  default: () => [],
})

const modules = computed(() => data.value || [])
</script>
