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

    <div v-else class="lg:hidden">
      <div class="grid gap-3 p-4 md:grid-cols-2">
        <article v-for="module in filteredModules" :key="module.id || module.slug" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h2 class="truncate text-base font-black text-slate-950 dark:text-white">{{ module.title }}</h2>
              <p class="mt-1 truncate text-xs font-semibold text-slate-500 dark:text-slate-400">/{{ module.slug }}</p>
            </div>
            <button type="button" class="shrink-0 rounded-full px-2.5 py-1 text-xs font-black" :class="statusClass(module.status)" @click="$emit('toggle-status', module)">
              {{ module.status === 'PUBLISHED' ? 'Published' : 'Draft' }}
            </button>
          </div>
          <div class="mt-4 flex items-center justify-between text-sm">
            <span class="font-semibold text-slate-600 dark:text-slate-300">{{ module.details.length }} sections</span>
            <span class="text-xs font-semibold text-slate-400">{{ formatAdminDate(module.updatedAt) }}</span>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-2">
            <Button label="Edit" icon="pi pi-pencil" size="small" class="w-full" @click="$emit('edit', module)" />
            <Button label="Delete" icon="pi pi-trash" size="small" severity="danger" outlined class="w-full" @click="$emit('delete', module)" />
          </div>
        </article>
      </div>
    </div>

    <div v-if="filteredModules.length" class="hidden overflow-x-auto lg:block">
      <table class="w-full min-w-[760px] text-left text-sm">
        <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          <tr>
            <th class="px-4 py-3 font-black">Title</th>
            <th class="px-4 py-3 font-black">Status</th>
            <th class="px-4 py-3 font-black">Sections</th>
            <th class="px-4 py-3 font-black">Updated</th>
            <th class="px-4 py-3 text-right font-black">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
          <tr v-for="module in filteredModules" :key="module.id || module.slug" class="bg-white dark:bg-slate-900">
            <td class="px-4 py-4">
              <p class="font-black text-slate-950 dark:text-white">{{ module.title }}</p>
              <p class="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">/{{ module.slug }}</p>
            </td>
            <td class="px-4 py-4">
              <button type="button" class="rounded-full px-2.5 py-1 text-xs font-black transition hover:scale-[1.02]" :class="statusClass(module.status)" @click="$emit('toggle-status', module)">
                {{ module.status === 'PUBLISHED' ? 'Published' : 'Draft' }}
              </button>
            </td>
            <td class="px-4 py-4 font-semibold text-slate-700 dark:text-slate-200">{{ module.details.length }}</td>
            <td class="px-4 py-4 text-slate-600 dark:text-slate-300">{{ formatAdminDate(module.updatedAt) }}</td>
            <td class="px-4 py-4">
              <div class="flex justify-end gap-2">
                <Button label="Edit" icon="pi pi-pencil" size="small" @click="$emit('edit', module)" />
                <Button label="Delete" icon="pi pi-trash" size="small" severity="danger" outlined @click="$emit('delete', module)" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
