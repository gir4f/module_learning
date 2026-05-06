<template>
  <Drawer
    :visible="visible"
    position="right"
    class="!w-full lg:!w-[54rem]"
    :pt="drawerPt"
    @update:visible="$emit('update:visible', $event)"
  >
    <template #header>
      <div>
        <p class="text-xs font-bold uppercase tracking-wide text-brand-teal dark:text-cyan-300">Attachment manager</p>
        <h2 class="text-xl font-bold text-slate-950 dark:text-white">{{ detail?.title || 'Detail Attachments' }}</h2>
      </div>
    </template>

    <div v-if="detail" class="grid gap-5">
      <div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900">
        <p class="text-sm text-slate-600 dark:text-slate-300">Add images, spreadsheets, files, or reference links. Uploads go to Supabase Storage; metadata is saved to the database.</p>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <form class="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" @submit.prevent="submitLink">
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white">{{ editingAttachment ? 'Edit Attachment' : 'Link Attachment' }}</h3>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Use this for external docs, spreadsheets, or static URLs.</p>
          </div>
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Type</span>
            <Select v-model="form.type" :options="attachmentTypes" />
          </label>
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Title <span class="text-red-500">*</span></span>
            <InputText v-model="form.title" :invalid="Boolean(errors.title)" placeholder="Wiring image / Spreadsheet BOM" />
            <small v-if="errors.title" class="text-red-600 dark:text-red-300">{{ errors.title }}</small>
          </label>
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">URL <span class="text-red-500">*</span></span>
            <InputText v-model="form.url" :invalid="Boolean(errors.url)" placeholder="https://..." />
            <small v-if="errors.url" class="text-red-600 dark:text-red-300">{{ errors.url }}</small>
          </label>
          <div class="flex flex-wrap gap-2">
            <Button type="submit" :label="editingAttachment ? 'Update Attachment' : 'Save Link'" icon="pi pi-save" />
            <Button v-if="editingAttachment" type="button" label="Cancel Edit" severity="secondary" outlined @click="resetForm" />
          </div>
        </form>

        <div class="grid gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white">Upload Image/File</h3>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Supported: images, PDF, CSV, XLSX. Max 10 MB.</p>
          </div>
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Title</span>
            <InputText v-model="uploadTitle" placeholder="Defaults to file name" />
          </label>
          <FileUpload
            mode="advanced"
            name="moduleAsset"
            custom-upload
            :auto="false"
            :max-file-size="10485760"
            accept="image/*,.pdf,.csv,.xlsx"
            choose-label="Choose"
            upload-label="Upload"
            cancel-label="Clear"
            @uploader="$emit('upload', $event, uploadTitle)"
          />
        </div>
      </div>

      <DataTable :value="detail.attachments" data-key="id" :pt="tablePt" table-style="min-width: 760px">
        <template #empty>
          <div class="px-6 py-8">
            <EmptyState title="No attachments for this detail" description="Upload a file or save an external link to attach it here." icon="pi pi-paperclip" />
          </div>
        </template>
        <Column field="title" header="TITLE">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-lg" :class="attachmentTypeClass(data.type)">
                <i :class="attachmentTypeIcon(data.type)" aria-hidden="true" />
              </span>
              <span class="font-bold text-slate-950 dark:text-white">{{ data.title }}</span>
            </div>
          </template>
        </Column>
        <Column field="type" header="TYPE">
          <template #body="{ data }"><Tag :value="data.type" rounded /></template>
        </Column>
        <Column field="url" header="URL">
          <template #body="{ data }">
            <a :href="data.url" target="_blank" rel="noopener noreferrer" class="line-clamp-1 max-w-sm text-brand-navy hover:underline dark:text-cyan-300">{{ data.url }}</a>
          </template>
        </Column>
        <Column header="">
          <template #body="{ data }">
            <div class="flex justify-end gap-1">
              <Button icon="pi pi-external-link" text rounded aria-label="Open attachment" @click="$emit('open', data.url)" />
              <Button icon="pi pi-pencil" text rounded aria-label="Edit attachment" @click="edit(data)" />
              <Button icon="pi pi-trash" severity="danger" text rounded aria-label="Delete attachment" @click="$emit('delete', data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import type { Attachment, AttachmentType, ModuleDetail } from '~/types/learning'
import EmptyState from '~/components/shared/EmptyState.vue'
import { attachmentTypeClass, attachmentTypeIcon } from '~/utils/adminModuleUi'

const props = defineProps<{
  visible: boolean
  detail?: ModuleDetail | null
  attachment?: Attachment | null
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  save: [payload: { type: AttachmentType, title: string, url: string, sortOrder?: number, id?: string }]
  upload: [event: { files: File | File[] }, title: string]
  open: [url: string]
  delete: [attachment: Attachment]
}>()

const attachmentTypes: AttachmentType[] = ['IMAGE', 'SPREADSHEET', 'FILE', 'LINK']
const editingAttachment = ref<Attachment | null>(null)
const uploadTitle = ref('')
const errors = reactive<Record<string, string>>({})
const form = reactive({
  type: 'LINK' as AttachmentType,
  title: '',
  url: '',
})

watch(() => props.visible, (visible) => {
  if (!visible) {
    resetForm()
    uploadTitle.value = ''
  } else if (props.attachment) {
    edit(props.attachment)
  }
})

watch(() => props.attachment, (attachment) => {
  if (props.visible && attachment) edit(attachment)
})

function submitLink() {
  clearRecord(errors)
  if (!form.title.trim()) errors.title = 'Attachment title is required.'
  try {
    new URL(form.url)
  } catch {
    errors.url = 'Attachment URL must be valid.'
  }
  if (errors.title || errors.url) return
  emit('save', {
    id: editingAttachment.value?.id,
    type: form.type,
    title: form.title,
    url: form.url,
    sortOrder: editingAttachment.value?.sortOrder ?? props.detail?.attachments.length ?? 0,
  })
  resetForm()
}

function edit(attachment: Attachment) {
  editingAttachment.value = attachment
  form.type = attachment.type
  form.title = attachment.title
  form.url = attachment.url
  clearRecord(errors)
}

function resetForm() {
  editingAttachment.value = null
  form.type = 'LINK'
  form.title = ''
  form.url = ''
  clearRecord(errors)
}

function clearRecord(record: Record<string, string>) {
  Object.keys(record).forEach((key) => {
    delete record[key]
  })
}

const drawerPt = {
  root: { class: '!bg-white dark:!bg-slate-950' },
  header: { class: '!border-b !border-slate-200 dark:!border-slate-800 !px-6 !py-5' },
  content: { class: '!px-6 !py-5' },
}

const tablePt = {
  tableContainer: { class: 'overflow-x-auto' },
  table: { class: 'w-full text-left text-sm text-slate-500 dark:text-slate-300' },
  thead: { class: 'bg-white text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400' },
  headerRow: { class: 'border-b border-slate-200 dark:border-slate-800' },
  headerCell: { class: 'border-0 bg-white px-5 py-4 font-bold tracking-wide dark:bg-slate-900' },
  bodyRow: { class: 'border-b border-slate-100 bg-white transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800' },
  bodyCell: { class: 'border-0 px-5 py-4 align-middle' },
}
</script>
