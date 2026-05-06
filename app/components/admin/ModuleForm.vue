<template>
  <form class="grid gap-5" @submit.prevent="submit">
    <div class="admin-surface-enter rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900">
      <div class="grid gap-4">
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Title <span class="text-red-500">*</span></span>
          <InputText v-model="form.title" :invalid="Boolean(errors.title)" placeholder="Example: Device Speed" />
          <small v-if="errors.title" class="text-red-600 dark:text-red-300">{{ errors.title }}</small>
        </label>

        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Slug</span>
          <InputText v-model="form.slug" placeholder="Auto-generated when empty" />
          <small class="text-xs text-slate-500 dark:text-slate-400">Used in learner URLs. Leave empty to generate from title.</small>
        </label>
      </div>
    </div>

    <div class="admin-surface-enter rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 [animation-delay:60ms]">
      <div class="grid gap-4">
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Description</span>
          <Textarea v-model="form.description" rows="3" placeholder="Short learner-facing summary" />
        </label>

        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Keywords</span>
          <InputText v-model="form.keywords" placeholder="speed, safety, cable" />
        </label>
      </div>
    </div>

    <div class="admin-surface-enter rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 [animation-delay:120ms]">
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Status</span>
          <Select v-model="form.status" :options="statuses" />
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Sort Order</span>
          <InputNumber v-model="form.sortOrder" input-id="sortOrder" />
        </label>
      </div>
    </div>

    <div class="sticky bottom-0 -mx-1 flex justify-end gap-2 border-t border-slate-200 bg-white/95 px-1 pt-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <Button type="button" label="Cancel" severity="secondary" outlined @click="$emit('cancel')" />
      <Button type="submit" label="Save Module" icon="pi pi-save" class="transition-transform hover:-translate-y-0.5" />
    </div>
  </form>
</template>

<script setup lang="ts">
import type { LearningModule, PublishStatus } from '~/types/learning'

const props = defineProps<{
  module?: Partial<LearningModule> | null
}>()

const emit = defineEmits<{
  save: [payload: Partial<LearningModule>]
  cancel: []
}>()

const statuses: PublishStatus[] = ['DRAFT', 'PUBLISHED']
const errors = reactive<Record<string, string>>({})
const form = reactive({
  title: '',
  slug: '',
  description: '',
  keywords: '',
  status: 'DRAFT' as PublishStatus,
  sortOrder: 0,
})

watch(() => props.module, (module) => {
  form.title = module?.title || ''
  form.slug = module?.slug || ''
  form.description = module?.description || ''
  form.keywords = module?.keywords || ''
  form.status = module?.status || 'DRAFT'
  form.sortOrder = module?.sortOrder || 0
}, { immediate: true })

function submit() {
  errors.title = form.title.trim() ? '' : 'Title is required.'
  if (errors.title) return
  emit('save', { ...form })
}
</script>
