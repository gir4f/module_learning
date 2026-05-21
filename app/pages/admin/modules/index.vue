<template>
  <section class="mx-auto w-full max-w-7xl space-y-6 px-3 pb-12 sm:px-0">
    <section class="relative mb-8 overflow-hidden rounded-3xl bg-slate-900 px-4 py-5 text-white shadow-lg sm:p-10 sm:shadow-2xl">
      <div class="absolute inset-0 bg-linear-to-br from-brand-navy via-brand-teal-dark to-brand-teal opacity-90" aria-hidden="true" />
      <div class="absolute inset-0 bg-[url('/grid.svg')] opacity-20" aria-hidden="true" />

      <div class="relative grid gap-4 sm:gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
        <div>
          <img
            :src="'/module-assets/Gitronikbgputih.jpg'"
            alt="PT. Gitronik Dimindo Indonesia"
            class="hidden sm:block h-12 w-auto rounded-lg bg-white shadow-md ring-4 ring-white/10 sm:h-16"
            loading="lazy"
          >
          <p class="mt-5 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-200 sm:mt-8 sm:text-sm sm:tracking-wider">PT. Gitronik Dimindo Indonesia</p>
          <h1 class="mt-2 text-[2rem] font-black leading-tight tracking-tight text-balance sm:mt-3 sm:text-4xl lg:text-5xl">
            Modul Ajar
          </h1>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-cyan-50 opacity-90 sm:mt-5 sm:text-lg sm:leading-relaxed">
            Kelola modul, varian produk, komponen, dan file untuk materi internal.
          </p>
          <div class="hidden lg:mt-6 lg:inline-flex">
            <Button label="Modul Baru" icon="pi pi-plus" class="rounded-xl px-4 font-bold" @click="navigateTo('/admin/modules/new')" />
          </div>
        </div>
        <dl class="grid grid-cols-3 overflow-hidden rounded-xl border border-white/15 bg-white/10 p-1 shadow-lg shadow-slate-950/10 sm:rounded-2xl sm:backdrop-blur-md">
          <div class="flex h-full min-w-0 flex-col justify-between rounded-xl px-3 py-2.5 text-center transition-colors hover:bg-white/10 sm:px-4 sm:py-3">
            <dt class="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/90 sm:text-[11px] sm:tracking-wide">Modul</dt>
            <dd class="mt-1 text-2xl font-black tracking-tight sm:text-4xl">{{ store.modules.length }}</dd>
          </div>
          <div class="flex h-full min-w-0 flex-col justify-between rounded-xl px-3 py-2.5 text-center transition-colors hover:bg-white/10 sm:px-4 sm:py-3">
            <dt class="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/90 sm:text-[11px] sm:tracking-wide">
              <span class="sm:hidden">Varian</span>
              <span class="hidden sm:inline">Varian Produk</span>
            </dt>
            <dd class="mt-1 text-2xl font-black tracking-tight sm:text-4xl">{{ sectionCount }}</dd>
          </div>
          <div class="flex h-full min-w-0 flex-col justify-between rounded-xl px-3 py-2.5 text-center transition-colors hover:bg-white/10 sm:px-4 sm:py-3">
            <dt class="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/90 sm:text-[11px] sm:tracking-wide">File</dt>
            <dd class="mt-1 text-2xl font-black tracking-tight sm:text-4xl">{{ attachmentCount }}</dd>
          </div>
        </dl>
        <div class="inline-flex lg:hidden">
          <Button label="Modul Baru" icon="pi pi-plus" class="rounded-xl px-4 font-bold" @click="navigateTo('/admin/modules/new')" />
        </div>
      </div>
    </section>

    <ModuleList
      :modules="store.modules"
      :pending="store.pendingList"
      :busy="store.pendingMutation"
      :selection-reset-key="bulkSelectionResetKey"
      @create="navigateTo('/admin/modules/new')"
      @edit="editModule"
      @delete="confirmDelete"
      @toggle-status="toggleStatus"
      @bulk-status="handleBulkStatus"
      @bulk-delete="confirmBulkDelete"
    />


  </section>
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import { toast } from 'vue-sonner'
import type { LearningModule } from '~/types/learning'
import ModuleList from '~/components/admin/ModuleList.vue'
import { useModulesStore, type BulkModuleMutationResult } from '~/stores/modules'
import { apiErrorMessage } from '~/utils/apiErrors'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const store = useModulesStore()
const confirm = useConfirm()
const bulkSelectionResetKey = ref(0)

