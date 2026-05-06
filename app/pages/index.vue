<template>
  <PageShell>
    <section class="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-navy via-brand-navy to-brand-teal p-5 text-white shadow-xl sm:p-8">
      <div class="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-center">
        <div>
          <img
            :src="'/module-assets/Gitronikbgputih.jpg'"
            alt="PT. Gitronik Dimindo Indonesia"
            class="h-14 w-auto rounded-md bg-white"
            loading="lazy"
          >
          <p class="mt-6 text-sm font-bold uppercase text-cyan-100">PT. Gitronik Dimindo Indonesia</p>
          <h1 class="mt-2 max-w-3xl text-3xl font-extrabold sm:text-5xl">
          Modul pembelajaran safety device
          </h1>
          <p class="mt-4 max-w-3xl text-base leading-7 text-cyan-50">
            Library teknis untuk membaca dokumentasi produk, komponen, dan lampiran internal dengan cepat.
          </p>
          <div class="mt-6 max-w-2xl rounded-xl bg-white/95 p-2 shadow-lg">
            <div class="relative">
              <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                ref="heroSearchInput"
                v-model="search"
                type="search"
                class="w-full rounded-lg border-0 bg-white py-4 pl-11 pr-24 text-base text-slate-900 outline-none focus:ring-4 focus:ring-cyan-100"
                placeholder="Cari modul, produk, atau komponen..."
                aria-label="Cari modul"
              >
              <button
                v-if="search"
                type="button"
                class="absolute right-16 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Bersihkan pencarian"
                @click="search = ''"
              >
                <i class="pi pi-times" aria-hidden="true" />
              </button>
              <kbd class="absolute right-4 top-1/2 -translate-y-1/2 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">Ctrl K</kbd>
            </div>
          </div>
        </div>
        <dl class="grid grid-cols-3 gap-3 overflow-x-auto rounded-xl bg-white/10 p-4 backdrop-blur">
          <div v-for="stat in heroStats" :key="stat.label" class="min-w-24 rounded-lg bg-white/12 p-3">
            <dt class="text-xs font-semibold uppercase text-cyan-100">{{ stat.label }}</dt>
            <dd class="mt-2 text-3xl font-extrabold">{{ stat.value }}</dd>
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
  title: 'Modul Ajar — PT. Gitronik Dimindo Indonesia',
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
