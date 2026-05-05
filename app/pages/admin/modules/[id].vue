<template>
  <section v-if="module" class="space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-sm font-bold uppercase text-brand-teal">Module Editor</p>
        <h1 class="text-2xl font-bold text-brand-navy">{{ module.title }}</h1>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button label="Open Learner Page" icon="pi pi-external-link" outlined @click="navigateTo(`/modules/${module.slug}`)" />
        <Button label="New Detail" icon="pi pi-plus" @click="openDetailDialog()" />
      </div>
    </div>

    <Card>
      <template #title>Module Metadata</template>
      <template #content>
        <ModuleForm :module="module" @save="saveModule" @cancel="refresh" />
      </template>
    </Card>

    <Card>
      <template #title>Details</template>
      <template #content>
        <DataTable :value="module.details" data-key="id" striped-rows>
          <Column field="title" header="Detail" />
          <Column field="components" header="Components">
            <template #body="{ data }">{{ data.components.length }}</template>
          </Column>
          <Column field="attachments" header="Attachments">
            <template #body="{ data }">{{ data.attachments.length }}</template>
          </Column>
          <Column field="sortOrder" header="Order" />
          <Column header="Actions">
            <template #body="{ data }">
              <div class="flex flex-wrap gap-2">
                <Button icon="pi pi-pencil" label="Edit" size="small" @click="openDetailDialog(data)" />
                <Button icon="pi pi-paperclip" label="Attachments" size="small" severity="secondary" @click="openAttachmentDialog(data)" />
                <Button icon="pi pi-trash" label="Delete" size="small" severity="danger" outlined @click="confirmDeleteDetail(data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Card v-for="detail in module.details" :key="detail.id || detail.slug">
      <template #title>{{ detail.title }}</template>
      <template #subtitle>{{ detail.summary || 'No summary yet.' }}</template>
      <template #content>
        <div class="grid gap-5">
          <ComponentTable v-if="detail.components.length" :components="detail.components" />
          <p v-else class="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
            No component rows yet.
          </p>
          <AttachmentList :attachments="detail.attachments" />
        </div>
      </template>
    </Card>

    <Dialog v-model:visible="detailDialogOpen" modal :header="editingDetail?.id ? 'Edit Detail' : 'New Detail'" class="w-[min(980px,96vw)]">
      <form class="grid gap-4" @submit.prevent="saveDetail">
        <div class="grid gap-4 md:grid-cols-2">
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700">Title</span>
            <InputText v-model="detailForm.title" required />
          </label>
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700">Slug</span>
            <InputText v-model="detailForm.slug" placeholder="Auto-generated when empty" />
          </label>
        </div>

        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700">Summary</span>
          <Textarea v-model="detailForm.summary" rows="2" />
        </label>

        <div class="grid gap-4 md:grid-cols-2">
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700">Keywords</span>
            <InputText v-model="detailForm.keywords" />
          </label>
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700">Sort Order</span>
            <InputNumber v-model="detailForm.sortOrder" />
          </label>
        </div>

        <div class="rounded-lg border border-slate-200 p-4">
          <div class="mb-3 flex items-center justify-between gap-3">
            <h2 class="font-bold text-slate-900">Component Rows</h2>
            <Button type="button" label="Add Row" icon="pi pi-plus" size="small" @click="addComponentRow" />
          </div>

          <DataTable :value="detailForm.components" data-key="_key" striped-rows>
            <Column header="Category">
              <template #body="{ data }"><InputText v-model="data.category" class="w-full" /></template>
            </Column>
            <Column header="Name">
              <template #body="{ data }"><InputText v-model="data.name" class="w-full" /></template>
            </Column>
            <Column header="Quantity">
              <template #body="{ data }"><InputText v-model="data.quantity" class="w-full" /></template>
            </Column>
            <Column header="Unit">
              <template #body="{ data }"><InputText v-model="data.unit" class="w-full" /></template>
            </Column>
            <Column header="Note">
              <template #body="{ data }"><InputText v-model="data.note" class="w-full" /></template>
            </Column>
            <Column header="">
              <template #body="{ index }">
                <Button type="button" icon="pi pi-trash" severity="danger" text rounded @click="removeComponentRow(index)" />
              </template>
            </Column>
          </DataTable>
        </div>

        <p v-if="formError" class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{{ formError }}</p>

        <div class="flex justify-end gap-2">
          <Button type="button" label="Cancel" severity="secondary" outlined @click="detailDialogOpen = false" />
          <Button type="submit" label="Save Detail" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>

    <Dialog v-model:visible="attachmentDialogOpen" modal header="Attachments" class="w-[min(820px,96vw)]">
      <div v-if="attachmentDetail" class="grid gap-5">
        <div>
          <h2 class="font-bold text-slate-900">{{ attachmentDetail.title }}</h2>
          <p class="text-sm text-slate-500">Add image uploads, spreadsheet links, files, or reference links.</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <form class="grid gap-3 rounded-lg border border-slate-200 p-4" @submit.prevent="saveAttachmentLink">
            <h3 class="font-bold text-slate-900">Link Attachment</h3>
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-slate-700">Type</span>
              <Select v-model="attachmentForm.type" :options="attachmentTypes" />
            </label>
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-slate-700">Title</span>
              <InputText v-model="attachmentForm.title" required />
            </label>
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-slate-700">URL</span>
              <InputText v-model="attachmentForm.url" required />
            </label>
            <Button type="submit" label="Save Link" icon="pi pi-save" />
          </form>

          <div class="grid gap-3 rounded-lg border border-slate-200 p-4">
            <h3 class="font-bold text-slate-900">Upload Image/File</h3>
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-slate-700">Title</span>
              <InputText v-model="uploadTitle" placeholder="Defaults to file name" />
            </label>
            <FileUpload
              mode="advanced"
              name="moduleAsset"
              custom-upload
              :auto="false"
              :max-file-size="10485760"
              accept="image/*,.pdf,.csv,.xlsx"
              @uploader="uploadAttachment"
            />
          </div>
        </div>

        <DataTable :value="attachmentDetail.attachments" data-key="id" striped-rows>
          <Column field="title" header="Title" />
          <Column field="type" header="Type" />
          <Column field="url" header="URL">
            <template #body="{ data }">
              <a :href="data.url" target="_blank" rel="noopener noreferrer" class="text-brand-navy hover:underline">{{ data.url }}</a>
            </template>
          </Column>
          <Column header="">
            <template #body="{ data }">
              <Button icon="pi pi-trash" severity="danger" text rounded @click="confirmDeleteAttachment(data)" />
            </template>
          </Column>
        </DataTable>
      </div>
    </Dialog>
  </section>

  <section v-else class="rounded-lg bg-white p-6">
    Module not found.
  </section>
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import type { Attachment, AttachmentType, ComponentItem, LearningModule, ModuleDetail } from '~/types/learning'
import AttachmentList from '~/components/learning/AttachmentList.vue'
import ComponentTable from '~/components/learning/ComponentTable.vue'
import ModuleForm from '~/components/admin/ModuleForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

