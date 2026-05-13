<template>
  <AdminSurface>
    <div class="grid gap-3 border-b border-slate-200 p-4 dark:border-slate-800 lg:grid-cols-[1fr_auto] lg:items-center">
      <label class="relative min-w-0">
        <span class="sr-only">Search modules</span>
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" aria-hidden="true" />
        <input
          v-model="search"
          type="search"
          class="min-h-11 w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-cyan-950"
          placeholder="Search modules..."
        >
      </label>

      <div class="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        <button
          v-for="option in statusOptions"
          :key="option.value"
          type="button"
          class="min-h-10 rounded-lg px-3 text-xs font-black transition"
          :class="status === option.value ? 'bg-white text-brand-navy shadow-sm dark:bg-slate-950 dark:text-cyan-200' : 'text-slate-600 hover:text-brand-navy dark:text-slate-300 dark:hover:text-cyan-200'"
          @click="status = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div v-if="pending" class="p-6 text-sm font-semibold text-slate-500 dark:text-slate-400">Loading modules...</div>
    <div v-else-if="!filteredModules.length" class="p-6">
      <EmptyState title="No modules found" description="Try a different search or create a new module." icon="pi pi-search">
        <Button label="New Module" icon="pi pi-plus" @click="$emit('create')" />
      </EmptyState>
    </div>

    <div v-else class="lg:hidden p-4">
      <div v-auto-animate class="grid gap-4 md:grid-cols-2">
        <article v-for="module in filteredModules" :key="module.id || module.slug" class="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-brand-teal/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-teal-dark/50">
          <div>
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <h2 class="truncate text-lg font-black text-slate-950 transition-colors group-hover:text-brand-teal dark:text-white dark:group-hover:text-cyan-400">{{ module.title }}</h2>
                <p class="mt-0.5 truncate text-sm font-medium text-slate-500 dark:text-slate-400">/{{ module.slug }}</p>
              </div>
              <button type="button" class="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider transition hover:scale-[1.02]" :class="statusClass(module.status)" @click="$emit('toggle-status', module)">
                {{ module.status === 'PUBLISHED' ? 'Published' : 'Draft' }}
              </button>
            </div>
            <div class="mt-4 flex items-center justify-between text-sm">
              <div class="flex flex-col">
                <span class="font-bold text-slate-700 dark:text-slate-200">{{ module.details.length }}</span>
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Sections</span>
              </div>
              <div class="flex flex-col items-end">
                <span class="font-bold text-slate-700 dark:text-slate-200">{{ formatAdminDate(module.updatedAt) }}</span>
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Updated</span>
              </div>
            </div>
          </div>
          <div class="mt-5 grid grid-cols-2 gap-2">
            <Button label="Edit" icon="pi pi-pencil" size="small" class="w-full" @click="$emit('edit', module)" />
            <Button label="Delete" icon="pi pi-trash" size="small" severity="danger" outlined class="w-full" @click="$emit('delete', module)" />
          </div>
        </article>
      </div>
    </div>

    <div v-if="filteredModules.length" v-auto-animate class="hidden lg:block p-4 space-y-3">
      <div v-for="module in filteredModules" :key="module.id || module.slug" class="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-brand-teal/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-teal-dark/50">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3">
            <h2 class="truncate text-lg font-black text-slate-950 transition-colors group-hover:text-brand-teal dark:text-white dark:group-hover:text-cyan-400">
              {{ module.title }}
            </h2>
            <button type="button" class="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider transition hover:scale-[1.02]" :class="statusClass(module.status)" @click="$emit('toggle-status', module)">
              {{ module.status === 'PUBLISHED' ? 'Published' : 'Draft' }}
            </button>
          </div>
          <p class="mt-1 truncate text-sm font-medium text-slate-500 dark:text-slate-400">/{{ module.slug }}</p>
        </div>
        
        <div class="flex items-center gap-8 text-sm">
          <div class="flex flex-col items-end">
            <span class="font-bold text-slate-700 dark:text-slate-200">{{ module.details.length }}</span>
            <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Sections</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="font-bold text-slate-700 dark:text-slate-200">{{ formatAdminDate(module.updatedAt) }}</span>
            <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Updated</span>
          </div>
          <div class="flex items-center gap-2 transition-opacity">
            <Button label="Edit" icon="pi pi-pencil" size="small" @click="$emit('edit', module)" />
            <Button label="Delete" icon="pi pi-trash" size="small" severity="danger" outlined @click="$emit('delete', module)" />
          </div>
        </div>
      </div>
    </div>
  </AdminSurface>
</template>



<script setup lang="ts">
import type { LearningModule, PublishStatus } from '~/types/learning'
import AdminSurface from '~/components/admin/AdminSurface.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import { formatAdminDate } from '~/utils/adminModuleUi'

const props = withDefaults(defineProps<{
  modules: LearningModule[]
  pending?: boolean
}>(), {
  pending: false,
})

defineEmits<{
  create: []
  edit: [module: LearningModule]
  delete: [module: LearningModule]
  'toggle-status': [module: LearningModule]
}>()

const search = ref('')
const status = ref<'ALL' | PublishStatus>('ALL')
const statusOptions: Array<{ label: string, value: 'ALL' | PublishStatus }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Draft', value: 'DRAFT' },
]

const filteredModules = computed(() => {
  const query = search.value.trim().toLowerCase()
  return props.modules.filter((module) => {
    const haystack = [module.title, module.slug, module.description, module.keywords].join(' ').toLowerCase()
    return (status.value === 'ALL' || module.status === status.value) && (!query || haystack.includes(query))
  })
})

function statusClass(moduleStatus: PublishStatus) {
  return moduleStatus === 'PUBLISHED'
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200'
    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-200'
}
</script>
