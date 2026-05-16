<template>
  <AdminSurface>
    <div class="grid gap-3 border-b border-slate-200 p-4 dark:border-slate-800 lg:grid-cols-[1fr_auto] lg:items-center">
      <label class="relative min-w-0">
        <span class="sr-only">Cari modul</span>
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" aria-hidden="true" />
        <input
          v-model="search"
          type="search"
          class="min-h-11 w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-cyan-950"
          placeholder="Cari modul..."
        >
      </label>

      <div class="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        <button
          v-for="option in statusOptions"
          :key="option.value"
          type="button"
          class="min-h-10 flex-1 rounded-lg px-3 text-center text-xs font-black transition"
          :class="status === option.value ? 'bg-white text-brand-navy shadow-sm dark:bg-slate-950 dark:text-cyan-200' : 'text-slate-600 hover:text-brand-navy dark:text-slate-300 dark:hover:text-cyan-200'"
          @click="status = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div v-if="pending" class="p-6 text-sm font-semibold text-slate-500 dark:text-slate-400">Memuat modul...</div>
    <div v-else-if="!filteredModules.length" class="p-6">
      <EmptyState title="Modul tidak ditemukan" description="Coba kata kunci lain atau buat modul baru." icon="pi pi-search">
        <Button label="Modul Baru" icon="pi pi-plus" @click="$emit('create')" />
      </EmptyState>
    </div>

    <div v-else class="flex h-full flex-col p-3 sm:p-4">
      <div v-auto-animate="{ duration: 180, easing: 'ease-in-out' }" class="grid flex-1 gap-3 md:grid-cols-2 lg:grid-cols-1">
        <article 
          v-for="module in paginatedModules" 
          :key="module.id || module.slug" 
          class="group flex min-w-0 flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-brand-teal/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-teal-dark/50 sm:p-4 lg:flex-row lg:items-center"
        >
          <div class="flex min-w-0 flex-1 flex-col lg:flex-row lg:items-center lg:gap-3">
            <div class="flex min-w-0 items-start justify-between gap-3 lg:items-center">
              <h2 class="min-w-0 truncate text-lg font-black text-slate-950 transition-colors group-hover:text-brand-teal dark:text-white dark:group-hover:text-cyan-400">
                {{ module.title }}
              </h2>
              <button 
                type="button" 
                class="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider transition hover:scale-[1.02] lg:order-last" 
                :class="statusClass(module.status)" 
                @click="$emit('toggle-status', module)"
              >
                {{ module.status === 'PUBLISHED' ? 'Publikasi' : 'Draf' }}
              </button>
            </div>
            <p class="mt-0.5 lg:mt-0 truncate text-sm font-medium text-slate-500 dark:text-slate-400">
              /{{ module.slug }}
            </p>
          </div>
          
          <div class="flex items-center justify-between gap-4 text-sm lg:mt-0 lg:justify-end lg:gap-8">
            <div class="flex min-w-0 flex-col lg:items-end">
              <span class="font-bold text-slate-700 dark:text-slate-200">{{ module.details?.length || 0 }}</span>
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Bagian</span>
            </div>
            <div class="flex min-w-0 flex-col items-end">
              <span class="font-bold text-slate-700 dark:text-slate-200">{{ formatAdminDate(module.updatedAt) }}</span>
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Diubah</span>
            </div>
            <!-- Mobile Buttons (Grid) vs Desktop Buttons (Flex) -->
            <div class="hidden lg:flex items-center gap-2">
              <Button label="Edit" icon="pi pi-pencil" size="small" @click="$emit('edit', module)" />
              <Button label="Hapus" icon="pi pi-trash" size="small" severity="danger" outlined @click="$emit('delete', module)" />
            </div>
          </div>

          <!-- Mobile Action Buttons -->
          <div class="grid grid-cols-2 gap-2 lg:hidden">
            <Button label="Edit" icon="pi pi-pencil" size="small" class="min-w-0 w-full" @click="$emit('edit', module)" />
            <Button label="Hapus" icon="pi pi-trash" size="small" severity="danger" outlined class="min-w-0 w-full" @click="$emit('delete', module)" />
          </div>
        </article>
      </div>
      
      <!-- Paginator to keep rendering light -->
      <div v-if="filteredModules.length > 10" class="mt-4 flex justify-center border-t border-slate-200 pt-4 dark:border-slate-800">
        <Paginator 
          v-model:first="firstRow" 
          :rows="10" 
          :totalRecords="filteredModules.length" 
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        />
      </div>
    </div>
  </AdminSurface>
</template>



<script setup lang="ts">
import type { LearningModule, PublishStatus } from '~/types/learning'
import AdminSurface from '~/components/admin/AdminSurface.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import { formatAdminDate } from '~/utils/adminModuleUi'

const { modules, pending = false } = defineProps<{
  modules: LearningModule[]
  pending?: boolean
}>()

defineEmits<{
  create: []
  edit: [module: LearningModule]
  delete: [module: LearningModule]
  'toggle-status': [module: LearningModule]
}>()

const search = ref('')
const status = ref<'ALL' | PublishStatus>('ALL')
const statusOptions: Array<{ label: string, value: 'ALL' | PublishStatus }> = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Publikasi', value: 'PUBLISHED' },
  { label: 'Draf', value: 'DRAFT' },
]

const firstRow = ref(0)

const filteredModules = computed(() => {
  const query = search.value.trim().toLowerCase()
  return modules.filter((module) => {
    const haystack = [module.title, module.slug, module.description, module.keywords].join(' ').toLowerCase()
    return (status.value === 'ALL' || module.status === status.value) && (!query || haystack.includes(query))
  })
})

const paginatedModules = computed(() => {
  return filteredModules.value.slice(firstRow.value, firstRow.value + 10)
})

watch(search, () => { firstRow.value = 0 })
watch(status, () => { firstRow.value = 0 })

function statusClass(moduleStatus: PublishStatus) {
  return moduleStatus === 'PUBLISHED'
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200'
    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-200'
}
</script>
