<template>
  <section class="space-y-6">
    <div class="admin-surface-enter overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="relative isolate overflow-hidden bg-slate-950 px-5 py-6 text-white sm:px-7">
        <div class="absolute inset-y-0 right-0 -z-10 w-2/3 bg-gradient-to-l from-brand-teal/30 via-brand-navy/20 to-transparent" />
        <div class="absolute -right-16 -top-20 -z-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

        <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-3xl">
            <p class="mb-3 inline-flex rounded-full border border-cyan-300/25 bg-white/5 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-200">
              Content Management
            </p>
            <h1 class="text-3xl font-black tracking-tight sm:text-4xl">Learning Modules</h1>
            <p class="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-300 sm:text-base">
              Kelola modul, status publish, section, komponen, dan attachment dalam cockpit CRUD yang cepat dibaca.
            </p>
            <p class="mt-3 text-xs font-semibold text-slate-400">{{ lastLoadedLabel }}</p>
          </div>

          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              label="Refresh"
              icon="pi pi-refresh"
              severity="secondary"
              outlined
              :loading="store.pending"
              class="w-full !border-white/25 !text-white hover:!bg-white/10 sm:w-auto"
              @click="refreshModules"
            />
            <Button
              label="New Module"
              icon="pi pi-plus"
              class="w-full !border-brand-teal !bg-brand-teal !font-bold hover:!border-brand-teal-dark hover:!bg-brand-teal-dark sm:w-auto"
              @click="openCreate"
            />
          </div>
        </div>
      </div>
    </div>

    <AdminMetricStrip :metrics="metrics" />

    <Toolbar class="admin-surface-enter !rounded-2xl !border-slate-200 !bg-white !px-4 !py-3 !shadow-sm dark:!border-slate-800 dark:!bg-slate-900">
      <template #start>
        <div class="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
          <div class="min-w-0">
            <p class="text-sm font-black text-slate-900 dark:text-white">Bulk actions</p>
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Pilih row untuk publish, draft, delete, atau export.</p>
          </div>

          <div class="hidden flex-wrap items-center gap-2 sm:flex">
            <Button label="Publish" icon="pi pi-check-circle" severity="success" outlined :disabled="!selectedModules.length" @click="bulkUpdateStatus('PUBLISHED')" />
            <Button label="Move to Draft" icon="pi pi-file-edit" severity="secondary" outlined :disabled="!selectedModules.length" @click="bulkUpdateStatus('DRAFT')" />
            <Button label="Delete" icon="pi pi-trash" severity="danger" outlined :disabled="!selectedModules.length" @click="confirmBulkDelete" />
            <Button label="Export CSV" icon="pi pi-download" severity="secondary" outlined :disabled="!filteredModules.length" @click="exportCsv" />
          </div>

          <div class="flex items-center gap-2 sm:hidden">
            <Button icon="pi pi-check-circle" severity="success" outlined rounded :disabled="!selectedModules.length" aria-label="Publish selected modules" @click="bulkUpdateStatus('PUBLISHED')" />
            <Button icon="pi pi-file-edit" severity="secondary" outlined rounded :disabled="!selectedModules.length" aria-label="Move selected modules to draft" @click="bulkUpdateStatus('DRAFT')" />
            <Button icon="pi pi-trash" severity="danger" outlined rounded :disabled="!selectedModules.length" aria-label="Delete selected modules" @click="confirmBulkDelete" />
            <Button icon="pi pi-download" severity="secondary" outlined rounded :disabled="!filteredModules.length" aria-label="Export modules as CSV" @click="exportCsv" />
          </div>
        </div>
      </template>
      <template #end>
        <div class="ml-3 flex shrink-0 items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <span class="hidden sm:inline">Selected</span>
          <Tag :value="selectedModules.length" :severity="selectedModules.length ? 'info' : 'secondary'" rounded />
        </div>
      </template>
    </Toolbar>

    <div class="admin-surface-enter overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 class="text-base font-black text-slate-950 dark:text-white">Module table</h2>
          <p class="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Klik row untuk quick view, double-click untuk buka editor.</p>
        </div>
        <span class="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
          <i class="pi pi-database text-brand-teal" aria-hidden="true" />
          {{ filteredModules.length }} rows
        </span>
      </div>

      <div class="border-b border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/45 sm:p-5">
        <div class="grid gap-3 xl:grid-cols-[minmax(320px,1fr)_190px_180px_190px_auto] xl:items-end">
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Search modules</span>
            <span class="relative">
              <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" aria-hidden="true" />
              <InputText
                v-model="search"
                class="w-full !rounded-xl !border-slate-300 !py-3 !pl-10 !pr-10 dark:!border-slate-700 dark:!bg-slate-950 dark:!text-slate-100"
                placeholder="Search title, slug, keyword, or section..."
                aria-label="Search modules"
              />
              <button
                v-if="search"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Clear search"
                @click="search = ''"
              >
                <i class="pi pi-times text-xs" aria-hidden="true" />
              </button>
            </span>
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Status</span>
            <Select v-model="statusFilter" :options="statusOptions" option-label="label" option-value="value" class="w-full !rounded-xl" />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Category</span>
            <Select v-model="categoryFilter" :options="categoryOptions" option-label="label" option-value="value" class="w-full !rounded-xl" />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Content health</span>
            <Select v-model="healthFilter" :options="healthOptions" option-label="label" option-value="value" class="w-full !rounded-xl" />
          </label>

          <div class="flex xl:justify-end">
            <Button
              label="Reset"
              icon="pi pi-filter-slash"
              severity="secondary"
              outlined
              class="w-full xl:w-auto"
              :disabled="!hasActiveFilters"
              @click="resetFilters"
            />
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p class="text-sm text-slate-600 dark:text-slate-300">
            Showing <strong class="text-slate-950 dark:text-white">{{ filteredModules.length }}</strong> of
            <strong class="text-slate-950 dark:text-white">{{ store.modules.length }}</strong> modules
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="chip in activeFilterChips"
              :key="chip.label"
              class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {{ chip.label }}
              <button type="button" class="text-slate-400 hover:text-slate-800 dark:hover:text-white" :aria-label="`Remove ${chip.label}`" @click="chip.clear">
                <i class="pi pi-times text-[0.65rem]" aria-hidden="true" />
              </button>
            </span>
          </div>
        </div>
      </div>

      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="-translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-2 opacity-0"
      >
        <div v-if="selectedModules.length" class="border-b border-cyan-100 bg-cyan-50 px-4 py-3 dark:border-cyan-900 dark:bg-cyan-950/40 sm:px-5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-teal shadow-sm dark:bg-slate-900">
                <i class="pi pi-check-square" aria-hidden="true" />
              </span>
              <div>
                <p class="text-sm font-bold text-brand-navy dark:text-cyan-200">{{ selectedModules.length }} selected</p>
                <p class="text-xs text-brand-navy/70 dark:text-cyan-200/70">Bulk actions are ready for the selected rows.</p>
              </div>
            </div>
            <button type="button" class="text-sm font-semibold text-brand-teal hover:text-brand-navy dark:text-cyan-300 dark:hover:text-cyan-100" @click="selectedModules = []">
              Clear selection
            </button>
          </div>
        </div>
      </Transition>

      <DataTable
        v-model:selection="selectedModules"
        :value="filteredModules"
        :loading="store.pending"
        :pt="dataTablePt"
        data-key="id"
        sort-field="sortOrder"
        :sort-order="1"
        paginator
        :rows="10"
        :rows-per-page-options="[10, 20, 50]"
        table-style="min-width: 82rem"
        class="bg-white dark:bg-slate-900"
        @row-click="openQuickView($event.data)"
        @row-dblclick="openEditor($event.data)"
      >
        <template #empty>
          <div class="px-6 py-12">
            <EmptyState
              title="No modules found"
              description="Try a different search or clear the active filters."
              icon="pi pi-search"
            >
              <div class="flex flex-wrap justify-center gap-2">
                <Button label="Reset filters" icon="pi pi-filter-slash" severity="secondary" outlined @click="resetFilters" />
              </div>
            </EmptyState>
          </div>
        </template>

        <Column selection-mode="multiple" header-style="width: 3.5rem" body-style="height: 72px" />

        <Column field="title" header="MODULE" sortable>
          <template #body="{ data }">
            <div class="flex items-center gap-4 py-1">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ring-1 ring-black/5 transition duration-200 group-hover:-translate-y-0.5 group-hover:scale-105" :class="categoryIconClass(data)">
                <i :class="categoryIcon(data)" aria-hidden="true" />
              </span>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="truncate text-[0.95rem] font-black text-slate-950 dark:text-white">{{ data.title }}</p>
                  <span class="rounded-full px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wide" :class="categoryPillClass(data)">
                    {{ moduleCategoryLabel(data) }}
                  </span>
                </div>
                <p class="mt-1 truncate text-xs font-medium text-slate-500 dark:text-slate-400">/{{ data.slug }}</p>
              </div>
            </div>
          </template>
        </Column>

        <Column field="status" header="STATUS" sortable>
          <template #body="{ data }">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-slate-100 dark:hover:bg-slate-800"
              :class="data.status === 'PUBLISHED' ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'"
              :aria-label="`Toggle ${data.title} status`"
              @click.stop="quickToggleStatus(data)"
            >
              <span class="h-2.5 w-2.5 rounded-full" :class="data.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'" aria-hidden="true" />
              {{ data.status === 'PUBLISHED' ? 'Published' : 'Draft' }}
            </button>
          </template>
        </Column>

        <Column header="SECTIONS"><template #body="{ data }"><span class="font-bold text-slate-900 dark:text-white">{{ componentSummary(data).sections }}</span></template></Column>
        <Column header="PARTS"><template #body="{ data }"><span class="font-bold text-slate-900 dark:text-white">{{ componentSummary(data).components }}</span></template></Column>
        <Column header="FILES"><template #body="{ data }"><span class="font-bold text-slate-900 dark:text-white">{{ componentSummary(data).attachments }}</span></template></Column>

        <Column header="HEALTH">
          <template #body="{ data }">
            <div class="w-36 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-950">
              <div class="mb-1 flex items-center justify-between text-xs">
                <span class="font-bold text-slate-700 dark:text-slate-200">{{ moduleHealth(data).label }}</span>
                <span class="font-semibold text-slate-400">{{ moduleHealth(data).score }}%</span>
              </div>
              <ProgressBar :value="moduleHealth(data).score" :show-value="false" class="!h-1.5" />
            </div>
          </template>
        </Column>

        <Column field="updatedAt" header="UPDATED" sortable>
          <template #body="{ data }">
            <div>
              <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ timeAgo(data.updatedAt) }}</p>
              <p class="mt-0.5 text-xs text-slate-400">{{ formatAdminDate(data.updatedAt) }}</p>
            </div>
          </template>
        </Column>

        <Column header="" body-style="width: 4rem">
          <template #body="{ data }">
            <Button icon="pi pi-ellipsis-v" text rounded severity="secondary" class="transition-transform hover:scale-105" aria-label="Open module actions" @click.stop="openRowMenu($event, data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <Menu ref="rowMenu" :model="rowMenuItems" popup :pt="menuPt" />

    <ModuleMetadataDrawer v-model:visible="moduleDrawerOpen" :module="editingModule" @save="saveModule" />

    <ModuleQuickViewDrawer
      v-model:visible="quickViewOpen"
      :module="quickViewModule"
      @edit="openEdit"
      @open-editor="openEditor"
      @view="viewLearner"
      @delete="confirmDelete"
    />
  </section>
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import type { LearningModule } from '~/types/learning'
import { useModulesStore } from '~/stores/modules'
import AdminMetricStrip from '~/components/admin/AdminMetricStrip.vue'
import ModuleMetadataDrawer from '~/components/admin/ModuleMetadataDrawer.vue'
import ModuleQuickViewDrawer from '~/components/admin/ModuleQuickViewDrawer.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import { timeAgo } from '~/utils/timeAgo'
import {
  attachmentCount,
  adminModuleCategory,
  categoryIcon,
  categoryIconClass,
  categoryPillClass,
  componentCount,
  formatAdminDate,
  moduleCategoryLabel,
  moduleCsvRows,
  moduleHealth,
  toCsv,
} from '~/utils/adminModuleUi'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const store = useModulesStore()
const confirm = useConfirm()
const toast = useToast()
const moduleDrawerOpen = ref(false)
const editingModule = ref<LearningModule | null>(null)
const selectedModules = ref<LearningModule[]>([])
const rowMenu = ref()
const menuModule = ref<LearningModule | null>(null)
const quickViewOpen = ref(false)
const quickViewModule = ref<LearningModule | null>(null)
const search = ref('')
const statusFilter = ref('ALL')
const categoryFilter = ref('ALL')
const healthFilter = ref('ALL')
const lastLoadedAt = ref<Date | null>(null)

