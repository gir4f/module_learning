<template>
  <div>
    <AdminSurface>
      <div ref="cardEl">
        <div class="grid gap-3 border-b border-slate-200 p-4 dark:border-slate-800 min-[90rem]:grid-cols-[minmax(0,1fr)_auto_auto] min-[90rem]:items-end">
          <div class="flex min-w-0 flex-col gap-1.5">
            <p v-if="!props.pending || props.modules.length" class="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Menampilkan {{ paginatedModules.length }} dari {{ sortedModules.length }} modul
            </p>
            <label class="relative min-w-0">
              <span class="sr-only">Cari modul</span>
            <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" aria-hidden="true" />
            <input
              ref="searchInput"
              v-model="search"
              type="text"
              role="searchbox"
              class="min-h-11 w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-cyan-950"
              :class="search ? 'pr-11' : 'pr-24'"
              placeholder="Cari modul..."
              @keydown.escape.prevent="handleSearchEscape"
            >
            <button
              v-if="search"
              type="button"
              class="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 dark:focus-visible:ring-cyan-950"
              aria-label="Bersihkan pencarian modul"
              @click="clearSearch"
            >
              <i class="pi pi-times text-xs" aria-hidden="true" />
            </button>
            <kbd v-else class="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-black text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 sm:inline-flex">Ctrl K</kbd>
          </label>
          </div>

          <div class="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800 min-[48rem]:w-full min-[90rem]:w-auto">
            <button
              v-for="option in statusOptions"
              :key="option.value"
              type="button"
              class="min-h-10 flex-1 rounded-lg px-3 text-center text-xs font-black transition min-[90rem]:flex-none"
              :class="status === option.value ? 'bg-white text-brand-navy shadow-sm dark:bg-slate-950 dark:text-cyan-200' : 'text-slate-600 hover:text-brand-navy dark:text-slate-300 dark:hover:text-cyan-200'"
              @click="status = option.value"
            >
              {{ option.label }}
            </button>
          </div>

          <SortSelect
            :model-value="sort"
            class="w-full min-[90rem]:w-44"
            @update:model-value="sort = $event"
          />
        </div>

      <div v-if="props.pending && !props.modules.length" class="p-6 text-sm font-semibold text-slate-500 dark:text-slate-400">Memuat modul...</div>
      <div v-else-if="!filteredModules.length" class="p-6">
        <EmptyState title="Modul tidak ditemukan" description="Coba kata kunci lain atau buat modul baru." icon="pi pi-search">
          <Button label="Modul Baru" icon="pi pi-plus" @click="$emit('create')" />
        </EmptyState>
      </div>

      <div v-else class="flex h-full flex-col p-4 sm:p-5">
        <div class="mb-3 hidden grid-cols-[2.5rem_minmax(13rem,1fr)_8.5rem_minmax(10rem,13rem)_7rem_10rem_11.5rem] items-center gap-4 rounded-xl bg-slate-100 px-4 py-3 text-[11px] font-black uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300 min-[96rem]:grid">
          <label class="flex items-center justify-center">
            <span class="sr-only">Pilih semua modul di halaman aktif</span>
            <input
              type="checkbox"
              class="h-4 w-4 rounded border-slate-300 text-brand-teal focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-900 dark:focus:ring-cyan-900"
              :checked="allPageSelected"
              :disabled="props.busy || !selectablePageIds.length"
              @change="handleSelectAllChange"
            >
          </label>
          <span>Nama Modul</span>
          <span>Status</span>
          <span>Alamat</span>
          <span>Varian Produk</span>
          <span>Terakhir Diubah</span>
          <span class="text-center">Aksi</span>
        </div>

        <div v-auto-animate="learnerAutoAnimateConfig" class="grid flex-1 gap-3 min-[48rem]:grid-cols-2 min-[96rem]:grid-cols-1">
          <article
            v-for="module in paginatedModules"
            :key="module.id || module.slug"
            class="group grid min-w-0 gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-brand-teal/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-teal-dark/50 sm:p-4 min-[96rem]:grid-cols-[2.5rem_minmax(13rem,1fr)_8.5rem_minmax(10rem,13rem)_7rem_10rem_11.5rem] min-[96rem]:items-center"
          >
            <div class="flex items-start justify-between gap-3 min-[96rem]:items-center min-[96rem]:justify-center">
              <label class="flex items-center justify-center">
                <span class="sr-only">Pilih modul {{ module.title }}</span>
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-slate-300 text-brand-teal focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-900 dark:focus:ring-cyan-900"
                  :checked="module.id ? selectedIds.includes(module.id) : false"
                  :disabled="props.busy || !module.id"
                  @change="handleRowSelectionChange(module.id, $event)"
                >
              </label>
              <button
                type="button"
                class="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 min-[96rem]:hidden"
                :class="statusClass(module.status)"
                :disabled="props.busy"
                @click="$emit('toggle-status', module)"
              >
                {{ module.status === 'PUBLISHED' ? 'Publikasi' : 'Draf' }}
              </button>
            </div>

            <div class="min-w-0">
              <div class="flex min-w-0 items-start justify-between gap-3 min-[96rem]:block">
                <h2 class="min-w-0 truncate text-lg font-black text-slate-950 transition-colors group-hover:text-brand-teal dark:text-white dark:group-hover:text-cyan-400">
                  {{ module.title }}
                </h2>
              </div>
              <p class="mt-0.5 truncate text-sm font-medium text-slate-500 dark:text-slate-400 min-[96rem]:hidden">
                /{{ module.slug }}
              </p>
            </div>

            <button
              type="button"
              class="hidden w-fit justify-self-start rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 min-[96rem]:inline-flex min-[96rem]:-ml-2.5"
              :class="statusClass(module.status)"
              :disabled="props.busy"
              @click="$emit('toggle-status', module)"
            >
              {{ module.status === 'PUBLISHED' ? 'Publikasi' : 'Draf' }}
            </button>

            <p class="hidden min-w-0 truncate text-sm font-semibold text-slate-500 dark:text-slate-400 min-[96rem]:block">
              /{{ module.slug }}
            </p>

            <div class="hidden min-w-0 min-[96rem]:block">
              <span class="font-bold text-slate-700 dark:text-slate-200">{{ module.details?.length || 0 }}</span>
            </div>

            <div class="hidden min-w-0 min-[96rem]:block">
              <span class="font-bold text-slate-700 dark:text-slate-200">{{ formatAdminDate(module.updatedAt) }}</span>
            </div>

            <div class="hidden items-center justify-end gap-2 min-[96rem]:flex">
              <Button label="Edit" icon="pi pi-pencil" size="small" :disabled="props.busy" @click="$emit('edit', module)" />
              <Button label="Hapus" icon="pi pi-trash" size="small" severity="danger" outlined :disabled="props.busy" @click="$emit('delete', module)" />
            </div>

            <div class="flex items-center justify-between gap-4 text-sm min-[96rem]:hidden">
              <div class="flex min-w-0 flex-col">
                <span class="font-bold text-slate-700 dark:text-slate-200">{{ module.details?.length || 0 }}</span>
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Varian Produk</span>
              </div>
              <div class="flex min-w-0 flex-col items-end">
                <span class="font-bold text-slate-700 dark:text-slate-200">{{ formatAdminDate(module.updatedAt) }}</span>
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Diubah</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 min-[96rem]:hidden">
              <Button label="Edit" icon="pi pi-pencil" size="small" class="min-w-0 w-full" :disabled="props.busy" @click="$emit('edit', module)" />
              <Button label="Hapus" icon="pi pi-trash" size="small" severity="danger" outlined class="min-w-0 w-full" :disabled="props.busy" @click="$emit('delete', module)" />
            </div>
          </article>
        </div>


      </div>
      </div>
    </AdminSurface>

    <div v-if="(!props.pending || props.modules.length) && sortedModules.length > 10" class="mt-4 flex justify-center border-t border-slate-200 pt-4 dark:border-slate-800">
      <Paginator
        v-model:first="firstRow"
        :rows="10"
        :total-records="sortedModules.length"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      />
    </div>

    <Transition name="bulk-pill">
      <BulkActionPill
        v-if="selectedIds.length"
        :selected-count="selectedIds.length"
        :actions="bulkActions"
        :busy="props.busy"
        :on-cancel="clearSelection"
        :position-style="pillStyle"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { LearningModule, PublishStatus } from '~/types/learning'
