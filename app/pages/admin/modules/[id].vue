<template>
  <section v-if="module" class="space-y-6 pb-12">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="flex items-start gap-4 min-w-0">
        <button type="button" class="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white" @click="navigateTo('/admin/modules')">
          <i class="pi pi-arrow-left" aria-hidden="true" />
        </button>
        <div class="min-w-0 flex-1">
          <h1 class="truncate text-2xl font-black text-brand-navy dark:text-cyan-200 sm:text-3xl">{{ module.title }}</h1>
          <p class="mt-1 break-all text-sm font-medium text-slate-500 dark:text-slate-400">/{{ module.slug }}</p>
        </div>
      </div>
      <div class="flex shrink-0 items-center gap-2 pl-14 sm:pl-0">
        <Button label="Preview Learner View" icon="pi pi-eye" severity="secondary" outlined class="w-full sm:w-auto" @click="navigateTo(`/modules/${module.slug}`)" />
      </div>
    </div>

    <AdminSurface class="p-6 sm:p-8">
      <form class="grid gap-4" @submit.prevent="saveModule">
        <AdminSectionHeader title="Module metadata" description="This appears on the learner dashboard and document header." />
        <div class="grid gap-4 md:grid-cols-2">
          <AdminFieldGroup label="Title" :error="moduleFieldErrors.title" required>
            <InputText v-model.trim="moduleForm.title" class="w-full" />
          </AdminFieldGroup>
          <AdminFieldGroup label="Slug" :error="moduleFieldErrors.slug" required>
            <InputText v-model.trim="moduleForm.slug" class="w-full" />
          </AdminFieldGroup>
        </div>
        <AdminFieldGroup label="Description" :error="moduleFieldErrors.description">
          <Textarea v-model="moduleForm.description" class="w-full" rows="3" auto-resize />
        </AdminFieldGroup>
        <div class="grid gap-4 md:grid-cols-[1fr_180px]">
          <AdminFieldGroup label="Keywords" :error="moduleFieldErrors.keywords">
            <InputText v-model.trim="moduleForm.keywords" class="w-full" />
          </AdminFieldGroup>
          <AdminFieldGroup label="Status" :error="moduleFieldErrors.status">
            <Select v-model="moduleForm.status" :options="statusOptions" optionLabel="label" optionValue="value" class="w-full" />
          </AdminFieldGroup>
        </div>
        <p v-if="moduleError" class="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-100">{{ moduleError }}</p>
        <div class="flex justify-end">
          <Button label="Save Module" icon="pi pi-check" type="submit" :loading="savingModule" />
        </div>
      </form>
    </AdminSurface>

    <div class="space-y-4" v-auto-animate>
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-xl font-black text-slate-950 dark:text-white">Sections</h2>
        <Button label="Add Section" icon="pi pi-plus" @click="addSection" />
      </div>

      <AdminSurface v-for="(section, index) in sectionForms" :key="section.localKey" v-auto-animate>
        <button type="button" class="group flex w-full items-center justify-between gap-4 border-b border-slate-200 p-5 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50" @click="toggleSection(section.localKey)">
          <div class="flex items-center gap-4 min-w-0">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-brand-teal group-hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-brand-teal-dark">
              <i class="pi font-bold" :class="expandedSections.has(section.localKey) ? 'pi-folder-open' : 'pi-folder'" aria-hidden="true" />
            </span>
            <span class="min-w-0">
              <span class="block truncate text-lg font-black text-slate-950 transition-colors group-hover:text-brand-teal dark:text-white dark:group-hover:text-cyan-400">{{ section.title || 'Untitled section' }}</span>
              <span class="block truncate text-sm font-semibold text-slate-500 dark:text-slate-400">/{{ section.slug || 'section-slug' }}</span>
            </span>
          </div>
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-transform duration-200 dark:border-slate-700 dark:bg-slate-900" :class="{ 'rotate-180': expandedSections.has(section.localKey) }">
            <i class="pi pi-chevron-down text-sm font-bold" aria-hidden="true" />
          </span>
        </button>

        <div v-if="expandedSections.has(section.localKey)" class="grid gap-5 p-4 sm:p-5">
          <div class="grid gap-4 md:grid-cols-2">
            <AdminFieldGroup label="Title" required>
              <InputText v-model.trim="section.title" class="w-full" />
            </AdminFieldGroup>
            <AdminFieldGroup label="Slug">
              <InputText v-model.trim="section.slug" class="w-full" />
            </AdminFieldGroup>
          </div>
          <AdminFieldGroup label="Summary">
            <Textarea v-model="section.summary" class="w-full" rows="3" auto-resize />
          </AdminFieldGroup>
          <AdminFieldGroup label="Keywords">
            <InputText v-model.trim="section.keywords" class="w-full" />
          </AdminFieldGroup>

          <div class="space-y-3">
            <AdminSectionHeader title="Component rows" description="Edit directly in the table." />
            <InlineComponentTable v-model="section.components" />
          </div>

          <div class="space-y-3">
            <AdminSectionHeader title="Attachments" description="Add reference links or upload local files." />
            <div v-if="section.attachments.length" class="grid gap-2" v-auto-animate>
              <div v-for="attachment in section.attachments" :key="attachment.id || attachment.url" class="flex flex-col gap-2 rounded-xl border border-slate-200 p-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <a :href="attachment.url" target="_blank" rel="noopener noreferrer" class="min-w-0 font-bold text-brand-teal hover:underline">
                  <span class="block truncate">{{ attachment.title }}</span>
                  <span class="block truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{{ attachment.type }} · {{ attachment.mimeType || attachment.url }}</span>
                </a>
                <Button label="Delete" icon="pi pi-trash" size="small" severity="danger" outlined @click="confirmDeleteAttachment(attachment)" />
              </div>
            </div>
            <p v-else class="rounded-xl bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-500 dark:bg-slate-950 dark:text-slate-400">No attachments yet.</p>

            <div class="grid gap-3 rounded-2xl border border-slate-200 p-3 dark:border-slate-800 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <AdminFieldGroup label="Link title">
                <InputText v-model.trim="linkForms[section.localKey].title" class="w-full" />
              </AdminFieldGroup>
              <AdminFieldGroup label="URL">
                <InputText v-model.trim="linkForms[section.localKey].url" class="w-full" />
              </AdminFieldGroup>
              <Button label="Add Link" icon="pi pi-link" severity="secondary" outlined @click="addLink(section)" />
            </div>

            <div class="relative flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 transition-colors hover:border-brand-teal hover:bg-cyan-50/50 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-brand-teal-dark dark:hover:bg-slate-900">
              <div class="text-center">
                <i class="pi pi-cloud-upload mx-auto text-4xl text-slate-400 dark:text-slate-500" aria-hidden="true" />
                <div class="mt-4 flex text-sm leading-6 text-slate-600 dark:text-slate-400">
                  <label :for="`file-upload-${section.localKey}`" class="relative cursor-pointer rounded-md bg-transparent font-semibold text-brand-teal focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-teal focus-within:ring-offset-2 hover:text-brand-teal-dark">
                    <span>Upload a file</span>
                    <input :id="`file-upload-${section.localKey}`" name="file-upload" type="file" class="sr-only" @change="uploadAttachment($event, section)">
                  </label>
                  <p class="pl-1">or click to browse</p>
                </div>
                <p class="text-xs leading-5 text-slate-500">Images, PDF, CSV, or spreadsheets</p>
              </div>
            </div>
          </div>

          <p v-if="sectionErrors[section.localKey]" class="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-100">{{ sectionErrors[section.localKey] }}</p>

          <div class="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:justify-between">
            <Button label="Delete Section" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSection(section)" />
            <Button label="Save Section" icon="pi pi-check" :loading="savingSectionKey === section.localKey" @click="saveSection(section, index)" />
          </div>
        </div>
      </AdminSurface>
    </div>
  </section>

  <AdminSurface v-else padded>
    <EmptyState title="Module not found" description="The requested module could not be loaded." icon="pi pi-exclamation-circle">
      <Button label="Back to Modules" icon="pi pi-arrow-left" @click="navigateTo('/admin/modules')" />
    </EmptyState>
  </AdminSurface>
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import type { Attachment, ComponentItem, LearningModule, ModuleDetail, PublishStatus } from '~/types/learning'
import AdminFieldGroup from '~/components/admin/AdminFieldGroup.vue'
import AdminSectionHeader from '~/components/admin/AdminSectionHeader.vue'
import AdminSurface from '~/components/admin/AdminSurface.vue'
import InlineComponentTable from '~/components/admin/InlineComponentTable.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import { apiErrorMessage, apiFieldErrors, assignFieldErrors } from '~/utils/apiErrors'
import { attachmentTypeFromMimeType, normalizedUploadMimeType, uploadFile } from '~/utils/upload'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const statusOptions = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Published', value: 'PUBLISHED' },
]

