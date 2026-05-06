<template>
  <section v-if="module" class="space-y-6">
    <AdminCrudHeader
      eyebrow="Module Editor"
      :title="module.title"
      description="Edit metadata, document sections, component rows, and attachment metadata from one focused workspace."
      :meta="`/${module.slug}`"
    >
      <template #actions>
        <Button label="Refresh" icon="pi pi-refresh" severity="secondary" outlined @click="refreshModule" />
        <Button label="Open Learner Page" icon="pi pi-external-link" severity="secondary" outlined @click="navigateTo(`/modules/${module.slug}`)" />
        <Button label="Edit Metadata" icon="pi pi-pencil" @click="openModuleDrawer" />
        <Button :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'" severity="secondary" outlined rounded :aria-label="isDark ? 'Use light mode' : 'Use dark mode'" @click="toggle" />
      </template>
    </AdminCrudHeader>

    <AdminMetricStrip :metrics="editorMetrics" />

    <div class="grid gap-6 xl:grid-cols-[360px_1fr]">
      <aside class="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <div class="admin-surface-enter rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 p-5 dark:border-slate-800">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-bold uppercase tracking-wide text-brand-teal dark:text-cyan-300">Metadata</p>
                <h2 class="mt-1 text-lg font-bold text-slate-950 dark:text-white">Module summary</h2>
              </div>
              <Tag :value="module.status" :severity="module.status === 'PUBLISHED' ? 'success' : 'warn'" rounded />
            </div>

            <div class="mt-5 space-y-3 text-sm">
              <div class="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Slug</p>
                <p class="mt-1 break-all font-semibold text-slate-900 dark:text-white">/{{ module.slug }}</p>
              </div>
              <div class="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Visibility</p>
                <p class="mt-1 font-semibold" :class="module.status === 'PUBLISHED' ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'">
                  {{ module.status === 'PUBLISHED' ? 'Visible to learners' : 'Hidden as draft' }}
                </p>
              </div>
              <div class="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <div class="mb-2 flex items-center justify-between text-xs">
                  <span class="font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Content health</span>
                  <span class="font-semibold text-slate-500 dark:text-slate-300">{{ moduleHealth(module).score }}%</span>
                </div>
                <ProgressBar :value="moduleHealth(module).score" :show-value="false" class="!h-2" />
                <p class="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">{{ moduleHealth(module).label }}</p>
              </div>
            </div>
          </div>

          <div class="grid gap-2 p-5">
            <Button label="Edit Metadata" icon="pi pi-pencil" @click="openModuleDrawer" />
            <Button
              :label="module.status === 'PUBLISHED' ? 'Move to Draft' : 'Publish Module'"
              :icon="module.status === 'PUBLISHED' ? 'pi pi-file-edit' : 'pi pi-check-circle'"
              severity="secondary"
              outlined
              @click="toggleModuleStatus"
            />
            <Button label="Back to Modules" icon="pi pi-arrow-left" severity="secondary" outlined @click="navigateTo('/admin/modules')" />
          </div>
        </div>
      </aside>

      <main class="space-y-4">
        <Tabs v-model:value="activeWorkspace" class="admin-surface-enter overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <TabList :pt="tabsPt.tabList">
            <Tab v-for="tab in workspaceTabs" :key="tab.value" :value="tab.value" :pt="tabsPt.tab">
              <span class="inline-flex items-center gap-2">
                <i :class="tab.icon" aria-hidden="true" />
                {{ tab.label }}
                <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">{{ tab.count }}</span>
              </span>
            </Tab>
          </TabList>

          <TabPanels :pt="tabsPt.panels">
            <TabPanel value="details" :pt="tabsPt.panel">
              <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <div>
                  <h2 class="font-bold text-slate-950 dark:text-white">Detail sections</h2>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Expand a row to preview learner content without leaving this editor.</p>
                </div>
                <Button label="New Detail" icon="pi pi-plus" @click="openDetailDrawer()" />
              </div>

              <DataTable
                v-model:expanded-rows="expandedRows"
                :value="module.details"
                :pt="detailTablePt"
                data-key="id"
                paginator
                :rows="8"
                table-style="min-width: 68rem"
              >
                <template #empty>
                  <div class="px-6 py-12">
                    <EmptyState title="No details yet" description="Create the first detail section to start building this module document." icon="pi pi-file-edit">
                      <Button label="New Detail" icon="pi pi-plus" @click="openDetailDrawer()" />
                    </EmptyState>
                  </div>
                </template>
                <Column expander style="width: 3rem" />
                <Column field="title" header="DETAIL" sortable>
                  <template #body="{ data }">
                    <div class="flex items-center gap-3 py-2">
                      <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy-light text-brand-navy dark:bg-slate-800 dark:text-cyan-200">
                        <i class="pi pi-file-edit" aria-hidden="true" />
                      </span>
                      <div class="min-w-0">
                        <p class="truncate font-bold text-slate-950 dark:text-white">{{ data.title }}</p>
                        <p class="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">/{{ data.slug }}</p>
                      </div>
                    </div>
                  </template>
                </Column>
                <Column header="COMPONENTS"><template #body="{ data }"><span class="font-bold text-slate-900 dark:text-white">{{ data.components.length }}</span></template></Column>
                <Column header="FILES"><template #body="{ data }"><span class="font-bold text-slate-900 dark:text-white">{{ data.attachments.length }}</span></template></Column>
                <Column field="sortOrder" header="ORDER" sortable><template #body="{ data }"><span class="text-sm font-semibold text-slate-600 dark:text-slate-300">#{{ data.sortOrder }}</span></template></Column>
                <Column header="REORDER">
                  <template #body="{ index }">
                    <div class="flex gap-1">
                      <Button icon="pi pi-arrow-up" size="small" text rounded :disabled="index === 0" aria-label="Move detail up" @click="moveDetail(index, -1)" />
                      <Button icon="pi pi-arrow-down" size="small" text rounded :disabled="index === module.details.length - 1" aria-label="Move detail down" @click="moveDetail(index, 1)" />
                    </div>
                  </template>
                </Column>
                <Column header="">
                  <template #body="{ data }">
                    <div class="flex justify-end gap-1">
                      <Button icon="pi pi-pencil" text rounded aria-label="Edit detail" @click="openDetailDrawer(data)" />
                      <Button icon="pi pi-paperclip" text rounded severity="secondary" aria-label="Manage attachments" @click="openAttachmentDrawer(data)" />
                      <Button icon="pi pi-trash" text rounded severity="danger" aria-label="Delete detail" @click="confirmDeleteDetail(data)" />
                    </div>
                  </template>
                </Column>
                <template #expansion="{ data }">
                  <div class="grid gap-4 bg-slate-50 p-5 dark:bg-slate-950">
                    <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                      <h3 class="font-bold text-slate-900 dark:text-white">{{ data.title }}</h3>
                      <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{{ data.summary || 'No summary yet.' }}</p>
                    </div>
                    <ComponentTable v-if="data.components.length" :components="data.components" />
                    <EmptyState v-else title="No component rows" description="Add rows when this section needs a structured parts table." icon="pi pi-table" />
                    <AttachmentList :attachments="data.attachments" />
                  </div>
                </template>
              </DataTable>
            </TabPanel>

            <TabPanel value="components" :pt="tabsPt.panel">
              <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <div>
                  <h2 class="font-bold text-slate-950 dark:text-white">Component rows</h2>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Rows are edited inside their parent detail to keep document structure intact.</p>
                </div>
                <Button label="Add via Detail" icon="pi pi-plus" :disabled="!module.details.length" @click="openDetailDrawer(module.details[0])" />
              </div>
              <DataTable :value="flattenedComponents" :pt="detailTablePt" data-key="_key" paginator :rows="10" table-style="min-width: 72rem">
                <template #empty>
                  <div class="px-6 py-12">
                    <EmptyState title="No component rows" description="Open a detail section and add structured component rows." icon="pi pi-table">
                      <Button label="New Detail" icon="pi pi-plus" @click="openDetailDrawer()" />
                    </EmptyState>
                  </div>
                </template>
                <Column field="detailTitle" header="DETAIL" sortable />
                <Column field="category" header="CATEGORY" sortable><template #body="{ data }">{{ data.category || '-' }}</template></Column>
                <Column field="name" header="COMPONENT" sortable><template #body="{ data }"><span class="font-bold text-slate-950 dark:text-white">{{ data.name }}</span></template></Column>
                <Column field="quantity" header="QTY" />
                <Column field="unit" header="UNIT" />
                <Column field="note" header="NOTE"><template #body="{ data }"><span class="text-slate-500 dark:text-slate-400">{{ data.note || '-' }}</span></template></Column>
                <Column header=""><template #body="{ data }"><Button icon="pi pi-pencil" label="Edit Detail" size="small" text @click="openDetailDrawer(data.detail)" /></template></Column>
              </DataTable>
            </TabPanel>

            <TabPanel value="attachments" :pt="tabsPt.panel">
              <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <div>
                  <h2 class="font-bold text-slate-950 dark:text-white">Attachments</h2>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage upload metadata and external resource links per detail section.</p>
                </div>
                <Button label="Add Attachment" icon="pi pi-paperclip" :disabled="!module.details.length" @click="openAttachmentDrawer(module.details[0])" />
              </div>
              <DataTable :value="flattenedAttachments" :pt="detailTablePt" data-key="_key" paginator :rows="10" table-style="min-width: 72rem">
                <template #empty>
                  <div class="px-6 py-12"><EmptyState title="No attachments yet" description="Attach images, spreadsheets, files, or reference links to a detail section." icon="pi pi-paperclip" /></div>
                </template>
                <Column field="title" header="ATTACHMENT" sortable>
                  <template #body="{ data }">
                    <div class="flex items-center gap-3">
                      <span class="flex h-10 w-10 items-center justify-center rounded-xl" :class="attachmentTypeClass(data.type)">
                        <i :class="attachmentTypeIcon(data.type)" aria-hidden="true" />
                      </span>
                      <div class="min-w-0">
                        <p class="truncate font-bold text-slate-950 dark:text-white">{{ data.title }}</p>
                        <p class="truncate text-xs text-slate-500 dark:text-slate-400">{{ data.detailTitle }}</p>
                      </div>
                    </div>
                  </template>
                </Column>
                <Column field="type" header="TYPE" sortable><template #body="{ data }"><Tag :value="data.type" rounded /></template></Column>
                <Column field="url" header="URL"><template #body="{ data }"><a :href="data.url" target="_blank" rel="noopener noreferrer" class="line-clamp-1 max-w-sm text-sm font-semibold text-brand-navy hover:underline dark:text-cyan-300">{{ data.url }}</a></template></Column>
                <Column header="">
                  <template #body="{ data }">
                    <div class="flex justify-end gap-1">
                      <Button icon="pi pi-external-link" text rounded aria-label="Open attachment" @click="openExternal(data.url)" />
                      <Button icon="pi pi-pencil" text rounded aria-label="Edit attachment" @click="openAttachmentDrawer(data.detail, data)" />
                      <Button icon="pi pi-trash" text rounded severity="danger" aria-label="Delete attachment" @click="confirmDeleteAttachment(data)" />
                    </div>
                  </template>
                </Column>
              </DataTable>
            </TabPanel>

            <TabPanel value="preview" :pt="tabsPt.panel">
              <div class="p-5">
                <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 class="font-bold text-slate-950 dark:text-white">Learner preview</h2>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">A compact content preview before opening the full learner page.</p>
                  </div>
                  <Button label="Open Full Page" icon="pi pi-external-link" outlined @click="navigateTo(`/modules/${module.slug}`)" />
                </div>
                <div class="space-y-4">
                  <article v-for="detail in module.details" :key="detail.id || detail.slug" class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                    <h3 class="font-bold text-slate-950 dark:text-white">{{ detail.title }}</h3>
                    <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{{ detail.summary || 'No summary yet.' }}</p>
                    <div class="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span class="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">{{ detail.components.length }} components</span>
                      <span class="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">{{ detail.attachments.length }} files</span>
                    </div>
                  </article>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </main>
    </div>

    <ModuleMetadataDrawer v-model:visible="moduleDrawerOpen" :module="module" @save="saveModule" />
    <DetailEditorDrawer v-model:visible="detailDrawerOpen" :detail="editingDetail" :error="formError" @save="saveDetail" />
    <AttachmentManagerDrawer
      v-model:visible="attachmentDrawerOpen"
      :detail="attachmentDetail"
      :attachment="editingAttachment"
      @save="saveAttachment"
      @upload="uploadAttachment"
      @open="openExternal"
      @delete="confirmDeleteAttachment"
    />
  </section>

  <section v-else class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <EmptyState title="Module not found" description="The requested module could not be loaded." icon="pi pi-exclamation-circle">
      <Button label="Back to Modules" icon="pi pi-arrow-left" @click="navigateTo('/admin/modules')" />
    </EmptyState>
  </section>
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import type { Attachment, AttachmentType, LearningModule, ModuleDetail } from '~/types/learning'
import AdminCrudHeader from '~/components/admin/AdminCrudHeader.vue'
import AdminMetricStrip from '~/components/admin/AdminMetricStrip.vue'
import AttachmentList from '~/components/learning/AttachmentList.vue'
import ComponentTable from '~/components/learning/ComponentTable.vue'
import ModuleMetadataDrawer from '~/components/admin/ModuleMetadataDrawer.vue'
import DetailEditorDrawer from '~/components/admin/DetailEditorDrawer.vue'
import AttachmentManagerDrawer from '~/components/admin/AttachmentManagerDrawer.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import {
  attachmentCount,
  attachmentTypeClass,
  attachmentTypeIcon,
  componentCount,
  moduleHealth,
} from '~/utils/adminModuleUi'