import AdminSurface from '~/components/admin/AdminSurface.vue'
import BulkActionPill, { type BulkAction } from '~/components/shared/BulkActionPill.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import SortSelect from '~/components/shared/SortSelect.vue'
import { formatAdminDate } from '~/utils/adminModuleUi'
import { learnerAutoAnimateConfig } from '~/utils/motion'
import { sortModules, type ModuleSort } from '~/utils/moduleUi'

const props = withDefaults(defineProps<{
  modules: LearningModule[]
  pending?: boolean
  busy?: boolean
  selectionResetKey?: number
}>(), {
  pending: false,
  busy: false,
  selectionResetKey: 0,
})

const emit = defineEmits<{
  create: []
  edit: [module: LearningModule]
  delete: [module: LearningModule]
  'toggle-status': [module: LearningModule]
  'open-command-palette': []
  'bulk-status': [payload: { ids: string[], status: PublishStatus }]
  'bulk-delete': [ids: string[]]
}>()

const search = ref('')
const searchInput = useTemplateRef<HTMLInputElement>('searchInput')
const cardEl = useTemplateRef<HTMLElement>('cardEl')
const status = ref<'ALL' | PublishStatus>('ALL')
const sort = ref<ModuleSort>('default')
const statusOptions: Array<{ label: string, value: 'ALL' | PublishStatus }> = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Publikasi', value: 'PUBLISHED' },
  { label: 'Draf', value: 'DRAFT' },
]

