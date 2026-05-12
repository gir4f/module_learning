<template>
  <section class="mx-auto max-w-3xl space-y-5">
    <div>
      <h1 class="text-2xl font-black text-brand-navy dark:text-cyan-200 sm:text-3xl">New Module</h1>
      <p class="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">Create the module shell first, then add sections and component tables.</p>
    </div>

    <AdminSurface padded>
      <form class="grid gap-4" @submit.prevent="saveModule">
        <AdminFieldGroup label="Title" :error="fieldErrors.title" required>
          <InputText v-model.trim="form.title" class="w-full" autocomplete="off" />
        </AdminFieldGroup>
        <AdminFieldGroup label="Slug" :error="fieldErrors.slug" help="Leave blank to generate from title.">
          <InputText v-model.trim="form.slug" class="w-full" autocomplete="off" />
        </AdminFieldGroup>
        <AdminFieldGroup label="Description" :error="fieldErrors.description">
          <Textarea v-model="form.description" class="w-full" rows="4" auto-resize />
        </AdminFieldGroup>
        <AdminFieldGroup label="Keywords" :error="fieldErrors.keywords">
          <InputText v-model.trim="form.keywords" class="w-full" placeholder="comma separated" autocomplete="off" />
        </AdminFieldGroup>
        <AdminFieldGroup label="Status" :error="fieldErrors.status">
          <select v-model="form.status" class="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-brand-teal focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-cyan-950">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </AdminFieldGroup>

        <p v-if="formError" class="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-100">{{ formError }}</p>

        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button label="Cancel" severity="secondary" outlined type="button" @click="navigateTo('/admin/modules')" />
          <Button label="Save" icon="pi pi-check" type="submit" :loading="saving" />
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