definePageMeta({ layout: 'admin', middleware: 'admin' })

type WorkspaceTab = 'details' | 'components' | 'attachments' | 'preview'

const { isDark, init, toggle } = useDarkMode()
const route = useRoute()
const toast = useToast()
const confirm = useConfirm()
const supabase = useSupabaseClient()
const config = useRuntimeConfig()

const { data: module, refresh } = await useFetch<LearningModule>(`/api/modules/${route.params.id}`)

const activeWorkspace = ref<WorkspaceTab>('details')
const moduleDrawerOpen = ref(false)
const detailDrawerOpen = ref(false)
const attachmentDrawerOpen = ref(false)
const editingDetail = ref<ModuleDetail | null>(null)
const attachmentDetail = ref<ModuleDetail | null>(null)
const editingAttachment = ref<Attachment | null>(null)
const formError = ref('')
const expandedRows = ref<Record<string, boolean>>({})

onMounted(init)

const editorMetrics = computed(() => {
  if (!module.value) return []
  return [
    { label: 'Status', value: module.value.status === 'PUBLISHED' ? 'Live' : 'Draft', caption: module.value.status === 'PUBLISHED' ? 'Visible to learners' : 'Hidden from learners', icon: module.value.status === 'PUBLISHED' ? 'pi pi-check-circle' : 'pi pi-file-edit', iconClass: module.value.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-200' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-200', delay: 40 },
    { label: 'Sections', value: module.value.details.length, caption: 'Document detail sections', icon: 'pi pi-list-check', iconClass: 'bg-brand-navy-light text-brand-navy dark:bg-slate-800 dark:text-cyan-200', delay: 80 },
    { label: 'Components', value: componentCount(module.value), caption: 'Structured parts rows', icon: 'pi pi-table', iconClass: 'bg-cyan-50 text-brand-teal dark:bg-cyan-950/50 dark:text-cyan-200', delay: 120 },
    { label: 'Attachments', value: attachmentCount(module.value), caption: 'Images, files, and links', icon: 'pi pi-paperclip', iconClass: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-200', delay: 160 },
    { label: 'Health', value: `${moduleHealth(module.value).score}%`, caption: moduleHealth(module.value).label, icon: 'pi pi-chart-line', iconClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200', delay: 200 },
  ]
})

const workspaceTabs = computed(() => [
  { value: 'details' as const, label: 'Details', icon: 'pi pi-file-edit', count: module.value?.details.length || 0 },
  { value: 'components' as const, label: 'Components', icon: 'pi pi-table', count: module.value ? componentCount(module.value) : 0 },
  { value: 'attachments' as const, label: 'Attachments', icon: 'pi pi-paperclip', count: module.value ? attachmentCount(module.value) : 0 },
  { value: 'preview' as const, label: 'Preview', icon: 'pi pi-eye', count: module.value?.details.length || 0 },
])

const flattenedComponents = computed(() => {
  if (!module.value) return []
  return module.value.details.flatMap((detail) => detail.components.map((component, index) => ({
    ...component,
    _key: `${detail.id || detail.slug}-${component.id || index}`,
    detail,
    detailTitle: detail.title,
  })))
})

const flattenedAttachments = computed(() => {
  if (!module.value) return []
  return module.value.details.flatMap((detail) => detail.attachments.map((attachment, index) => ({
    ...attachment,
    _key: `${detail.id || detail.slug}-${attachment.id || index}`,
    detail,
    detailTitle: detail.title,
  })))
})

const tabsPt = {
  tabList: { root: { class: '!border-b !border-slate-200 dark:!border-slate-800 !bg-white dark:!bg-slate-900 !px-3 !pt-3' } },
  tab: { root: { class: '!rounded-t-xl !px-4 !py-3 !font-bold' } },
  panels: { root: { class: '!bg-white dark:!bg-slate-900 !p-0' } },
  panel: { root: { class: '!p-0' } },
}

const detailTablePt = {
  tableContainer: { class: 'overflow-x-auto' },
  table: { class: 'w-full text-left text-sm text-slate-500 dark:text-slate-300' },
  thead: { class: 'bg-white text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400' },
  headerRow: { class: 'border-b border-slate-200 dark:border-slate-800' },
  headerCell: { class: 'border-0 bg-white px-5 py-4 font-bold tracking-wide dark:bg-slate-900' },
  bodyRow: { class: 'admin-row-enter group border-b border-slate-100 bg-white transition-colors hover:bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/70' },
  bodyCell: { class: 'border-0 px-5 py-4 align-middle' },
  paginator: { class: 'border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900' },
}

function openModuleDrawer() {
  moduleDrawerOpen.value = true
}

async function refreshModule() {
  await refresh()
  toast.add({ severity: 'success', summary: 'Refreshed', detail: 'Module editor updated.', life: 1800 })
}

async function saveModule(payload: Partial<LearningModule>) {
  if (!module.value?.id) return
  try {
    module.value = await $fetch<LearningModule>(`/api/modules/${module.value.id}`, { method: 'PATCH', body: payload })
    moduleDrawerOpen.value = false
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Module updated.', life: 2500 })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: error instanceof Error ? error.message : 'Failed to save module.', life: 3500 })
  }
}

async function toggleModuleStatus() {
  if (!module.value) return
  await saveModule({ ...module.value, status: module.value.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' })
}

function openDetailDrawer(detail?: ModuleDetail) {
  formError.value = ''
  editingDetail.value = detail || null
  detailDrawerOpen.value = true
}

async function saveDetail(body: {
  title: string
  slug: string
  summary: string
  keywords: string
  sortOrder: number
  components: Array<{ category: string | null, name: string, quantity: string, unit: string, note: string | null, sortOrder: number }>
}) {
  formError.value = ''
  if (!module.value?.id) return
  try {
    if (editingDetail.value?.id) await $fetch(`/api/details/${editingDetail.value.id}`, { method: 'PATCH', body })
    else await $fetch(`/api/modules/${module.value.id}/details`, { method: 'POST', body })
    detailDrawerOpen.value = false
    await refresh()
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Detail saved.', life: 2500 })
  } catch (error) {
    formError.value = error instanceof Error ? error.message : 'Failed to save detail.'
  }
}

async function moveDetail(index: number, direction: -1 | 1) {
  if (!module.value) return
  const target = index + direction
  const details = [...module.value.details]
  if (target < 0 || target >= details.length) return
  const current = details[index]
  const next = details[target]
  try {
    await Promise.all([
      updateDetailSortOrder(current, next.sortOrder),
      updateDetailSortOrder(next, current.sortOrder),
    ])
    await refresh()
    toast.add({ severity: 'success', summary: 'Reordered', detail: 'Detail order updated.', life: 2200 })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: error instanceof Error ? error.message : 'Failed to reorder details.', life: 3500 })
  }
}

async function updateDetailSortOrder(detail: ModuleDetail, sortOrder: number) {
  if (!detail.id) return
  await $fetch(`/api/details/${detail.id}`, {
    method: 'PATCH',
    body: {
      title: detail.title,
      slug: detail.slug,
      summary: detail.summary,
      keywords: detail.keywords,
      sortOrder,
      components: detail.components.map((component, index) => ({
        category: component.category,
        name: component.name,
        quantity: component.quantity,
        unit: component.unit,
        note: component.note,
        sortOrder: index,
      })),
    },
  })
}

function confirmDeleteDetail(detail: ModuleDetail) {
  confirm.require({
    message: `Delete "${detail.title}"? This also removes its component rows and attachment metadata.`,
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

function openAttachmentDrawer(detail?: ModuleDetail, attachment?: Attachment) {
  if (!detail) return
  attachmentDetail.value = detail
  editingAttachment.value = attachment || null
  attachmentDrawerOpen.value = true
}

async function saveAttachment(payload: { id?: string, type: AttachmentType, title: string, url: string, sortOrder?: number }) {
  if (!attachmentDetail.value?.id) return
  const body = { type: payload.type, title: payload.title, url: payload.url, sortOrder: payload.sortOrder ?? attachmentDetail.value.attachments.length }
  if (payload.id) await $fetch(`/api/attachments/${payload.id}`, { method: 'PATCH', body })
  else await $fetch(`/api/details/${attachmentDetail.value.id}/attachments`, { method: 'POST', body })
  editingAttachment.value = null
  await refresh()
  syncAttachmentDetail()
  toast.add({ severity: 'success', summary: 'Saved', detail: 'Attachment saved.', life: 2500 })
}

async function uploadAttachment(event: { files: File | File[] }, title: string) {
  const file = Array.isArray(event.files) ? event.files[0] : event.files
  if (!file || !attachmentDetail.value?.id) return
  const bucket = config.public.moduleAssetsBucket
  const path = `${attachmentDetail.value.id}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) {
    toast.add({ severity: 'error', summary: 'Upload failed', detail: error.message, life: 3500 })
    return
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  await $fetch(`/api/details/${attachmentDetail.value.id}/attachments`, {
    method: 'POST',
    body: {
      type: file.type.startsWith('image/') ? 'IMAGE' : 'FILE',
      title: title || file.name,
      url: data.publicUrl,
      storagePath: path,
      mimeType: file.type,
      sizeBytes: file.size,
      sortOrder: attachmentDetail.value.attachments.length,
    },
  })
  await refresh()
  syncAttachmentDetail()
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
      syncAttachmentDetail()
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Attachment deleted.', life: 2500 })
    },
  })
}

function syncAttachmentDetail() {
  if (module.value && attachmentDetail.value?.id) {
    attachmentDetail.value = module.value.details.find((detail) => detail.id === attachmentDetail.value?.id) || attachmentDetail.value
  }
}

function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>