type EditableComponent = ComponentItem & { _key: string }

const route = useRoute()
const toast = useToast()
const confirm = useConfirm()
const supabase = useSupabaseClient()
const config = useRuntimeConfig()

const { data: module, refresh } = await useFetch<LearningModule>(`/api/modules/${route.params.id}`)

const detailDialogOpen = ref(false)
const attachmentDialogOpen = ref(false)
const editingDetail = ref<ModuleDetail | null>(null)
const attachmentDetail = ref<ModuleDetail | null>(null)
const formError = ref('')
const uploadTitle = ref('')
const attachmentTypes: AttachmentType[] = ['IMAGE', 'SPREADSHEET', 'FILE', 'LINK']

const detailForm = reactive({
  title: '',
  slug: '',
  summary: '',
  keywords: '',
  sortOrder: 0,
  components: [] as EditableComponent[],
})

const attachmentForm = reactive({
  type: 'LINK' as AttachmentType,
  title: '',
  url: '',
})

function resetDetailForm(detail?: ModuleDetail) {
  editingDetail.value = detail || null
  detailForm.title = detail?.title || ''
  detailForm.slug = detail?.slug || ''
  detailForm.summary = detail?.summary || ''
  detailForm.keywords = detail?.keywords || ''
  detailForm.sortOrder = detail?.sortOrder || 0
  detailForm.components = (detail?.components || []).map((component, index) => ({
    ...component,
    _key: component.id || `${component.name}-${index}`,
    category: component.category || '',
    note: component.note || '',
  }))
}

function openDetailDialog(detail?: ModuleDetail) {
  formError.value = ''
  resetDetailForm(detail)
  detailDialogOpen.value = true
}

function componentPayload() {
  return detailForm.components
    .map((component, index) => ({
      category: component.category || null,
      name: component.name.trim(),
      quantity: component.quantity.trim(),
      unit: component.unit.trim(),
      note: component.note || null,
      sortOrder: index,
    }))
    .filter((component) => component.name || component.quantity || component.unit || component.note)
}

