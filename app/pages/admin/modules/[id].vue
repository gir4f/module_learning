<template>
  <section v-if="module" class="space-y-6 pb-12">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3 sm:block">
          <div class="min-w-0">
            <h1 class="truncate text-2xl font-black text-brand-navy dark:text-cyan-200 sm:text-3xl">{{ module.title }}</h1>
            <p class="mt-1 break-all text-sm font-medium text-slate-500 dark:text-slate-400">/{{ module.slug }}</p>
          </div>
          <button type="button" class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white dark:focus-visible:ring-cyan-950 sm:hidden" aria-label="Kembali ke daftar modul" @click="navigateTo('/admin/modules')">
            <i class="pi pi-arrow-left" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <button type="button" class="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white dark:focus-visible:ring-cyan-950 sm:inline-flex" aria-label="Kembali ke daftar modul" @click="navigateTo('/admin/modules')">
          <i class="pi pi-arrow-left" aria-hidden="true" />
        </button>
        <Button label="Lihat Modul" icon="pi pi-eye" severity="secondary" outlined class="w-full sm:w-auto" @click="navigateTo(`/modules/${module.slug}`)" />
      </div>
    </div>

    <AdminSurface>
      <div class="group flex w-full items-center gap-4 border-b border-slate-200 p-5 dark:border-slate-800">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <i class="pi pi-cog font-bold" aria-hidden="true" />
        </span>
        <span class="min-w-0">
          <span class="block text-lg font-black text-slate-950 dark:text-white">Informasi Modul</span>
          <span class="block text-sm font-semibold text-slate-500 dark:text-slate-400">Informasi ini tampil di halaman modul.</span>
        </span>
      </div>
      <form v-auto-animate="{ duration: 170, easing: 'ease-in-out' }" class="grid gap-5 p-4 sm:p-5" @submit.prevent="saveModule">
        <div v-if="hasModuleChanges" class="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-100">
          <i class="pi pi-info-circle mt-0.5 shrink-0" aria-hidden="true" />
          <span>Perubahan informasi modul belum disimpan.</span>
        </div>
        <div class="grid gap-2">
          <AdminFieldGroup label="Judul" :error="moduleFieldErrors.title" required>
            <InputText v-model.trim="moduleForm.title" class="w-full" />
          </AdminFieldGroup>
          <p class="break-all text-sm font-semibold text-slate-500 dark:text-slate-400">Alamat halaman: /{{ module.slug }}</p>
        </div>
        <AdminFieldGroup label="Deskripsi" :error="moduleFieldErrors.description">
          <Textarea v-model="moduleForm.description" class="w-full" rows="3" auto-resize />
        </AdminFieldGroup>
        <div class="grid gap-4 md:grid-cols-[1fr_180px]">
          <AdminFieldGroup label="Kata Kunci" :error="moduleFieldErrors.keywords">
            <InputText v-model.trim="moduleForm.keywords" class="w-full" />
          </AdminFieldGroup>
          <AdminFieldGroup label="Status" :error="moduleFieldErrors.status">
            <Select v-model="moduleForm.status" :options="statusOptions" optionLabel="label" optionValue="value" class="w-full" />
          </AdminFieldGroup>
        </div>
        <p v-if="moduleError" class="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-100">{{ moduleError }}</p>
        <div class="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {{ moduleSaveStatus }}
          </p>
          <Button label="Simpan Modul" icon="pi pi-check" type="submit" :loading="savingModule" :disabled="!hasModuleChanges || savingModule" class="w-full sm:w-auto" />
        </div>
      </form>
    </AdminSurface>

    <div v-auto-animate="{ duration: 180, easing: 'ease-in-out' }" class="space-y-4">
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-xl font-black text-slate-950 dark:text-white">Bagian Modul</h2>
        <Button label="Tambah Bagian" icon="pi pi-plus" @click="addSection" />
      </div>

      <AdminSurface v-for="(section, index) in sectionForms" :key="section.localKey" v-auto-animate="{ duration: 190, easing: 'ease-in-out' }">
        <button type="button" class="group flex w-full items-start justify-between gap-4 border-b border-slate-200 p-5 text-left transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-cyan-100 dark:border-slate-800 dark:hover:bg-slate-800/50 dark:focus-visible:ring-cyan-950" :aria-expanded="expandedSections.has(section.localKey)" @click="toggleSection(section.localKey)">
          <div class="flex min-w-0 items-start gap-4">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-brand-teal group-hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-brand-teal-dark">
              <i class="pi font-bold" :class="expandedSections.has(section.localKey) ? 'pi-folder-open' : 'pi-folder'" aria-hidden="true" />
            </span>
            <span class="min-w-0 space-y-2">
              <span class="block truncate text-lg font-black text-slate-950 transition-colors group-hover:text-brand-teal dark:text-white dark:group-hover:text-cyan-400">{{ section.title || 'Bagian tanpa judul' }}</span>
              <span class="block truncate text-sm font-semibold text-slate-500 dark:text-slate-400">/{{ section.slug || 'alamat-bagian' }}</span>
              <span class="flex flex-wrap gap-2">
                <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <i class="pi pi-list-check text-[10px]" aria-hidden="true" />
                  {{ section.components.length }} komponen
                </span>
                <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <i class="pi pi-paperclip text-[10px]" aria-hidden="true" />
                  {{ section.attachments.length }} lampiran
                </span>
                <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black" :class="sectionStatusClass(section, index)">
                  <i :class="sectionStatusIcon(section, index)" class="text-[10px]" aria-hidden="true" />
                  {{ sectionStatusLabel(section, index) }}
                </span>
              </span>
            </span>
          </div>
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-transform duration-200 dark:border-slate-700 dark:bg-slate-900" :class="{ 'rotate-180': expandedSections.has(section.localKey) }">
            <i class="pi pi-chevron-down text-sm font-bold" aria-hidden="true" />
          </span>
        </button>

        <div v-if="expandedSections.has(section.localKey)" class="grid gap-5 p-4 sm:p-5">
          <div class="grid gap-2">
            <AdminFieldGroup label="Judul" required>
              <InputText v-model.trim="section.title" class="w-full" />
            </AdminFieldGroup>
            <p class="break-all text-sm font-semibold text-slate-500 dark:text-slate-400">Alamat bagian: /{{ section.slug || 'dibuat setelah disimpan' }}</p>
          </div>
          <AdminFieldGroup label="Ringkasan">
            <Textarea v-model="section.summary" class="w-full" rows="3" auto-resize />
          </AdminFieldGroup>
          <AdminFieldGroup label="Kata Kunci">
            <InputText v-model.trim="section.keywords" class="w-full" />
          </AdminFieldGroup>

          <div class="min-w-0 space-y-3">
            <AdminSectionHeader
              title="Daftar Komponen"
              description="Isi komponen yang dipakai di bagian ini."
              icon="pi pi-list-check"
              :meta="`${section.components.length} komponen`"
            />
            <InlineComponentTable v-model="section.components" />
          </div>

          <div class="min-w-0 space-y-3">
            <AdminSectionHeader
              title="Lampiran"
              description="Tambahkan file atau link pendukung."
              icon="pi pi-paperclip"
              :meta="`${section.attachments.length} lampiran`"
            />
            <div v-if="section.attachments.length" v-auto-animate="{ duration: 160, easing: 'ease-in-out' }" class="grid gap-2">
              <div v-for="attachment in section.attachments" :key="attachment.id || attachment.url" class="flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200 p-3 shadow-sm dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <a :href="attachment.url" target="_blank" rel="noopener noreferrer" class="flex min-w-0 items-center gap-3 rounded-lg font-bold text-brand-teal hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:focus-visible:ring-cyan-950" :aria-label="attachmentActionLabel(attachment)" @click="handleAttachmentOpen($event, attachment)">
                  <span v-if="isPdfAttachment(attachment)" class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-950/40">
                    <i class="pi pi-file-pdf" aria-hidden="true" />
                  </span>
                  <img
                    v-else-if="attachment.type === 'IMAGE'"
                    :src="previewUrlForAttachment(attachment)"
                    :alt="attachment.title"
                    class="h-12 w-16 shrink-0 rounded-lg bg-slate-100 object-cover dark:bg-slate-800"
                    loading="lazy"
                    @error="fallbackAttachmentPreview($event, attachment)"
                  >
                  <span v-else class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    <i :class="attachmentIconClass(attachment)" aria-hidden="true" />
                  </span>
                  <span class="flex min-w-0 flex-col gap-1.5">
                    <span class="block truncate">{{ attachment.title }}</span>
                    <span class="flex flex-wrap gap-1.5">
                      <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">{{ attachmentTypeLabel(attachment) }}</span>
                      <span v-if="attachment.sizeBytes" class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">{{ formatBytes(attachment.sizeBytes) }}</span>
                    </span>
                    <span class="block truncate text-xs font-medium text-slate-500 dark:text-slate-400">{{ attachment.type }} · {{ attachment.mimeType || attachment.url }}</span>
                  </span>
                </a>
                <Button label="Hapus" icon="pi pi-trash" size="small" severity="danger" outlined @click="confirmDeleteAttachment(attachment)" />
              </div>
            </div>
            <p v-else class="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              <i class="pi pi-inbox text-brand-teal dark:text-cyan-300" aria-hidden="true" />
              <span>Belum ada lampiran.</span>
            </p>

            <button
              v-if="openLinkFormKey !== section.localKey"
              type="button"
              class="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition-colors hover:border-brand-teal hover:text-brand-teal dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
              @click="openLinkForm(section.localKey)"
            >
              <i class="pi pi-link" aria-hidden="true" />
              <span>Tambah Link</span>
            </button>

            <div v-else class="grid gap-3 rounded-2xl border border-slate-200 p-3 dark:border-slate-800 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
              <AdminFieldGroup label="Judul Link">
                <InputText v-model.trim="linkForms[section.localKey]!.title" class="w-full" />
              </AdminFieldGroup>
              <AdminFieldGroup label="URL">
                <InputText v-model.trim="linkForms[section.localKey]!.url" class="w-full" />
              </AdminFieldGroup>
              <Button label="Simpan Link" icon="pi pi-check" severity="secondary" outlined @click="addLink(section, index)" />
              <Button label="Batal" severity="secondary" text @click="closeLinkForm(section.localKey)" />
            </div>

            <button
              type="button"
              class="relative flex w-full items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors"
              :class="uploadZoneClass(section)"
              :aria-busy="isUploadingSection(section)"
              :aria-label="uploadAriaLabel(section)"
              @dragenter.prevent.stop="handleDragEnter($event, section)"
              @dragover.prevent.stop="handleDragOver($event, section)"
              @dragleave.prevent.stop="handleDragLeave($event, section)"
              @drop.prevent.stop="handleDrop($event, section, index)"
              @click="openFileDialog(section)"
            >
              <span class="block">
                <i class="pi mx-auto text-4xl transition-colors" :class="uploadIconClass(section)" aria-hidden="true" />
                <span class="mt-4 flex flex-wrap justify-center text-sm leading-6 text-slate-600 dark:text-slate-400">
                  <span class="font-semibold text-brand-teal dark:text-brand-dark-teal">Pilih file</span>
                  <span class="pl-1">atau tarik ke sini</span>
                </span>
                <span class="block text-xs leading-5 text-slate-500 dark:text-slate-400">{{ uploadHint(section) }}</span>
                <span v-if="lastUploadStatus[section.localKey]" class="mt-2 block text-xs font-black" :class="lastUploadStatus[section.localKey]!.ok ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'">
                  {{ lastUploadStatus[section.localKey]!.message }}
                </span>
              </span>
            </button>
            <input :id="`file-upload-${section.localKey}`" name="file-upload" type="file" class="sr-only" multiple :disabled="isUploadingSection(section)" @change="uploadAttachment($event, section, index)">
          </div>

          <p v-if="sectionErrors[section.localKey]" class="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-100">{{ sectionErrors[section.localKey] }}</p>

          <div class="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
            <Button label="Hapus Bagian" icon="pi pi-trash" severity="danger" outlined class="w-full sm:w-auto" @click="confirmDeleteSection(section)" />
            <div class="flex flex-col gap-2 sm:items-end">
              <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {{ sectionSaveStatus(section) }}
              </p>
              <Button label="Simpan Bagian" icon="pi pi-check" :loading="savingSectionKey === section.localKey" :disabled="!hasSectionChanges(section, index) || savingSectionKey === section.localKey" class="w-full sm:w-auto" @click="saveSection(section, index)" />
            </div>
          </div>
        </div>
      </AdminSurface>
    </div>
  </section>

  <AdminSurface v-else padded>
    <EmptyState title="Modul tidak ditemukan" description="Modul yang dibuka tidak bisa dimuat." icon="pi pi-exclamation-circle">
      <Button label="Kembali ke Daftar Modul" icon="pi pi-arrow-left" @click="navigateTo('/admin/modules')" />
    </EmptyState>
  </AdminSurface>

  <PdfPreviewModal
    :url="pdfPreviewAttachment?.url || null"
    :title="pdfPreviewAttachment?.title"
    @close="pdfPreviewAttachment = null"
  />
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import { toast } from 'vue-sonner'
import type { Attachment, ComponentItem, LearningModule, ModuleDetail, PublishStatus } from '~/types/learning'
import AdminFieldGroup from '~/components/admin/AdminFieldGroup.vue'
import AdminSectionHeader from '~/components/admin/AdminSectionHeader.vue'
import AdminSurface from '~/components/admin/AdminSurface.vue'
import InlineComponentTable from '~/components/admin/InlineComponentTable.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import { apiErrorMessage, apiFieldErrors, assignFieldErrors } from '~/utils/apiErrors'
import { attachmentTypeFromMimeType, isAllowedUploadMimeType, isPdfAttachment, normalizedUploadMimeType, previewUrlForAttachment, uploadFile } from '~/utils/upload'