const sectionCount = computed(() => store.modules.reduce((total, module) => total + module.details.length, 0))
const attachmentCount = computed(() => store.modules.reduce((total, module) => {
  return total + module.details.reduce((subtotal, detail) => subtotal + detail.attachments.length, 0)
}, 0))

await store.fetchModules()

onActivated(() => {
  void store.fetchModules()
})

function editModule(module: LearningModule) {
  navigateTo(`/admin/modules/${module.id}`)
}



async function toggleStatus(module: LearningModule) {
  if (!module.id) return
  try {
    await store.updateModule(module.id, {
      status: module.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
    })
    toast.success('Status diperbarui', { description: 'Status publikasi modul berubah.' })
  } catch (error) {
    toast.error('Error', { description: apiErrorMessage(error, 'Gagal memperbarui status.') })
  }
}

async function handleBulkStatus(payload: { ids: string[], status: 'DRAFT' | 'PUBLISHED' }) {
  try {
    const result = await store.bulkUpdateStatus(payload.ids, payload.status)
    resetBulkSelection()
    toast.success('Status diperbarui', {
      description: describeBulkStatusResult(result, payload.status),
    })
  } catch (error) {
    toast.error('Error', { description: apiErrorMessage(error, 'Gagal memperbarui status modul.') })
  }
}

function confirmDelete(module: LearningModule) {
  confirm.require({
    message: `Hapus "${module.title}"? Semua varian produk, komponen, dan lampirannya ikut terhapus.`,
    header: 'Hapus modul',
    icon: 'pi pi-exclamation-triangle',
    acceptProps: { label: 'Hapus', severity: 'danger', size: 'small' },
    rejectProps: { label: 'Batal', severity: 'secondary', outlined: true, size: 'small' },
    accept: async () => {
      if (!module.id) return
      try {
        await store.deleteModule(module.id)
        toast.success('Terhapus', { description: 'Modul dihapus.' })
      } catch (error) {
        toast.error('Error', { description: apiErrorMessage(error, 'Gagal menghapus modul.') })
      }
    },
  })
}

function confirmBulkDelete(ids: string[]) {
  confirm.require({
    message: `Hapus ${ids.length} modul? Semua varian produk, komponen, dan lampirannya ikut terhapus.`,
    header: 'Hapus beberapa modul',
    icon: 'pi pi-exclamation-triangle',
    acceptProps: { label: 'Hapus', severity: 'danger', size: 'small' },
    rejectProps: { label: 'Batal', severity: 'secondary', outlined: true, size: 'small' },
    accept: async () => {
      try {
        const result = await store.bulkDeleteModules(ids)
        resetBulkSelection()
        toast.success('Terhapus', {
          description: `${result.affectedCount} modul dihapus.`,
        })
      } catch (error) {
        toast.error('Error', { description: apiErrorMessage(error, 'Gagal menghapus modul.') })
      }
    },
  })
}

function resetBulkSelection() {
  bulkSelectionResetKey.value += 1
}

function describeBulkStatusResult(result: BulkModuleMutationResult, statusValue: 'DRAFT' | 'PUBLISHED') {
  const label = statusValue === 'PUBLISHED' ? 'Publikasi' : 'Draf'
  return `${result.affectedCount} modul diperbarui ke ${label}.`
}
</script>
