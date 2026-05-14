<template>
  <form class="grid gap-5" @submit.prevent="submit">
    <AdminSurface compact>
      <AdminSectionHeader title="Identity" description="Keep title human-readable; slug stays URL-friendly." />
      <div class="grid gap-4 p-4">
        <AdminFieldGroup label="Title" :error="displayErrors.title" required>
          <InputText v-model="form.title" :invalid="Boolean(displayErrors.title)" placeholder="Example: Device Speed" />
        </AdminFieldGroup>
      </div>
    </AdminSurface>

    <AdminSurface compact class="[animation-delay:60ms]">
      <AdminSectionHeader title="Search and summary" description="This text helps learners find the right module quickly." />
      <div class="grid gap-4 p-4">
        <AdminFieldGroup label="Description">
          <Textarea v-model="form.description" rows="3" placeholder="Short learner-facing summary" />
        </AdminFieldGroup>

        <AdminFieldGroup label="Keywords" help="Separate common search words with commas.">
          <InputText v-model="form.keywords" placeholder="speed, safety, cable" />
        </AdminFieldGroup>
      </div>
    </AdminSurface>

    <AdminSurface compact class="[animation-delay:120ms]">
      <AdminSectionHeader title="Publishing" description="Drafts stay hidden until the module is ready." />
      <div class="grid gap-4 p-4 sm:grid-cols-2">
        <AdminFieldGroup label="Status">
          <Select v-model="form.status" :options="statuses" />
        </AdminFieldGroup>
        <AdminFieldGroup label="Sort Order" help="Lower numbers appear earlier in the module library.">
          <InputNumber v-model="form.sortOrder" input-id="sortOrder" />
        </AdminFieldGroup>
      </div>
    </AdminSurface>

    <div class="sticky bottom-0 -mx-1 flex flex-col-reverse gap-2 border-t border-slate-200 bg-white/95 px-1 pt-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:flex-row sm:justify-end">
      <Button type="button" label="Cancel" severity="secondary" outlined @click="$emit('cancel')" />
      <Button type="submit" label="Save Module" icon="pi pi-save" class="transition-transform hover:-translate-y-0.5" />
    </div>
  </form>
</template>

<script setup lang="ts">
import type { LearningModule, PublishStatus } from '~/types/learning'
import AdminFieldGroup from '~/components/admin/AdminFieldGroup.vue'
import AdminSectionHeader from '~/components/admin/AdminSectionHeader.vue'
import AdminSurface from '~/components/admin/AdminSurface.vue'

const { module, fieldErrors } = defineProps<{
  module?: Partial<LearningModule> | null
  fieldErrors?: Record<string, string>
}>()

const emit = defineEmits<{
  save: [payload: Partial<LearningModule>]
  cancel: []
}>()

const statuses: PublishStatus[] = ['DRAFT', 'PUBLISHED']
const errors = reactive<Record<string, string>>({})
const displayErrors = computed(() => ({
  ...fieldErrors,
  ...Object.fromEntries(Object.entries(errors).filter(([, value]) => value)),
}))
const form = reactive({
  title: '',
  description: '',
  keywords: '',
  status: 'DRAFT' as PublishStatus,
  sortOrder: 0,
})

watch(() => module, (module) => {
  form.title = module?.title || ''
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