type SectionForm = {
  localKey: string
  id?: string
  title: string
  slug: string
  summary: string
  keywords: string
  sortOrder: number
  components: ComponentItem[]
  attachments: Attachment[]
}

const route = useRoute()
const confirm = useConfirm()
const toast = useToast()
const { data: module, refresh } = await useFetch<LearningModule>(`/api/modules/${route.params.id}`)

const savingModule = ref(false)
const savingSectionKey = ref('')
const moduleError = ref('')
const moduleFieldErrors = reactive<Record<string, string>>({})
const sectionErrors = reactive<Record<string, string>>({})
const expandedSections = ref(new Set<string>())
const sectionForms = ref<SectionForm[]>([])
const linkForms = reactive<Record<string, { title: string, url: string }>>({})
const moduleForm = reactive({
  title: '',
  slug: '',
  description: '',
  keywords: '',
  status: 'DRAFT' as PublishStatus,
  sortOrder: 0,
})

watch(module, syncForms, { immediate: true })

function syncForms() {
  if (!module.value) return
  moduleForm.title = module.value.title
  moduleForm.slug = module.value.slug
  moduleForm.description = module.value.description || ''
  moduleForm.keywords = module.value.keywords || ''
  moduleForm.status = module.value.status
  moduleForm.sortOrder = module.value.sortOrder
  sectionForms.value = module.value.details.map(toSectionForm)
  for (const section of sectionForms.value) ensureLinkForm(section.localKey)
}

