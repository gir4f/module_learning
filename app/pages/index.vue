<template>
  <PageShell wide>
    <section class="relative overflow-hidden rounded-3xl bg-slate-900 px-4 py-5 text-white shadow-lg sm:p-10 sm:shadow-2xl xl:p-12">
      <div class="absolute inset-0 bg-linear-to-br from-brand-navy via-brand-teal-dark to-brand-teal opacity-90" aria-hidden="true" />
      <div class="absolute inset-0 bg-[url('/grid.svg')] opacity-20" aria-hidden="true" />
      
      <div class="relative grid gap-4 sm:gap-8 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-center 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <div class="order-1 xl:col-start-1 xl:row-start-1">
          <img
            :src="'/module-assets/Gitronikbgputih.jpg'"
            alt="PT. Gitronik Dimindo Indonesia"
            class="hidden sm:block h-12 w-auto rounded-lg bg-white shadow-md ring-4 ring-white/10 sm:h-16"
            loading="lazy"
          >
          <p class="mt-5 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-200 sm:mt-8 sm:text-sm sm:tracking-wider">PT. Gitronik Dimindo Indonesia</p>
          <h1 class="mt-2 max-w-3xl text-[2rem] font-black leading-tight tracking-tight text-balance sm:mt-3 sm:text-5xl lg:text-6xl">
          Modul pembelajaran safety device
          </h1>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-cyan-50 opacity-90 sm:mt-5 sm:text-lg sm:leading-relaxed">
            Kumpulan modul teknis untuk membaca dokumentasi produk, komponen, dan lampiran internal dengan cepat dan responsif.
          </p>
        </div>
        <dl class="order-2 xl:col-start-2 xl:row-start-1 xl:row-span-2 grid grid-cols-3 overflow-hidden rounded-xl border border-white/15 bg-white/10 p-1 shadow-lg shadow-slate-950/10 sm:rounded-2xl sm:backdrop-blur-md">
          <div v-for="stat in heroStats" :key="stat.label" class="flex h-full min-w-0 flex-col justify-between rounded-xl px-3 py-2.5 text-center transition-colors hover:bg-white/10 sm:px-4 sm:py-3">
            <dt class="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/90 sm:text-[11px] sm:tracking-wide">
              <span class="sm:hidden">{{ stat.mobileLabel }}</span>
              <span class="hidden sm:inline">{{ stat.label }}</span>
            </dt>
            <dd class="mt-1 text-2xl font-black tracking-tight sm:text-4xl">{{ stat.value }}</dd>
          </div>
        </dl>
        <div class="order-3 xl:col-start-1 xl:row-start-2 w-full max-w-2xl rounded-2xl bg-white/10 p-1 shadow-lg ring-1 ring-white/20 sm:p-1.5 sm:shadow-2xl sm:backdrop-blur-md">
          <div class="relative flex items-center rounded-xl bg-white">
            <i class="pi pi-search absolute left-4 text-sm text-slate-400 sm:left-5" aria-hidden="true" />
            <input
              v-model="search"
              type="text"
              role="searchbox"
              class="w-full flex-1 rounded-xl border-0 bg-transparent py-3 pl-10 pr-10 text-sm font-medium text-slate-900 outline-none focus:ring-0 placeholder:text-slate-400 sm:py-4 sm:pl-12 sm:pr-12 sm:text-base"
              placeholder="Cari modul, produk, atau komponen..."
              aria-label="Cari modul"
            >
            <button
              v-if="search"
              type="button"
              class="absolute right-3 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 sm:right-4 sm:p-2"
              aria-label="Bersihkan pencarian"
              @click="search = ''"
            >
              <i class="pi pi-times" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <ModuleLibrary
      v-model="search"
      class="mt-6"
      :modules="paginatedModules"
      :total-count="sortedModules.length"
      :active-category="activeCategory"
      :sort="sort"
      :page="page"
      :rows="rows"
      :pending="learningStore.pending"
      :error="learningStore.error"
      :show-search="false"
      @clear="clearFilters"
      @update:page="page = $event"
      @update:category="activeCategory = $event"
      @update:sort="sort = $event"
    />
  </PageShell>
</template>

<script setup lang="ts">
import ModuleLibrary from '~/components/learning/ModuleLibrary.vue'
import PageShell from '~/components/shared/PageShell.vue'
import { useLearningModulesStore } from '~/stores/learningModules'
import { moduleCategory, sortModules, type ModuleCategory, type ModuleSort } from '~/utils/moduleUi'
import { moduleMatchesQuery } from '~/utils/search'

const search = useState('learning-module-local-search', () => '')
const activeCategory = ref<ModuleCategory>('semua')
const sort = ref<ModuleSort>('default')
const page = ref(1)
const rows = 15
const learningStore = useLearningModulesStore()

await learningStore.ensureModules()

watch([search, activeCategory, sort], () => {
  page.value = 1
})

const modules = computed(() => learningStore.modules)
const searchedModules = computed(() => {
  if (!search.value.trim()) return modules.value
  return modules.value.filter((module) => moduleMatchesQuery(module, search.value))
})
const filteredModules = computed(() => {
  if (activeCategory.value === 'semua') return searchedModules.value
  return searchedModules.value.filter((module) => moduleCategory(module) === activeCategory.value)
})
const sortedModules = computed(() => sortModules(filteredModules.value, sort.value))
const paginatedModules = computed(() => {
  const first = (page.value - 1) * rows
  return sortedModules.value.slice(first, first + rows)
})
const sectionCount = computed(() => modules.value.reduce((total, module) => total + module.details.length, 0))
const attachmentCount = computed(() => modules.value.reduce((total, module) => {
  return total + module.details.reduce((subtotal, detail) => subtotal + detail.attachments.length, 0)
}, 0))
const heroStats = computed(() => [
  { label: 'Modul', mobileLabel: 'Modul', value: modules.value.length },
  { label: 'Varian Produk', mobileLabel: 'Varian', value: sectionCount.value },
  { label: 'File', mobileLabel: 'File', value: attachmentCount.value },
])

useHead({
  title: 'Modul Ajar - PT. Gitronik Dimindo Indonesia',
})

function clearFilters() {
  search.value = ''
  activeCategory.value = 'semua'
  page.value = 1
}

useSeoMeta({
  title: 'Modul Pembelajaran Safety Device | Gitronik',
  description: 'Kumpulan modul ajar internal PT. Gitronik Dimindo Indonesia untuk dokumentasi safety device, komponen, dan lampiran teknis.',
  ogTitle: 'Modul Pembelajaran Safety Device',
  ogDescription: 'Kumpulan modul teknis internal PT. Gitronik Dimindo Indonesia.',
})
</script>