const PdfPreviewModal = defineAsyncComponent(() => import('~/components/shared/PdfPreviewModal.vue'))

definePageMeta({ layout: 'admin', middleware: 'admin' })

const statusOptions = [
  { label: 'Draf', value: 'DRAFT' },
  { label: 'Publikasi', value: 'PUBLISHED' },
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
const api = useApiClient()
const { data: module, refresh } = await useAsyncData<LearningModule>(`admin-module-${route.params.id}`, async () => {
  const { data } = await api.get<LearningModule>(`/api/modules/${route.params.id}`)
  return data
})

const savingModule = ref(false)
const savingSectionKey = ref('')
const moduleError = ref('')
const moduleFieldErrors = reactive<Record<string, string>>({})
const sectionErrors = reactive<Record<string, string>>({})
const expandedSections = ref(new Set<string>())
const sectionForms = ref<SectionForm[]>([])
const linkForms = reactive<Record<string, { title: string, url: string }>>({})
const openLinkFormKey = ref('')
const dragOverSectionKey = ref('')
const uploadingSectionKey = ref('')
const pdfPreviewAttachment = ref<Attachment | null>(null)
const uploadProgress = reactive<Record<string, { current: number, total: number }>>({})
const lastUploadStatus = reactive<Record<string, { ok: boolean, message: string }>>({})
const moduleSavedAt = ref<Date | null>(null)
const sectionSavedAt = reactive<Record<string, Date>>({})
const moduleForm = reactive({
  title: '',
  description: '',
  keywords: '',
  status: 'DRAFT' as PublishStatus,
  sortOrder: 0,
})

const hasModuleChanges = computed(() => {
  if (!module.value) return false
  return moduleForm.title !== module.value.title
    || moduleForm.description !== (module.value.description || '')
    || moduleForm.keywords !== (module.value.keywords || '')
    || moduleForm.status !== module.value.status
})
const moduleSaveStatus = computed(() => {
  if (savingModule.value) return 'Menyimpan perubahan...'
  if (hasModuleChanges.value) return 'Ada perubahan yang belum disimpan.'
  if (moduleSavedAt.value) return `Terakhir disimpan ${formatSaveTime(moduleSavedAt.value)}`
  return 'Tidak ada perubahan.'
})
const hasUnsavedChanges = computed(() => {
  if (hasModuleChanges.value) return true
  return sectionForms.value.some((section, index) => hasSectionChanges(section, index))
})

watch(module, syncForms, { immediate: true })

onMounted(() => {
  window.addEventListener('beforeunload', warnBeforeUnload)
  window.addEventListener('keydown', handleEditorKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', warnBeforeUnload)
  window.removeEventListener('keydown', handleEditorKeydown)
})

onBeforeRouteLeave(() => {
  if (!hasUnsavedChanges.value) return true
  return window.confirm('Ada perubahan yang belum disimpan. Tinggalkan halaman ini?')
})

function syncForms() {
  if (!module.value) return
  moduleForm.title = module.value.title
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

function openLinkForm(key: string) {
  ensureLinkForm(key)
  openLinkFormKey.value = key
}

function closeLinkForm(key: string) {
  const form = linkForms[key]
  if (form) {
    form.title = ''
    form.url = ''
  }
  if (openLinkFormKey.value === key) openLinkFormKey.value = ''
}

async function saveModule() {
  if (!module.value?.id) return
  savingModule.value = true
  moduleError.value = ''
  assignFieldErrors(moduleFieldErrors, {})
  try {
    const { data } = await api.patch<LearningModule>(`/api/modules/${module.value.id}`, moduleForm)
    module.value = data
    moduleSavedAt.value = new Date()
    toast.success('Tersimpan', { description: 'Modul diperbarui.' })
  } catch (error) {
    assignFieldErrors(moduleFieldErrors, apiFieldErrors(error))
    moduleError.value = apiErrorMessage(error, 'Gagal menyimpan modul.')
    toast.error('Gagal menyimpan', { description: moduleError.value })
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
  if (!hasSectionChanges(section, index)) return
  savingSectionKey.value = section.localKey
  sectionErrors[section.localKey] = ''
  const body = sectionBody(section, index)
  try {
    if (section.id) await api.patch(`/api/details/${section.id}`, body)
    else await api.post(`/api/modules/${module.value.id}/details`, body)
    sectionSavedAt[section.localKey] = new Date()
    await refresh()
    syncForms()
    toast.success('Tersimpan', { description: 'Bagian modul disimpan.' })
  } catch (error) {
    sectionErrors[section.localKey] = sectionErrorMessage(error, 'Gagal menyimpan bagian.')
    toast.error('Gagal menyimpan', { description: sectionErrors[section.localKey] })
  } finally {
    savingSectionKey.value = ''
  }
}

function sectionSaveStatus(section: SectionForm) {
  if (savingSectionKey.value === section.localKey) return 'Menyimpan bagian...'
  if (!section.id && hasNewSectionContent(section)) return 'Bagian baru akan dibuat saat disimpan.'
  if (!section.id) return 'Isi bagian dulu untuk menyimpan.'
  const sectionIndex = sectionForms.value.findIndex(item => item.localKey === section.localKey)
  if (hasSectionChanges(section, sectionIndex)) return 'Ada perubahan yang belum disimpan.'
  const savedAt = sectionSavedAt[section.localKey]
  if (savedAt) return `Terakhir disimpan ${formatSaveTime(savedAt)}`
  return 'Tidak ada perubahan.'
}

function sectionStatusLabel(section: SectionForm, index: number) {
  if (savingSectionKey.value === section.localKey) return 'Menyimpan'
  if (isUploadingSection(section)) return 'Upload'
  if (!section.id && hasNewSectionContent(section)) return 'Baru'
  if (hasSectionChanges(section, index)) return 'Belum disimpan'
  return 'Tersimpan'
}

function sectionStatusIcon(section: SectionForm, index: number) {
  const label = sectionStatusLabel(section, index)
  if (label === 'Menyimpan' || label === 'Upload') return 'pi pi-spinner pi-spin'
  if (label === 'Belum disimpan' || label === 'Baru') return 'pi pi-pencil'
  return 'pi pi-check'
}

function sectionStatusClass(section: SectionForm, index: number) {
  const label = sectionStatusLabel(section, index)
  if (label === 'Menyimpan' || label === 'Upload') return 'bg-cyan-50 text-brand-navy dark:bg-cyan-950/40 dark:text-cyan-100'
  if (label === 'Belum disimpan' || label === 'Baru') return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-100'
  return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100'
}

function formatSaveTime(value: Date) {
  return value.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function sectionBody(section: SectionForm, index: number) {
  const components = section.components
    .map(row => ({
      category: row.category?.trim() || '',
      name: row.name?.trim() || '',
      quantity: row.quantity?.trim() || '',
      unit: row.unit?.trim() || '',
      note: row.note?.trim() || '',
    }))
    .filter(row => row.name || row.quantity || row.unit || row.category || row.note)
    .filter(row => row.name)
    .map((row, rowIndex) => ({
      category: row.category || null,
      name: row.name,
      quantity: row.quantity || '1',
      unit: row.unit || 'pcs',
      note: row.note || null,
      sortOrder: rowIndex,
    }))

  return {
    title: section.title.trim() || 'Bagian tanpa judul',
    summary: section.summary.trim() || null,
    keywords: section.keywords.trim() || null,
    sortOrder: index,
    components,
  }
}

function hasSectionChanges(section: SectionForm, index: number) {
  if (!section.id) return hasNewSectionContent(section)

  const original = module.value?.details.find(detail => detail.id === section.id)
  if (!original) return true

  return JSON.stringify(sectionComparisonPayload(section, index)) !== JSON.stringify(detailComparisonPayload(original, index))
}

function hasNewSectionContent(section: SectionForm) {
  return Boolean(
    section.title.trim()
    || section.summary.trim()
    || section.keywords.trim()
    || section.components.some(row => row.name?.trim() || row.category?.trim() || row.quantity?.trim() || row.unit?.trim() || row.note?.trim()),
  )
}

function sectionComparisonPayload(section: SectionForm, index: number) {
  return sectionBody(section, index)
}

function detailComparisonPayload(section: ModuleDetail, index: number) {
  return sectionBody({
    localKey: section.id || section.slug,
    id: section.id,
    title: section.title,
    slug: section.slug,
    summary: section.summary || '',
    keywords: section.keywords || '',
    sortOrder: section.sortOrder,
    components: section.components.map((component, componentIndex) => ({ ...component, sortOrder: componentIndex })),
    attachments: section.attachments,
  }, index)
}

function sectionErrorMessage(error: unknown, fallback: string) {
  const fieldErrors = apiFieldErrors(error)
  const componentErrors = Object.entries(fieldErrors)
    .filter(([field]) => field.startsWith('components.'))
    .map(([, message]) => message)

  if (componentErrors.length) {
    return `Cek daftar komponen: ${Array.from(new Set(componentErrors)).join(', ')}.`
  }

  if (fieldErrors.title) return `Judul bagian: ${fieldErrors.title}.`
  if (Object.keys(fieldErrors).length) return Object.values(fieldErrors)[0] || fallback
  return apiErrorMessage(error, fallback)
}

function confirmDeleteSection(section: SectionForm) {
  confirm.require({
    message: `Hapus "${section.title || 'bagian ini'}"?`,
    header: 'Hapus bagian',
    icon: 'pi pi-exclamation-triangle',
    acceptProps: { label: 'Hapus', severity: 'danger', size: 'small' },
    rejectProps: { label: 'Batal', severity: 'secondary', outlined: true, size: 'small' },
    accept: async () => {
      if (!section.id) {
        removeLocalSection(section.localKey)
        toast.success('Terhapus', { description: 'Bagian draft dihapus.' })
        return
      }

      await api.delete(`/api/details/${section.id}`)
      await refresh()
      syncForms()
      toast.success('Terhapus', { description: 'Bagian modul dihapus.' })
    },
  })
}

function removeLocalSection(localKey: string) {
  sectionForms.value = sectionForms.value.filter(item => item.localKey !== localKey)
  expandedSections.value.delete(localKey)
  delete sectionErrors[localKey]
  delete sectionSavedAt[localKey]
  delete lastUploadStatus[localKey]
  delete uploadProgress[localKey]
  delete linkForms[localKey]
  if (openLinkFormKey.value === localKey) openLinkFormKey.value = ''
  if (dragOverSectionKey.value === localKey) dragOverSectionKey.value = ''
  if (uploadingSectionKey.value === localKey) uploadingSectionKey.value = ''
}

async function addLink(section: SectionForm, index: number) {
  const form = linkForms[section.localKey]!
  const targetSection = await ensureSectionSavedForAttachments(section, index, 'Gagal menyimpan bagian sebelum menambah link.')
  if (!targetSection?.id) return

  try {
    await api.post(`/api/details/${targetSection.id}/attachments`, {
      type: 'LINK',
      title: form.title,
      url: form.url,
      sortOrder: targetSection.attachments.length,
    })
    form.title = ''
    form.url = ''
    if (openLinkFormKey.value === section.localKey || openLinkFormKey.value === targetSection.localKey) openLinkFormKey.value = ''
    await refresh()
    syncForms()
    toast.success('Tersimpan', { description: 'Link ditambahkan.' })
  } catch (error) {
    sectionErrors[targetSection.localKey] = sectionErrorMessage(error, 'Gagal menambah link.')
  }
}

function isUploadingSection(section: SectionForm) {
  return uploadingSectionKey.value === section.localKey
}

function uploadAriaLabel(section: SectionForm) {
  if (isUploadingSection(section)) return `Sedang mengunggah lampiran untuk ${section.title || 'bagian ini'}`
  if (dragOverSectionKey.value === section.localKey) return `Lepaskan file untuk mengunggah ke ${section.title || 'bagian ini'}`
  return `Pilih atau tarik file lampiran untuk ${section.title || 'bagian ini'}`
}

function uploadZoneClass(section: SectionForm) {
  const isDragging = dragOverSectionKey.value === section.localKey
  const isUploading = isUploadingSection(section)
  return [
    isDragging
      ? 'border-brand-teal bg-cyan-50/80 dark:border-brand-dark-teal dark:bg-cyan-950/30'
      : 'border-slate-300 bg-slate-50 hover:border-brand-teal hover:bg-cyan-50/50 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-brand-teal-dark dark:hover:bg-slate-900',
    isUploading ? 'cursor-wait opacity-80' : 'cursor-pointer',
  ]
}

function uploadIconClass(section: SectionForm) {
  if (isUploadingSection(section)) return 'pi-spinner pi-spin text-brand-teal dark:text-brand-dark-teal'
  if (dragOverSectionKey.value === section.localKey) return 'pi-cloud-upload text-brand-teal dark:text-brand-dark-teal'
  return 'pi-cloud-upload text-slate-400 dark:text-slate-500'
}

function uploadHint(section: SectionForm) {
  const progress = uploadProgress[section.localKey]
  if (progress) return `Mengunggah ${progress.current} dari ${progress.total}...`
  return 'Gambar, PDF, CSV, atau spreadsheet'
}

function openFileDialog(section: SectionForm) {
  if (isUploadingSection(section)) return
  document.getElementById(`file-upload-${section.localKey}`)?.click()
}

function handleDragEnter(event: DragEvent, section: SectionForm) {
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
  dragOverSectionKey.value = section.localKey
}

function handleDragOver(event: DragEvent, section: SectionForm) {
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
  dragOverSectionKey.value = section.localKey
}

function handleDragLeave(event: DragEvent, section: SectionForm) {
  const currentTarget = event.currentTarget as HTMLElement | null
  const relatedTarget = event.relatedTarget as Node | null
  if (currentTarget && relatedTarget && currentTarget.contains(relatedTarget)) return
  if (dragOverSectionKey.value === section.localKey) dragOverSectionKey.value = ''
}

async function handleDrop(event: DragEvent, section: SectionForm, index: number) {
  dragOverSectionKey.value = ''
  const files = Array.from(event.dataTransfer?.files || [])
  if (!files.length) {
    sectionErrors[section.localKey] = 'File tidak terbaca. Coba pakai tombol pilih file.'
    return
  }
  await uploadFiles(files, section, index)
}

async function uploadAttachment(event: Event, section: SectionForm, index: number) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  try {
    await uploadFiles(files, section, index)
  } finally {
    input.value = ''
  }
}

async function uploadFiles(files: File[], section: SectionForm, index: number) {
  if (!files.length) return

  const unsupportedFiles = files.filter(file => !isAllowedUploadMimeType(file.name, file.type))
  if (unsupportedFiles.length) {
    sectionErrors[section.localKey] = `Jenis file belum didukung: ${unsupportedFiles.map(file => file.name).join(', ')}. Gunakan gambar, PDF, CSV, atau spreadsheet.`
    lastUploadStatus[section.localKey] = { ok: false, message: 'Upload ditolak. Jenis file belum didukung.' }
    toast.error('Upload gagal', { description: sectionErrors[section.localKey] })
    return
  }

  const targetSection = await ensureSectionSavedForAttachments(section, index)
  if (!targetSection?.id) return

  uploadingSectionKey.value = targetSection.localKey
  uploadProgress[targetSection.localKey] = { current: 0, total: files.length }
  sectionErrors[targetSection.localKey] = ''

  try {
    for (const [index, file] of files.entries()) {
      uploadProgress[targetSection.localKey] = { current: index + 1, total: files.length }
      const mimeType = normalizedUploadMimeType(file.name, file.type)
      const uploaded = await uploadFile(file, file.name)
      await api.post(`/api/details/${targetSection.id}/attachments`, {
        type: attachmentTypeFromMimeType(mimeType),
        title: file.name,
        url: uploaded.url,
        filePath: uploaded.filePath,
        mimeType: uploaded.mimeType,
        sizeBytes: uploaded.sizeBytes,
        sortOrder: targetSection.attachments.length + index,
      })
    }
    await refresh()
    syncForms()
    toast.success('Terunggah', {
      description: files.length === 1 ? 'Lampiran file ditambahkan.' : `${files.length} lampiran file ditambahkan.`,
    })
    lastUploadStatus[targetSection.localKey] = { ok: true, message: files.length === 1 ? '1 file berhasil diunggah.' : `${files.length} file berhasil diunggah.` }
  } catch (error) {
    sectionErrors[targetSection.localKey] = sectionErrorMessage(error, 'Gagal mengunggah file.')
    lastUploadStatus[targetSection.localKey] = { ok: false, message: 'Upload gagal. Coba ulangi.' }
    toast.error('Upload gagal', { description: sectionErrors[targetSection.localKey] })
  } finally {
    if (uploadingSectionKey.value === targetSection.localKey) uploadingSectionKey.value = ''
    delete uploadProgress[targetSection.localKey]
  }
}

async function ensureSectionSavedForAttachments(section: SectionForm, index: number, fallbackMessage = 'Gagal menyimpan bagian sebelum upload.') {
  if (section.id) return section
  if (!module.value?.id) return null

  section.title = section.title.trim() || 'Bagian tanpa judul'
  savingSectionKey.value = section.localKey
  sectionErrors[section.localKey] = ''

  try {
    const { data } = await api.post<ModuleDetail>(`/api/modules/${module.value.id}/details`, sectionBody(section, index))
    await refresh()
    syncForms()

    const savedSection = sectionForms.value.find(item => item.id === data.id)
    if (savedSection) {
      expandedSections.value.add(savedSection.localKey)
      return savedSection
    }

    return {
      ...section,
      id: data.id,
      slug: data.slug,
      attachments: data.attachments,
      components: data.components,
    }
  } catch (error) {
    sectionErrors[section.localKey] = sectionErrorMessage(error, fallbackMessage)
    return null
  } finally {
    savingSectionKey.value = ''
  }
}

function confirmDeleteAttachment(attachment: Attachment) {
  confirm.require({
    message: `Hapus "${attachment.title}"?`,
    header: 'Hapus lampiran',
    icon: 'pi pi-exclamation-triangle',
    acceptProps: { label: 'Hapus', severity: 'danger', size: 'small' },
    rejectProps: { label: 'Batal', severity: 'secondary', outlined: true, size: 'small' },
    accept: async () => {
      if (!attachment.id) return
      await api.delete(`/api/attachments/${attachment.id}`)
      await refresh()
      syncForms()
      toast.success('Terhapus', { description: 'Lampiran dihapus.' })
    },
  })
}

function fallbackAttachmentPreview(event: Event, attachment: Attachment) {
  const image = event.currentTarget as HTMLImageElement | null
  if (!image || image.src.endsWith(attachment.url)) return
  image.src = attachment.url
}

function warnBeforeUnload(event: BeforeUnloadEvent) {
  if (!hasUnsavedChanges.value) return
  event.preventDefault()
  event.returnValue = ''
}

function handleEditorKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  if (openLinkFormKey.value) {
    closeLinkForm(openLinkFormKey.value)
    return
  }
  dragOverSectionKey.value = ''
}

function attachmentIconClass(attachment: Attachment) {
  if (attachment.type === 'SPREADSHEET') return 'pi pi-table'
  if (attachment.type === 'LINK') return 'pi pi-external-link'
  return 'pi pi-file'
}

function attachmentTypeLabel(attachment: Attachment) {
  if (attachment.type === 'IMAGE') return 'Gambar preview'
  if (attachment.type === 'SPREADSHEET') return 'Spreadsheet'
  if (attachment.type === 'LINK') return 'Link'
  return 'File'
}

function attachmentActionLabel(attachment: Attachment) {
  if (isPdfAttachment(attachment)) return `Preview PDF ${attachment.title}`
  if (attachment.type === 'IMAGE') return `Buka preview gambar ${attachment.title}`
  return `Buka file lampiran ${attachment.title}`
}

function handleAttachmentOpen(event: MouseEvent, attachment: Attachment) {
  if (!isPdfAttachment(attachment)) return
  event.preventDefault()
  pdfPreviewAttachment.value = attachment
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>