function validateDetail() {
  if (!detailForm.title.trim()) return 'Detail title is required.'
  const incomplete = componentPayload().some((component) => !component.name || !component.quantity || !component.unit)
  if (incomplete) return 'Every filled component row must include name, quantity, and unit.'
  return ''
}

async function saveModule(payload: Partial<LearningModule>) {
  if (!module.value?.id) return
  try {
    module.value = await $fetch<LearningModule>(`/api/modules/${module.value.id}`, {
      method: 'PATCH',
      body: payload,
    })
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Module updated.', life: 2500 })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: error instanceof Error ? error.message : 'Failed to save module.', life: 3500 })
  }
}

async function saveDetail() {
  formError.value = validateDetail()
  if (formError.value || !module.value?.id) return

  const body = {
    title: detailForm.title,
    slug: detailForm.slug,
    summary: detailForm.summary,
    keywords: detailForm.keywords,
    sortOrder: detailForm.sortOrder,
    components: componentPayload(),
  }

  try {
    if (editingDetail.value?.id) {
      await $fetch(`/api/details/${editingDetail.value.id}`, { method: 'PATCH', body })
    } else {
      await $fetch(`/api/modules/${module.value.id}/details`, { method: 'POST', body })
    }
    detailDialogOpen.value = false
    await refresh()
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Detail saved.', life: 2500 })
  } catch (error) {
    formError.value = error instanceof Error ? error.message : 'Failed to save detail.'
  }
}

function addComponentRow() {
  detailForm.components.push({
    _key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    category: '',
    name: '',
    quantity: '',
    unit: '',
    note: '',
    sortOrder: detailForm.components.length,
  })
}

function removeComponentRow(index: number) {
  detailForm.components.splice(index, 1)
}

function confirmDeleteDetail(detail: ModuleDetail) {
  confirm.require({
    message: `Delete "${detail.title}"?`,
    header: 'Confirm delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      if (!detail.id) return
      await $fetch(`/api/details/${detail.id}`, { method: 'DELETE' })
      await refresh()
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Detail deleted.', life: 2500 })
    },
  })
}

function openAttachmentDialog(detail: ModuleDetail) {
  attachmentDetail.value = detail
  attachmentForm.type = 'LINK'
  attachmentForm.title = ''
  attachmentForm.url = ''
  uploadTitle.value = ''
  attachmentDialogOpen.value = true
}

async function createAttachment(detailId: string, payload: Partial<Attachment>) {
  await $fetch(`/api/details/${detailId}/attachments`, {
    method: 'POST',
    body: payload,
  })
  await refresh()
  if (module.value && attachmentDetail.value?.id) {
    attachmentDetail.value = module.value.details.find((detail) => detail.id === attachmentDetail.value?.id) || attachmentDetail.value
  }
}

async function saveAttachmentLink() {
  if (!attachmentDetail.value?.id) return
  await createAttachment(attachmentDetail.value.id, {
    type: attachmentForm.type,
    title: attachmentForm.title,
    url: attachmentForm.url,
    sortOrder: attachmentDetail.value.attachments.length,
  })
  attachmentForm.title = ''
  attachmentForm.url = ''
  toast.add({ severity: 'success', summary: 'Saved', detail: 'Attachment saved.', life: 2500 })
}

async function uploadAttachment(event: { files: File | File[] }) {
  const file = Array.isArray(event.files) ? event.files[0] : event.files
  if (!file || !attachmentDetail.value?.id) return

  const bucket = config.public.moduleAssetsBucket
  const path = `${attachmentDetail.value.id}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    toast.add({ severity: 'error', summary: 'Upload failed', detail: error.message, life: 3500 })
    return
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  await createAttachment(attachmentDetail.value.id, {
    type: file.type.startsWith('image/') ? 'IMAGE' : 'FILE',
    title: uploadTitle.value || file.name,
    url: data.publicUrl,
    storagePath: path,
    mimeType: file.type,
    sizeBytes: file.size,
    sortOrder: attachmentDetail.value.attachments.length,
  })
  uploadTitle.value = ''
  toast.add({ severity: 'success', summary: 'Uploaded', detail: 'Attachment uploaded.', life: 2500 })
}

function confirmDeleteAttachment(attachment: Attachment) {
  confirm.require({
    message: `Delete "${attachment.title}"?`,
    header: 'Confirm delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      if (!attachment.id) return
      await $fetch(`/api/attachments/${attachment.id}`, { method: 'DELETE' })
      await refresh()
      if (module.value && attachmentDetail.value?.id) {
        attachmentDetail.value = module.value.details.find((detail) => detail.id === attachmentDetail.value?.id) || attachmentDetail.value
      }
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Attachment deleted.', life: 2500 })
    },
  })
}
</script>