function toSectionForm(section: ModuleDetail): SectionForm {
  return {
    localKey: section.id || `new-${crypto.randomUUID()}`,
    id: section.id,
    title: section.title,
    slug: section.slug,
    summary: section.summary || '',
    keywords: section.keywords || '',
    sortOrder: section.sortOrder,
    components: section.components.map((component, index) => ({ ...component, sortOrder: index })),
    attachments: section.attachments,
  }
}

function ensureLinkForm(key: string) {
  linkForms[key] ||= { title: '', url: '' }
}

async function saveModule() {
  if (!module.value?.id) return
  savingModule.value = true
  moduleError.value = ''
  assignFieldErrors(moduleFieldErrors, {})
  try {
    module.value = await $fetch<LearningModule>(`/api/modules/${module.value.id}`, { method: 'PATCH', body: moduleForm })
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Module updated.', life: 2200 })
  } catch (error) {
    assignFieldErrors(moduleFieldErrors, apiFieldErrors(error))
    moduleError.value = apiErrorMessage(error, 'Failed to save module.')
  } finally {
    savingModule.value = false
  }
}

function addSection() {
  const localKey = `new-${crypto.randomUUID()}`
  sectionForms.value.push({
    localKey,
    title: '',
    slug: '',
    summary: '',
    keywords: '',
    sortOrder: sectionForms.value.length,
    components: [],
    attachments: [],
  })
  ensureLinkForm(localKey)
  expandedSections.value.add(localKey)
}

