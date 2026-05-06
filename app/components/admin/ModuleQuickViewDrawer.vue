<template>
  <Drawer
    :visible="visible"
    position="right"
    class="!w-full md:!w-[32rem]"
    :pt="drawerPt"
    @update:visible="$emit('update:visible', $event)"
  >
    <template #header>
      <div>
        <p class="text-xs font-bold uppercase tracking-wide text-brand-teal dark:text-cyan-300">Quick view</p>
        <h2 class="text-xl font-bold text-slate-950 dark:text-white">{{ module?.title || 'Module' }}</h2>
      </div>
    </template>

    <div v-if="module" class="grid gap-5">
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between gap-3">
          <span class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide" :class="module.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-200'">
            <span class="h-2 w-2 rounded-full" :class="module.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'" />
            {{ module.status }}
          </span>
          <span class="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide" :class="categoryPillClass(module)">
            {{ moduleCategoryLabel(module) }}
          </span>
        </div>
        <p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ module.description || 'No description yet.' }}</p>
        <p class="mt-3 break-all text-xs font-semibold text-slate-400 dark:text-slate-500">/{{ module.slug }}</p>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div class="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400">Sections</p>
          <p class="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{{ module.details.length }}</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400">Components</p>
          <p class="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{{ componentCount(module) }}</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400">Files</p>
          <p class="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{{ attachmentCount(module) }}</p>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div class="mb-2 flex items-center justify-between text-xs">
          <span class="font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Content health</span>
          <span class="font-bold text-slate-600 dark:text-slate-300">{{ moduleHealth(module).score }}%</span>
        </div>
        <ProgressBar :value="moduleHealth(module).score" :show-value="false" class="!h-2" />
        <p class="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{{ moduleHealth(module).label }}</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="font-bold text-slate-950 dark:text-white">Details preview</h3>
          <span class="text-xs font-semibold text-slate-400">{{ module.details.length }} total</span>
        </div>
        <div class="grid gap-2">
          <div v-for="detail in module.details.slice(0, 5)" :key="detail.id || detail.slug" class="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <p class="font-semibold text-slate-900 dark:text-white">{{ detail.title }}</p>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ detail.components.length }} components · {{ detail.attachments.length }} files</p>
          </div>
        </div>
      </div>

      <div class="sticky bottom-0 -mx-1 flex flex-wrap gap-2 border-t border-slate-200 bg-white/95 px-1 pt-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <Button label="Edit Metadata" icon="pi pi-pencil" @click="$emit('edit', module)" />
        <Button label="Open Editor" icon="pi pi-list" severity="secondary" outlined @click="$emit('open-editor', module)" />
        <Button label="Learner Page" icon="pi pi-eye" severity="secondary" outlined @click="$emit('view', module)" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" outlined @click="$emit('delete', module)" />
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import type { LearningModule } from '~/types/learning'
import {
  attachmentCount,
  categoryPillClass,
  componentCount,
  moduleCategoryLabel,
  moduleHealth,
} from '~/utils/adminModuleUi'

defineProps<{
  visible: boolean
  module?: LearningModule | null
}>()

defineEmits<{
  'update:visible': [value: boolean]
  edit: [module: LearningModule]
  'open-editor': [module: LearningModule]
  view: [module: LearningModule]
  delete: [module: LearningModule]
}>()

const drawerPt = {
  root: { class: '!bg-white dark:!bg-slate-950' },
  header: { class: '!border-b !border-slate-200 dark:!border-slate-800 !px-6 !py-5' },
  content: { class: '!px-6 !py-5' },
}
</script>
