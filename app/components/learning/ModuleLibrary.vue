<template>
  <div v-auto-animate="learnerAutoAnimateConfig" class="space-y-5">
    <div v-if="showSearch" class="sticky top-[73px] z-20 rounded-lg border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div class="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
        <ModuleSearch v-model="searchModel" />
        <div class="scrollbar-hidden flex gap-2 overflow-x-auto text-sm text-slate-600">
          <span class="shrink-0 rounded-md bg-slate-100 px-3 py-2 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{{ modules.length }} modul</span>
          <span class="shrink-0 rounded-md bg-slate-100 px-3 py-2 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{{ sectionCount }} varian produk</span>
          <span class="shrink-0 rounded-md bg-slate-100 px-3 py-2 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{{ attachmentCount }} file</span>
        </div>
      </div>
    </div>

    <div class="grid gap-2 sm:grid-cols-[minmax(0,1fr)_11rem] sm:items-start sm:gap-x-4">
      <div class="flex min-h-5 flex-wrap items-center gap-3">
        <p class="text-sm font-semibold leading-5 text-slate-600 dark:text-slate-300">
          Menampilkan {{ modules.length }} dari {{ totalCount }} modul<span v-if="searchModel"> untuk "{{ searchModel }}"</span>
        </p>
        <button
          v-if="searchModel || activeCategory !== 'semua'"
          type="button"
          class="inline-flex min-h-5 items-center gap-1.5 rounded-md border border-slate-300 px-2 py-0.5 text-xs font-semibold text-slate-700 hover:border-brand-teal focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:text-slate-200"
          @click="$emit('clear')"
        >
          <i class="pi pi-times text-[10px]" aria-hidden="true" />
          Bersihkan
        </button>
      </div>

      <span class="hidden min-h-5 items-center text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:flex">
        SORT
      </span>

      <div class="scrollbar-hidden flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        <button
          v-for="tab in categoryTabs"
          :key="tab.value"
          type="button"
          class="relative min-h-11 shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 dark:focus-visible:ring-cyan-400 dark:focus-visible:ring-offset-slate-950"
          :class="activeCategory === tab.value ? 'bg-brand-navy text-white shadow-sm dark:bg-cyan-400 dark:text-slate-950' : 'bg-white text-slate-600 hover:bg-brand-navy-light dark:bg-slate-900 dark:text-slate-300 dark:ring-1 dark:ring-slate-800 dark:hover:bg-slate-800 dark:hover:text-white'"
          @click="$emit('update:category', tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>

      <SortSelect
        :model-value="sort"
        label=""
        class="w-full sm:[&_.p-select]:min-h-11"
        @update:model-value="$emit('update:sort', $event)"
      />
    </div>

    <LoadingBlock v-if="pending" :rows="6" />
    <ErrorNotice v-else-if="error" title="Modul gagal dimuat" :message="String(error)" />
    <EmptyState
      v-else-if="!modules.length"
      title="Modul tidak ditemukan"
      description="Coba kata kunci lain atau bersihkan filter."
      icon="pi pi-search"
    >
      <button
        v-if="searchModel || activeCategory !== 'semua'"
        type="button"
        class="inline-flex items-center gap-2 rounded-md bg-brand-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-teal-dark focus:outline-none focus:ring-4 focus:ring-cyan-100"
        @click="$emit('clear')"
      >
        <i class="pi pi-times text-xs" aria-hidden="true" />
        Bersihkan Filter
      </button>
    </EmptyState>

    <div
      v-else
      v-auto-animate="learnerAutoAnimateConfig"
      class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[96rem]:grid-cols-5"
    >
      <ModuleCard
        v-for="(module, index) in modules"
        :key="module.slug"
        :module="module"
        :index="index"
        :search="searchModel"
      />
    </div>

    <div v-if="totalCount > rows" class="flex justify-center border-t border-slate-200 pt-4 dark:border-slate-800">
      <Paginator
        :first="first"
        :rows="rows"
        :total-records="totalCount"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        @page="$emit('update:page', $event.page + 1)"
      />
    </div>
  </div>
</template>





<script setup lang="ts">
import type { LearningModule } from '~/types/learning'
import EmptyState from '~/components/shared/EmptyState.vue'
import ErrorNotice from '~/components/shared/ErrorNotice.vue'
import LoadingBlock from '~/components/shared/LoadingBlock.vue'
import ModuleCard from '~/components/learning/ModuleCard.vue'
import ModuleSearch from '~/components/learning/ModuleSearch.vue'
import SortSelect from '~/components/shared/SortSelect.vue'
import { learnerAutoAnimateConfig } from '~/utils/motion'
import { categoryTabs, type ModuleCategory, type ModuleSort } from '~/utils/moduleUi'

const { modules, totalCount, activeCategory, pending, error, showSearch, page = 1, rows = 15 } = defineProps<{
  modules: LearningModule[]
  totalCount: number
  activeCategory: ModuleCategory
  sort: ModuleSort
  page?: number
  rows?: number
  pending?: boolean
  error?: unknown
  showSearch?: boolean
}>()

const searchModel = defineModel<string>({ default: '' })
defineEmits<{
  clear: []
  'update:page': [page: number]
  'update:category': [category: ModuleCategory]
  'update:sort': [sort: ModuleSort]
}>()

const first = computed(() => Math.max(0, (page - 1) * rows))
const sectionCount = computed(() => modules.reduce((total, module) => total + module.details.length, 0))
const attachmentCount = computed(() => modules.reduce((total, module) => {
  return total + module.details.reduce((subtotal, detail) => subtotal + detail.attachments.length, 0)
}, 0))
</script>