function toggleSection(key: string) {
  if (expandedSections.value.has(key)) expandedSections.value.delete(key)
  else expandedSections.value.add(key)
}

async function saveSection(section: SectionForm, index: number) {
  if (!module.value?.id) return
  savingSectionKey.value = section.localKey
  sectionErrors[section.localKey] = ''
  const body = {
    title: section.title,
    slug: section.slug,
    summary: section.summary,
    keywords: section.keywords,
    sortOrder: index,
    components: section.components
      .filter(row => row.name.trim() || row.quantity.trim() || row.unit.trim() || row.category || row.note)
      .map((row, rowIndex) => ({
        category: row.category || null,
        name: row.name,
        quantity: row.quantity,
        unit: row.unit,
        note: row.note || null,
        sortOrder: rowIndex,
      })),
  }
  try {
    if (section.id) await $fetch(`/api/details/${section.id}`, { method: 'PATCH', body })
    else await $fetch(`/api/modules/${module.value.id}/details`, { method: 'POST', body })
    await refresh()
    syncForms()
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Section saved.', life: 2200 })
  } catch (error) {
    sectionErrors[section.localKey] = apiErrorMessage(error, 'Failed to save section.')
  } finally {
    savingSectionKey.value = ''
  }
}

function confirmDeleteSection(section: SectionForm) {
  confirm.require({
    message: `Delete "${section.title || 'this section'}"?`,
    header: 'Delete section',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      if (section.id) await $fetch(`/api/details/${section.id}`, { method: 'DELETE' })
      else sectionForms.value = sectionForms.value.filter(item => item.localKey !== section.localKey)
      await refresh()
      syncForms()
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Section deleted.', life: 2200 })
    },
  })
}

async function addLink(section: SectionForm) {
  if (!section.id) {
    sectionErrors[section.localKey] = 'Save the section before adding attachments.'
    return
  }
  const form = linkForms[section.localKey]
  try {
    await $fetch(`/api/details/${section.id}/attachments`, {
      method: 'POST',
      body: {
        type: 'LINK',
        title: form.title,
        url: form.url,
        sortOrder: section.attachments.length,
      },
    })
    form.title = ''
    form.url = ''
    await refresh()
    syncForms()
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Link added.', life: 2200 })
  } catch (error) {
    sectionErrors[section.localKey] = apiErrorMessage(error, 'Failed to add link.')
  }
}

async function uploadAttachment(event: Event, section: SectionForm) {
  if (!section.id) {
    sectionErrors[section.localKey] = 'Save the section before uploading files.'
    return
  }
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const mimeType = normalizedUploadMimeType(file.name, file.type)
    const uploaded = await uploadFile(file, file.name)
    await $fetch(`/api/details/${section.id}/attachments`, {
      method: 'POST',
      body: {
        type: attachmentTypeFromMimeType(mimeType),
        title: file.name,
        url: uploaded.url,
        filePath: uploaded.filePath,
        mimeType: uploaded.mimeType,
        sizeBytes: uploaded.sizeBytes,
        sortOrder: section.attachments.length,
      },
    })
    input.value = ''
    await refresh()
    syncForms()
    toast.add({ severity: 'success', summary: 'Uploaded', detail: 'File attachment added.', life: 2200 })
  } catch (error) {
    sectionErrors[section.localKey] = apiErrorMessage(error, 'Failed to upload file.')
  }
}

function confirmDeleteAttachment(attachment: Attachment) {
  confirm.require({
    message: `Delete "${attachment.title}"?`,
    header: 'Delete attachment',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      if (!attachment.id) return
      await $fetch(`/api/attachments/${attachment.id}`, { method: 'DELETE' })
      await refresh()
      syncForms()
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Attachment deleted.', life: 2200 })
    },
  })
}
</script>
