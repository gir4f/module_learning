<template>
  <div v-auto-animate="{ duration: 180, easing: 'ease-out' }" class="space-y-5">
    <div v-if="showSearch" v-auto-animate="{ duration: 180, easing: 'ease-out' }" class="sticky top-[73px] z-20 rounded-lg border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div class="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
        <ModuleSearch v-model="searchModel" />
        <div class="flex gap-2 overflow-x-auto text-sm text-slate-600">
          <span class="shrink-0 rounded-md bg-slate-100 px-3 py-2 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{{ modules.length }} modul</span>
          <span class="shrink-0 rounded-md bg-slate-100 px-3 py-2 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{{ sectionCount }} bagian</span>
          <span class="shrink-0 rounded-md bg-slate-100 px-3 py-2 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{{ attachmentCount }} file</span>
        </div>
      </div>
    </div>

    <div v-auto-animate="{ duration: 180, easing: 'ease-out' }" class="space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-3 xl:flex-nowrap">
        <p class="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Menampilkan {{ modules.length }} dari {{ totalCount }} modul<span v-if="searchModel"> untuk "{{ searchModel }}"</span>
        </p>
        <button
          v-if="searchModel || activeCategory !== 'semua'"
          type="button"
          class="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-brand-teal focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:text-slate-200"
          @click="$emit('clear')"
        >
          <i class="pi pi-times text-xs" aria-hidden="true" />
          Bersihkan
        </button>
      </div>

      <div v-auto-animate="{ duration: 160, easing: 'ease-out' }" class="flex gap-2 overflow-x-auto pb-1 xl:justify-start">
        <button
          v-for="tab in categoryTabs"
          :key="tab.value"
          type="button"
          class="relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 dark:focus-visible:ring-cyan-400 dark:focus-visible:ring-offset-slate-950"
          :class="activeCategory === tab.value ? 'bg-brand-navy text-white shadow-sm dark:bg-cyan-400 dark:text-slate-950' : 'bg-white text-slate-600 hover:bg-brand-navy-light dark:bg-slate-900 dark:text-slate-300 dark:ring-1 dark:ring-slate-800 dark:hover:bg-slate-800 dark:hover:text-white'"
          @click="$emit('update:category', tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <LoadingBlock v-if="pending" :rows="6" />
    <ErrorNotice v-else-if="error" title="Modul gagal dimuat" :message="String(error)" />
    <EmptyState
      v-else-if="!modules.length"
      title="Modul tidak ditemukan"
      description="Coba kata kunci lain atau bersihkan filter."
      icon="pi pi-search"
    />

    <div
      v-else
      v-auto-animate="{ duration: 180, easing: 'ease-out' }"
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
  </div>
</template>





<script setup lang="ts">
import type { LearningModule } from '~/types/learning'
import EmptyState from '~/components/shared/EmptyState.vue'
import ErrorNotice from '~/components/shared/ErrorNotice.vue'
import LoadingBlock from '~/components/shared/LoadingBlock.vue'
import ModuleCard from '~/components/learning/ModuleCard.vue'
import ModuleSearch from '~/components/learning/ModuleSearch.vue'
import { categoryTabs, type ModuleCategory } from '~/utils/moduleUi'

const { modules, totalCount, activeCategory, pending, error, showSearch } = defineProps<{
  modules: LearningModule[]
  totalCount: number
  activeCategory: ModuleCategory
  pending?: boolean
  error?: unknown
  showSearch?: boolean
}>()

const searchModel = defineModel<string>({ default: '' })
defineEmits<{
  clear: []
  'update:category': [category: ModuleCategory]
}>()

const sectionCount = computed(() => modules.reduce((total, module) => total + module.details.length, 0))
const attachmentCount = computed(() => modules.reduce((total, module) => {
  return total + module.details.reduce((subtotal, detail) => subtotal + detail.attachments.length, 0)
}, 0))
</script>