const statusOptions = [
  { label: 'All statuses', value: 'ALL' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Draft', value: 'DRAFT' },
]
const categoryOptions = [
  { label: 'All categories', value: 'ALL' },
  { label: 'Device', value: 'device' },
  { label: 'Cable', value: 'cable' },
  { label: 'SOP', value: 'sop' },
  { label: 'Accessory', value: 'accessory' },
]
const healthOptions = [
  { label: 'All health', value: 'ALL' },
  { label: 'Ready', value: 'ready' },
  { label: 'Needs work', value: 'needs-work' },
  { label: 'Incomplete', value: 'incomplete' },
]

await store.fetchModules()
lastLoadedAt.value = new Date()

const lastLoadedLabel = computed(() => lastLoadedAt.value ? `Last loaded ${lastLoadedAt.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Loading module data')

const filteredModules = computed(() => {
  const query = search.value.trim().toLowerCase()
  return store.modules.filter((module) => {
    const statusMatches = statusFilter.value === 'ALL' || module.status === statusFilter.value
    const categoryMatches = categoryFilter.value === 'ALL' || adminModuleCategory(module) === categoryFilter.value
    const healthMatches = healthFilter.value === 'ALL' || moduleHealth(module).value === healthFilter.value
    const haystack = [
      module.title,
      module.slug,
      module.description,
      module.keywords,
      ...module.details.map((detail) => detail.title),
      ...module.details.flatMap((detail) => detail.components.map((component) => component.name)),
    ].join(' ').toLowerCase()
    return statusMatches && categoryMatches && healthMatches && (!query || haystack.includes(query))
  })
})

const metrics = computed(() => {
  const total = store.modules.length
  const published = store.modules.filter((module) => module.status === 'PUBLISHED').length
  const drafts = total - published
  const sections = store.modules.reduce((sum, module) => sum + module.details.length, 0)
  const components = store.modules.reduce((sum, module) => sum + componentCount(module), 0)
  const files = store.modules.reduce((sum, module) => sum + attachmentCount(module), 0)
  return [
    { label: 'All Modules', value: total, caption: `${published} published, ${drafts} draft`, icon: 'pi pi-book', iconClass: 'bg-brand-navy-light text-brand-navy', delay: 40 },
    { label: 'Published', value: published, caption: `${publishRate.value}% of library visible`, icon: 'pi pi-check-circle', iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-200', delay: 80 },
    { label: 'Drafts', value: drafts, caption: 'Hidden from learners', icon: 'pi pi-file-edit', iconClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-200', delay: 120 },
    { label: 'Sections', value: sections, caption: `${components} component rows`, icon: 'pi pi-list-check', iconClass: 'bg-cyan-50 text-brand-teal dark:bg-cyan-950/50 dark:text-cyan-200', delay: 160 },
    { label: 'Components', value: components, caption: 'Structured parts data', icon: 'pi pi-table', iconClass: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-200', delay: 200 },
    { label: 'Files', value: files, caption: 'Images, sheets, and links', icon: 'pi pi-paperclip', iconClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200', delay: 240 },
  ]
})

const publishRate = computed(() => {
  if (!store.modules.length) return 0
  return Math.round((store.modules.filter((module) => module.status === 'PUBLISHED').length / store.modules.length) * 100)
})

const hasActiveFilters = computed(() => Boolean(search.value || statusFilter.value !== 'ALL' || categoryFilter.value !== 'ALL' || healthFilter.value !== 'ALL'))
const activeFilterChips = computed(() => {
  const chips: Array<{ label: string, clear: () => void }> = []
  if (search.value) chips.push({ label: `Search: ${search.value}`, clear: () => { search.value = '' } })
  if (statusFilter.value !== 'ALL') chips.push({ label: `Status: ${statusFilter.value}`, clear: () => { statusFilter.value = 'ALL' } })
  if (categoryFilter.value !== 'ALL') chips.push({ label: `Category: ${categoryOptions.find((option) => option.value === categoryFilter.value)?.label || categoryFilter.value}`, clear: () => { categoryFilter.value = 'ALL' } })
  if (healthFilter.value !== 'ALL') chips.push({ label: `Health: ${healthOptions.find((option) => option.value === healthFilter.value)?.label || healthFilter.value}`, clear: () => { healthFilter.value = 'ALL' } })
  return chips
})

const rowMenuItems = computed(() => [
  { label: 'Quick View', icon: 'pi pi-eye', command: () => menuModule.value && openQuickView(menuModule.value) },
  { label: 'Edit Metadata', icon: 'pi pi-pencil', command: () => menuModule.value && openEdit(menuModule.value) },
  { label: 'Open Editor', icon: 'pi pi-list', command: () => menuModule.value && openEditor(menuModule.value) },
  { label: 'View Learner Page', icon: 'pi pi-external-link', command: () => menuModule.value && viewLearner(menuModule.value) },
  { separator: true },
  { label: 'Delete Module', icon: 'pi pi-trash', command: () => menuModule.value && confirmDelete(menuModule.value) },
])

const dataTablePt = {
  root: { class: 'overflow-hidden rounded-b-2xl bg-white dark:bg-slate-900' },
  tableContainer: { class: 'overflow-x-auto' },
  table: { class: 'w-full border-separate border-spacing-0 text-left text-sm text-slate-600 dark:text-slate-300' },
  thead: { class: 'bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400' },
  headerRow: { class: 'border-b border-slate-200 dark:border-slate-800' },
  headerCell: { class: 'border-0 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[0.68rem] font-black tracking-[0.11em] dark:border-slate-800 dark:bg-slate-950' },
  bodyRow: { class: 'admin-row-enter group cursor-pointer bg-white transition duration-150 hover:bg-cyan-50/55 dark:bg-slate-900 dark:hover:bg-slate-800/80' },
  bodyCell: { class: 'border-0 border-b border-slate-100 px-5 py-4 align-middle dark:border-slate-800' },
  paginator: { class: 'border-t border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950' },
}
const menuPt = {
  root: { class: '!rounded-xl !border !border-slate-200 !bg-white !p-1 !shadow-xl dark:!border-slate-800 dark:!bg-slate-900' },
  item: { class: 'rounded-lg' },
  itemContent: { class: 'rounded-lg hover:!bg-slate-100 dark:hover:!bg-slate-800' },
  itemLink: { class: '!gap-3 !rounded-lg !px-3 !py-2.5 !text-sm' },
  itemIcon: { class: '!text-slate-500 dark:!text-slate-300' },
  itemLabel: { class: '!font-semibold !text-slate-700 dark:!text-slate-200' },
}

function componentSummary(module: LearningModule) {
  return {
    sections: module.details.length,
    components: componentCount(module),
    attachments: attachmentCount(module),
  }
}

function openCreate() {
  editingModule.value = null
  moduleDrawerOpen.value = true
}

function openEdit(module: LearningModule) {
  editingModule.value = module
  moduleDrawerOpen.value = true
  quickViewOpen.value = false
}

function openQuickView(module: LearningModule) {
  quickViewModule.value = module
  quickViewOpen.value = true
}

function openEditor(module: LearningModule) {
  navigateTo(`/admin/modules/${module.id || module.slug}`)
}

async function refreshModules() {
  await store.fetchModules()
  lastLoadedAt.value = new Date()
  toast.add({ severity: 'success', summary: 'Refreshed', detail: 'Module table updated.', life: 1800 })
}

function resetFilters() {
  search.value = ''
  statusFilter.value = 'ALL'
  categoryFilter.value = 'ALL'
  healthFilter.value = 'ALL'
}

function openRowMenu(event: MouseEvent, module: LearningModule) {
  menuModule.value = module
  rowMenu.value?.toggle(event)
}

function viewLearner(module: LearningModule) {
  window.open(`/modules/${module.slug}`, '_blank', 'noopener,noreferrer')
}

async function saveModule(payload: Partial<LearningModule>) {
  try {
    if (editingModule.value?.id) await store.updateModule(editingModule.value.id, payload)
    else await store.createModule(payload)
    moduleDrawerOpen.value = false
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Module saved.', life: 2500 })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: error instanceof Error ? error.message : 'Failed to save module.', life: 3500 })
  }
}

async function quickToggleStatus(module: LearningModule) {
  if (!module.id) return
  const status = module.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
  try {
    await store.updateModule(module.id, { ...module, status })
    toast.add({ severity: 'success', summary: 'Status updated', detail: `${module.title} moved to ${status.toLowerCase()}.`, life: 2200 })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: error instanceof Error ? error.message : 'Failed to update status.', life: 3500 })
  }
}

async function bulkUpdateStatus(status: LearningModule['status']) {
  if (!selectedModules.value.length) return
  confirm.require({
    message: `${status === 'PUBLISHED' ? 'Publish' : 'Move to draft'} ${selectedModules.value.length} selected modules?`,
    header: 'Confirm bulk update',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await Promise.all(selectedModules.value.filter((module) => module.id).map((module) => store.updateModule(module.id!, { ...module, status })))
        selectedModules.value = []
        toast.add({ severity: 'success', summary: 'Updated', detail: 'Selected modules updated.', life: 2500 })
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error instanceof Error ? error.message : 'Failed to update selected modules.', life: 3500 })
      }
    },
  })
}

function confirmDelete(module: LearningModule) {
  confirm.require({
    message: `Delete "${module.title}"? This removes its details, components, and attachments metadata.`,
    header: 'Confirm delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      if (!module.id) return
      await store.deleteModule(module.id)
      selectedModules.value = selectedModules.value.filter((item) => item.id !== module.id)
      quickViewOpen.value = false
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Module deleted.', life: 2500 })
    },
  })
}

function confirmBulkDelete() {
  if (!selectedModules.value.length) return
  confirm.require({
    message: `Delete ${selectedModules.value.length} selected modules? This cannot be undone.`,
    header: 'Confirm bulk delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await Promise.all(selectedModules.value.filter((module) => module.id).map((module) => store.deleteModule(module.id!)))
        selectedModules.value = []
        toast.add({ severity: 'success', summary: 'Deleted', detail: 'Selected modules deleted.', life: 2500 })
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error instanceof Error ? error.message : 'Failed to delete selected modules.', life: 3500 })
      }
    },
  })
}

function exportCsv() {
  const blob = new Blob([toCsv(moduleCsvRows(filteredModules.value))], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'learning-modules.csv'
  link.click()
  URL.revokeObjectURL(url)
  toast.add({ severity: 'success', summary: 'Exported', detail: 'CSV export prepared.', life: 2000 })
}
</script>
