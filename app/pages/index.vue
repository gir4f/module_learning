<template>
  <PageShell wide>
    <section class="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-lg sm:p-10 sm:shadow-2xl xl:p-12">
      <div class="absolute inset-0 bg-linear-to-br from-brand-navy via-brand-teal-dark to-brand-teal opacity-90" aria-hidden="true" />
      <div class="absolute inset-0 bg-[url('/grid.svg')] opacity-20" aria-hidden="true" />
      
      <div class="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-center 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <div>
          <img
            :src="'/module-assets/Gitronikbgputih.jpg'"
            alt="PT. Gitronik Dimindo Indonesia"
            class="h-16 w-auto rounded-lg bg-white shadow-md ring-4 ring-white/10"
            loading="lazy"
          >
          <p class="mt-8 text-sm font-black uppercase tracking-wider text-cyan-200">PT. Gitronik Dimindo Indonesia</p>
          <h1 class="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-balance">
          Modul pembelajaran safety device
          </h1>
          <p class="mt-5 max-w-2xl text-lg leading-relaxed text-cyan-50 opacity-90">
            Kumpulan modul teknis untuk membaca dokumentasi produk, komponen, dan lampiran internal dengan cepat dan responsif.
          </p>
          <div class="mt-8 max-w-2xl rounded-2xl bg-white/10 p-1.5 shadow-lg ring-1 ring-white/20 sm:shadow-2xl sm:backdrop-blur-md">
            <div class="relative flex items-center bg-white rounded-xl">
              <i class="pi pi-search absolute left-5 text-slate-400" aria-hidden="true" />
              <input
                v-model="search"
                type="text"
                role="searchbox"
                class="w-full flex-1 rounded-xl border-0 bg-transparent py-4 pl-12 pr-12 text-base font-medium text-slate-900 outline-none focus:ring-0 placeholder:text-slate-400"
                placeholder="Cari modul, produk, atau komponen..."
                aria-label="Cari modul"
              >
              <button
                v-if="search"
                type="button"
                class="absolute right-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100"
                aria-label="Bersihkan pencarian"
                @click="search = ''"
              >
                <i class="pi pi-times" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <dl class="grid grid-cols-1 overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-1 shadow-lg shadow-slate-950/10 min-[360px]:grid-cols-3 sm:backdrop-blur-md xl:grid-cols-1 2xl:grid-cols-3">
          <div v-for="stat in heroStats" :key="stat.label" class="min-w-0 rounded-xl px-4 py-3 transition-colors hover:bg-white/10 min-[360px]:text-center xl:text-left 2xl:text-center">
            <dt class="text-[11px] font-black uppercase tracking-wide text-cyan-100/90">{{ stat.label }}</dt>
            <dd class="mt-1 text-3xl font-black tracking-tight sm:text-4xl">{{ stat.value }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <ModuleLibrary
      v-model="search"
      class="mt-6"
      :modules="filteredModules"
      :total-count="modules.length"
      :active-category="activeCategory"
      :pending="pending"
      :error="error"
      :show-search="false"
      @clear="clearFilters"
      @update:category="activeCategory = $event"
    />
  </PageShell>
</template>

<script setup lang="ts">
import type { LearningModule } from '~/types/learning'
import ModuleLibrary from '~/components/learning/ModuleLibrary.vue'
import PageShell from '~/components/shared/PageShell.vue'
import { moduleCategory, type ModuleCategory } from '~/utils/moduleUi'

const search = useState('learning-module-local-search', () => '')
const debouncedSearch = ref(search.value)
const activeCategory = ref<ModuleCategory>('semua')
let searchTimer: ReturnType<typeof setTimeout> | null = null

watch(search, (value) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    debouncedSearch.value = value
  }, 200)
})

const api = useApiClient()
const { data, pending, error } = await useAsyncData<LearningModule[]>('home-modules', async () => {
  const { data } = await api.get<LearningModule[]>('/api/modules', {
    params: debouncedSearch.value ? { search: debouncedSearch.value } : undefined,
  })
  return data
}, {
  default: () => [],
  watch: [debouncedSearch],
})

const modules = computed(() => data.value || [])
const filteredModules = computed(() => {
  if (activeCategory.value === 'semua') return modules.value
  return modules.value.filter((module) => moduleCategory(module) === activeCategory.value)
})
const sectionCount = computed(() => modules.value.reduce((total, module) => total + module.details.length, 0))
const attachmentCount = computed(() => modules.value.reduce((total, module) => {
  return total + module.details.reduce((subtotal, detail) => subtotal + detail.attachments.length, 0)
}, 0))
const heroStats = computed(() => [
  { label: 'Modul', value: modules.value.length },
  { label: 'Bagian', value: sectionCount.value },
  { label: 'File', value: attachmentCount.value },
])

useHead({
  title: 'Modul Ajar - PT. Gitronik Dimindo Indonesia',
})

function clearFilters() {
  search.value = ''
  activeCategory.value = 'semua'
}

useSeoMeta({
  title: 'Modul Pembelajaran Safety Device | Gitronik',
  description: 'Kumpulan modul ajar internal PT. Gitronik Dimindo Indonesia untuk dokumentasi safety device, komponen, dan lampiran teknis.',
  ogTitle: 'Modul Pembelajaran Safety Device',
  ogDescription: 'Kumpulan modul teknis internal PT. Gitronik Dimindo Indonesia.',
})
</script>