const firstRow = ref(0)
const selectedIds = ref<string[]>([])
const cardCenter = ref(0)

const bulkActions: BulkAction[] = [
  { key: 'publish', label: 'Publikasi', icon: 'pi pi-globe', severity: 'primary', handler: () => emitBulkStatus('PUBLISHED') },
  { key: 'draft', label: 'Draf', icon: 'pi pi-file-edit', severity: 'secondary', handler: () => emitBulkStatus('DRAFT') },
  { key: 'delete', label: 'Hapus', icon: 'pi pi-trash', severity: 'danger', handler: () => emit('bulk-delete', [...selectedIds.value]) },
]

const filteredModules = computed(() => {
  const query = search.value.trim().toLowerCase()
  return props.modules.filter((module) => {
    const haystack = [module.title, module.slug, module.description, module.keywords].join(' ').toLowerCase()
    return (status.value === 'ALL' || module.status === status.value) && (!query || haystack.includes(query))
  })
})

const sortedModules = computed(() => sortModules(filteredModules.value, sort.value))

const paginatedModules = computed(() => {
  return sortedModules.value.slice(firstRow.value, firstRow.value + 10)
})

const selectablePageIds = computed(() => paginatedModules.value
  .map(module => module.id)
  .filter((id): id is string => Boolean(id)))

const allPageSelected = computed(() => {
  return selectablePageIds.value.length > 0
    && selectablePageIds.value.every(id => selectedIds.value.includes(id))
})

const pillStyle = computed(() => ({
  left: `${cardCenter.value}px`,
  transform: 'translateX(-50%)',
}))

watch(search, () => { firstRow.value = 0 })
watch(status, () => { firstRow.value = 0 })
watch(sort, () => { firstRow.value = 0 })
watch(selectablePageIds, (ids) => {
  selectedIds.value = selectedIds.value.filter(id => ids.includes(id))
}, { immediate: true })
watch(() => props.selectionResetKey, () => {
  selectedIds.value = []
})

function updateCardCenter() {
  if (!cardEl.value) return
  const rect = cardEl.value.getBoundingClientRect()
  cardCenter.value = rect.left + rect.width / 2
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  window.addEventListener('keydown', handleGlobalShortcut)
  window.addEventListener('resize', updateCardCenter, { passive: true })
  updateCardCenter()

  if (cardEl.value) {
    resizeObserver = new ResizeObserver(updateCardCenter)
    resizeObserver.observe(cardEl.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalShortcut)
  window.removeEventListener('resize', updateCardCenter)
  resizeObserver?.disconnect()
})

function statusClass(moduleStatus: PublishStatus) {
  return moduleStatus === 'PUBLISHED'
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200'
    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-200'
}

function clearSearch() {
  search.value = ''
  searchInput.value?.focus()
}

function clearSelection() {
  selectedIds.value = []
}

function handleSelectAllChange(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  selectedIds.value = checked ? [...selectablePageIds.value] : []
}

function handleRowSelectionChange(id: string | undefined, event: Event) {
  if (!id) return
  const checked = (event.target as HTMLInputElement).checked
  if (checked) {
    if (!selectedIds.value.includes(id)) selectedIds.value = [...selectedIds.value, id]
    return
  }

  selectedIds.value = selectedIds.value.filter(selectedId => selectedId !== id)
}

function emitBulkStatus(statusValue: PublishStatus) {
  if (!selectedIds.value.length) return
  emit('bulk-status', { ids: [...selectedIds.value], status: statusValue })
}

function handleSearchEscape() {
  if (search.value) {
    search.value = ''
    return
  }
  searchInput.value?.blur()
}

function handleGlobalShortcut(event: KeyboardEvent) {
  if (event.key === 'Escape' && selectedIds.value.length > 0) {
    clearSelection()
    return
  }
  if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k') return
  if (window.matchMedia('(max-width: 1023px)').matches) return
  event.preventDefault()
  emit('open-command-palette')
}
</script>
