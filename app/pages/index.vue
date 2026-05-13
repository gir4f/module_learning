<template>
  <PageShell>
    <section class="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-2xl sm:p-10">
      <div class="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-teal-dark to-brand-teal opacity-90" aria-hidden="true" />
      <div class="absolute inset-0 bg-[url('/grid.svg')] opacity-20" aria-hidden="true" />
      
      <div class="relative grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
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
            Library teknis untuk membaca dokumentasi produk, komponen, dan lampiran internal dengan cepat dan responsif.
          </p>
          <div class="mt-8 max-w-2xl rounded-2xl bg-white/10 p-1.5 shadow-2xl ring-1 ring-white/20 backdrop-blur-md">
            <div class="relative flex items-center bg-white rounded-xl">
              <i class="pi pi-search absolute left-5 text-slate-400" aria-hidden="true" />
              <input
                ref="heroSearchInput"
                v-model="search"
                type="search"
                class="w-full flex-1 rounded-xl border-0 bg-transparent py-4 pl-12 pr-12 text-base font-medium text-slate-900 outline-none focus:ring-0 placeholder:text-slate-400"
                placeholder="Cari modul, produk, atau komponen..."
                aria-label="Cari modul"
              >
              <button
                v-if="search"
                type="button"
                class="absolute right-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 sm:right-20"
                aria-label="Bersihkan pencarian"
                @click="search = ''"
              >
                <i class="pi pi-times" aria-hidden="true" />
              </button>
              <kbd class="absolute right-4 hidden rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-500 sm:block">Ctrl K</kbd>
            </div>
          </div>
        </div>
        <dl class="grid grid-cols-1 gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur-md ring-1 ring-white/20 min-[360px]:grid-cols-3">
          <div v-for="stat in heroStats" :key="stat.label" class="min-w-0 rounded-lg bg-white/12 p-3">
            <dt class="text-xs font-semibold uppercase text-cyan-100">{{ stat.label }}</dt>
            <dd class="mt-2 text-2xl font-extrabold sm:text-3xl">{{ stat.value }}</dd>
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

const search = ref('')
const debouncedSearch = ref('')
const activeCategory = ref<ModuleCategory>('semua')
const heroSearchInput = ref<HTMLInputElement | null>(null)
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
  { label: 'Section', value: sectionCount.value },
  { label: 'Lampiran', value: attachmentCount.value },
])

useHead({
  title: 'Modul Ajar - PT. Gitronik Dimindo Indonesia',
})

onMounted(() => {
  window.addEventListener('keydown', focusShortcut)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', focusShortcut)
})

function focusShortcut(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    heroSearchInput.value?.focus()
  }
}

function clearFilters() {
  search.value = ''
  activeCategory.value = 'semua'
}

useSeoMeta({
  title: 'Modul Pembelajaran Safety Device | Gitronik',
  description: 'Library modul pembelajaran internal PT. Gitronik Dimindo Indonesia untuk dokumentasi safety device, komponen, dan lampiran teknis.',
  ogTitle: 'Modul Pembelajaran Safety Device',
  ogDescription: 'Library teknis internal PT. Gitronik Dimindo Indonesia.',
})
</script>
