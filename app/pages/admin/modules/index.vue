<template>
  <section>
    <AdminPageHeader
      eyebrow="Admin"
      title="Modules"
      description="Manage published and draft learning modules, then open each module to edit its sections, component rows, and attachments."
    >
      <template #actions>
        <Button label="New Module" icon="pi pi-plus" @click="openCreate" />
      </template>
    </AdminPageHeader>

    <ModuleStats class="mb-4" :items="stats" />

    <div class="mb-4 rounded-lg border border-slate-200 bg-white p-4">
      <div class="grid gap-3 lg:grid-cols-[1fr_220px]">
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700">Search</span>
          <InputText v-model="search" placeholder="Search title, slug, description, or keywords" />
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700">Status</span>
          <Select v-model="statusFilter" :options="statusOptions" option-label="label" option-value="value" />
        </label>
      </div>
    </div>

    <DataTable
      :value="filteredModules"
      :loading="store.pending"
      data-key="id"
      sort-field="sortOrder"
      :sort-order="1"
      striped-rows
      paginator
      :rows="10"
      :rows-per-page-options="[10, 20, 50]"
      table-style="min-width: 58rem"
      class="rounded-lg border border-slate-200 bg-white"
      @row-dblclick="openEditor($event.data)"
    >
      <template #empty>
        <EmptyState
          title="No modules match the current filters"
          description="Clear the search or status filter to see the full module library."
          icon="pi pi-search"
        />
      </template>
      <Column field="title" header="Title" sortable />
      <Column field="status" header="Status" sortable>
        <template #body="{ data }">
          <ModuleStatusTag :status="data.status" />
        </template>
      </Column>
      <Column header="Sections">
        <template #body="{ data }">{{ data.details.length }}</template>
      </Column>
      <Column field="sortOrder" header="Order" sortable />
      <Column field="updatedAt" header="Updated" sortable>
        <template #body="{ data }">
          {{ data.updatedAt ? new Date(data.updatedAt).toLocaleString() : '-' }}
        </template>
      </Column>
      <Column header="Actions">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button icon="pi pi-pencil" label="Edit" size="small" @click="openEdit(data)" />
            <Button icon="pi pi-list" label="Details" size="small" severity="secondary" @click="openEditor(data)" />
            <Button icon="pi pi-trash" label="Delete" size="small" severity="danger" outlined @click="confirmDelete(data)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogOpen" modal :header="editingModule ? 'Edit Module' : 'New Module'" class="w-[min(680px,94vw)]">
      <ModuleForm :module="editingModule" @save="saveModule" @cancel="dialogOpen = false" />
    </Dialog>
  </section>
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import type { LearningModule } from '~/types/learning'
import { useModulesStore } from '~/stores/modules'
import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
import ModuleForm from '~/components/admin/ModuleForm.vue'
import ModuleStats from '~/components/admin/ModuleStats.vue'
import ModuleStatusTag from '~/components/admin/ModuleStatusTag.vue'
import EmptyState from '~/components/shared/EmptyState.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const store = useModulesStore()
const confirm = useConfirm()
const toast = useToast()
const dialogOpen = ref(false)
const editingModule = ref<LearningModule | null>(null)
const search = ref('')
const statusFilter = ref('ALL')
const statusOptions = [
  { label: 'All statuses', value: 'ALL' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Draft', value: 'DRAFT' },
]

await store.fetchModules()

const filteredModules = computed(() => {
  const query = search.value.trim().toLowerCase()
  return store.modules.filter((module) => {
    const statusMatches = statusFilter.value === 'ALL' || module.status === statusFilter.value
    const haystack = [
      module.title,
      module.slug,
      module.description,
      module.keywords,
      ...module.details.map((detail) => detail.title),
    ].join(' ').toLowerCase()
    return statusMatches && (!query || haystack.includes(query))
  })
})

const stats = computed(() => [
  { label: 'Total modules', value: store.modules.length },
  { label: 'Published', value: store.modules.filter((module) => module.status === 'PUBLISHED').length },
  { label: 'Drafts', value: store.modules.filter((module) => module.status === 'DRAFT').length },
])

function openCreate() {
  editingModule.value = null
  dialogOpen.value = true
}

function openEdit(module: LearningModule) {
  editingModule.value = module
  dialogOpen.value = true
}

function openEditor(module: LearningModule) {
  navigateTo(`/admin/modules/${module.id || module.slug}`)
}

async function saveModule(payload: Partial<LearningModule>) {
  try {
    if (editingModule.value?.id) {
      await store.updateModule(editingModule.value.id, payload)
    } else {
      await store.createModule(payload)
    }
    dialogOpen.value = false
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Module saved.', life: 2500 })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: error instanceof Error ? error.message : 'Failed to save module.', life: 3500 })
  }
}

function confirmDelete(module: LearningModule) {
  confirm.require({
    message: `Delete "${module.title}"?`,
    header: 'Confirm delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      if (!module.id) return
      await store.deleteModule(module.id)
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Module deleted.', life: 2500 })
    },
  })
}
</script>
