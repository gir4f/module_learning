<template>
  <section>
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-sm font-bold uppercase text-brand-teal">Admin</p>
        <h1 class="text-2xl font-bold text-brand-navy">Modules</h1>
      </div>
      <Button label="New Module" icon="pi pi-plus" @click="openCreate" />
    </div>

    <DataTable
      :value="store.modules"
      :loading="store.pending"
      data-key="id"
      sort-field="sortOrder"
      :sort-order="1"
      striped-rows
      table-style="min-width: 58rem"
    >
      <Column field="title" header="Title" sortable />
      <Column field="status" header="Status" sortable>
        <template #body="{ data }">
          <Tag :value="data.status" :severity="data.status === 'PUBLISHED' ? 'success' : 'warning'" />
        </template>
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
            <Button icon="pi pi-list" label="Details" size="small" severity="secondary" @click="navigateTo(`/admin/modules/${data.id || data.slug}`)" />
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
import ModuleForm from '~/components/admin/ModuleForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const store = useModulesStore()
const confirm = useConfirm()
const toast = useToast()
const dialogOpen = ref(false)
const editingModule = ref<LearningModule | null>(null)

await store.fetchModules()

function openCreate() {
  editingModule.value = null
  dialogOpen.value = true
}

function openEdit(module: LearningModule) {
  editingModule.value = module
  dialogOpen.value = true
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
