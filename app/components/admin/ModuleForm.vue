<template>
  <form class="grid gap-4" @submit.prevent="submit">
    <label class="grid gap-2">
      <span class="text-sm font-semibold text-slate-700">Title</span>
      <InputText v-model="form.title" />
      <small v-if="errors.title" class="text-red-600">{{ errors.title }}</small>
    </label>

    <label class="grid gap-2">
      <span class="text-sm font-semibold text-slate-700">Slug</span>
      <InputText v-model="form.slug" placeholder="Auto-generated when empty" />
    </label>

    <label class="grid gap-2">
      <span class="text-sm font-semibold text-slate-700">Description</span>
      <Textarea v-model="form.description" rows="3" />
    </label>

    <label class="grid gap-2">
      <span class="text-sm font-semibold text-slate-700">Keywords</span>
      <InputText v-model="form.keywords" />
    </label>

    <div class="grid gap-4 sm:grid-cols-2">
      <label class="grid gap-2">
        <span class="text-sm font-semibold text-slate-700">Status</span>
        <Select v-model="form.status" :options="statuses" />
      </label>
      <label class="grid gap-2">
        <span class="text-sm font-semibold text-slate-700">Sort Order</span>
        <InputNumber v-model="form.sortOrder" input-id="sortOrder" />
      </label>
    </div>

    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" outlined @click="$emit('cancel')" />
      <Button type="submit" label="Save Module" icon="pi pi-save" />
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
