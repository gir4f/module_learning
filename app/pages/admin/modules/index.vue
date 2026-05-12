<template>
  <section class="space-y-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-black text-brand-navy dark:text-cyan-200 sm:text-3xl">Learning Modules</h1>
        <p class="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">Create, edit, publish, and remove learning documents.</p>
      </div>
      <Button label="New Module" icon="pi pi-plus" class="w-full sm:w-auto" @click="navigateTo('/admin/modules/new')" />
    </div>

    <ModuleList
      :modules="store.modules"
      :pending="store.pending"
      @create="navigateTo('/admin/modules/new')"
      @edit="editModule"
      @delete="confirmDelete"
      @toggle-status="toggleStatus"
    />
  </section>
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import type { LearningModule } from '~/types/learning'
import ModuleList from '~/components/admin/ModuleList.vue'
import { useModulesStore } from '~/stores/modules'
import { apiErrorMessage } from '~/utils/apiErrors'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const store = useModulesStore()
const confirm = useConfirm()
const toast = useToast()

await store.fetchModules()

function editModule(module: LearningModule) {
  navigateTo(`/admin/modules/${module.id}`)
}

async function toggleStatus(module: LearningModule) {
  if (!module.id) return
  try {
    await store.updateModule(module.id, {
      title: module.title,
      slug: module.slug,
      description: module.description,
      keywords: module.keywords,
      sortOrder: module.sortOrder,
      status: module.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
    })
    toast.add({ severity: 'success', summary: 'Status updated', detail: 'Module visibility changed.', life: 2200 })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: apiErrorMessage(error, 'Failed to update status.'), life: 3500 })
  }
}

function confirmDelete(module: LearningModule) {
  confirm.require({
    message: `Delete "${module.title}"? This removes its sections, component rows, and attachment metadata.`,
    header: 'Delete module',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      if (!module.id) return
      try {
        await store.deleteModule(module.id)
        toast.add({ severity: 'success', summary: 'Deleted', detail: 'Module deleted.', life: 2200 })
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: apiErrorMessage(error, 'Failed to delete module.'), life: 3500 })
      }
    },
  })
}
</script>
