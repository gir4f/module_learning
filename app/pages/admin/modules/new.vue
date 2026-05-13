<template>
  <section class="mx-auto max-w-3xl space-y-6 pb-12">
    <div class="flex items-center gap-4">
      <button type="button" class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white" @click="navigateTo('/admin/modules')">
        <i class="pi pi-arrow-left" aria-hidden="true" />
      </button>
      <div>
        <h1 class="text-2xl font-black text-brand-navy dark:text-cyan-200 sm:text-3xl">New Module</h1>
        <p class="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Create the module shell first, then add sections and component tables.</p>
      </div>
    </div>

    <AdminSurface class="p-6 sm:p-8">
      <form class="grid gap-6" @submit.prevent="saveModule">
        <AdminFieldGroup label="Title" :error="fieldErrors.title" required>
          <InputText v-model.trim="form.title" class="w-full" autocomplete="off" />
        </AdminFieldGroup>
        
        <AdminFieldGroup label="Slug" :error="fieldErrors.slug" help="Leave blank to generate from title.">
          <InputText v-model.trim="form.slug" class="w-full" autocomplete="off" />
        </AdminFieldGroup>
        
        <AdminFieldGroup label="Description" :error="fieldErrors.description">
          <Textarea v-model="form.description" class="w-full" rows="4" auto-resize />
        </AdminFieldGroup>
        
        <div class="grid gap-6 md:grid-cols-2">
          <AdminFieldGroup label="Keywords" :error="fieldErrors.keywords">
            <InputText v-model.trim="form.keywords" class="w-full" placeholder="comma separated" autocomplete="off" />
          </AdminFieldGroup>
          <AdminFieldGroup label="Status" :error="fieldErrors.status">
            <Select v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" class="w-full" />
          </AdminFieldGroup>
        </div>

        <div v-if="formError" class="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-red-800 dark:bg-red-950/40 dark:text-red-200">
          <i class="pi pi-exclamation-triangle mt-0.5 shrink-0" aria-hidden="true" />
          <p class="text-sm font-semibold">{{ formError }}</p>
        </div>

        <div class="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-slate-200 pt-6 dark:border-slate-800">
          <Button label="Cancel" severity="secondary" outlined type="button" class="w-full sm:w-auto" @click="navigateTo('/admin/modules')" />
          <Button label="Save Module" icon="pi pi-check" type="submit" :loading="saving" class="w-full sm:w-auto" />
        </div>
      </form>
    </AdminSurface>
  </section>
</template>

<script setup lang="ts">
import AdminFieldGroup from '~/components/admin/AdminFieldGroup.vue'
import AdminSurface from '~/components/admin/AdminSurface.vue'
import { apiErrorMessage, apiFieldErrors, assignFieldErrors } from '~/utils/apiErrors'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const statusOptions = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Published', value: 'PUBLISHED' },
]

const saving = ref(false)
const formError = ref('')
const fieldErrors = reactive<Record<string, string>>({})
const form = reactive({
  title: '',
  slug: '',
  description: '',
  keywords: '',
  status: 'DRAFT' as const,
  sortOrder: 0,
})

async function saveModule() {
  saving.value = true
  formError.value = ''
  assignFieldErrors(fieldErrors, {})
  try {
    const module = await $fetch<{ id: string }>('/api/modules', { method: 'POST', body: form })
    await navigateTo(`/admin/modules/${module.id}`)
  } catch (error) {
    assignFieldErrors(fieldErrors, apiFieldErrors(error))
    formError.value = apiErrorMessage(error, 'Failed to create module.')
  } finally {
    saving.value = false
  }
}
</script>
