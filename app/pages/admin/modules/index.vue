<template>
  <section class="mx-auto w-full max-w-7xl space-y-6 px-3 pb-12 sm:px-0">
    <section class="relative mb-8 overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-lg sm:p-10 sm:shadow-2xl">
      <div class="absolute inset-0 bg-linear-to-br from-brand-navy via-brand-teal-dark to-brand-teal opacity-90" aria-hidden="true" />
      <div class="absolute inset-0 bg-[url('/grid.svg')] opacity-20" aria-hidden="true" />
      
      <div class="relative grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
        <div>
          <h1 class="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-balance">
            Modul Ajar
          </h1>
          <p class="mt-4 max-w-2xl text-lg leading-relaxed text-cyan-50 opacity-90">
            Kelola modul, bagian, komponen, dan file untuk materi internal.
          </p>
          <div class="mt-6">
            <Button label="Modul Baru" icon="pi pi-plus" class="w-full sm:w-auto font-bold rounded-xl" @click="navigateTo('/admin/modules/new')" />
          </div>
        </div>
        <dl class="grid grid-cols-1 overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-1 shadow-lg shadow-slate-950/10 min-[360px]:grid-cols-3 sm:backdrop-blur-md">
          <div class="min-w-0 rounded-xl px-4 py-3 transition-colors hover:bg-white/10 min-[360px]:text-center">
            <dt class="text-[11px] font-black uppercase tracking-wide text-cyan-100/90">Modul</dt>
            <dd class="mt-1 text-3xl font-black tracking-tight sm:text-4xl">{{ store.modules.length }}</dd>
          </div>
          <div class="min-w-0 rounded-xl px-4 py-3 transition-colors hover:bg-white/10 min-[360px]:text-center">
            <dt class="text-[11px] font-black uppercase tracking-wide text-cyan-100/90">Bagian</dt>
            <dd class="mt-1 text-3xl font-black tracking-tight sm:text-4xl">{{ sectionCount }}</dd>
          </div>
          <div class="min-w-0 rounded-xl px-4 py-3 transition-colors hover:bg-white/10 min-[360px]:text-center">
            <dt class="text-[11px] font-black uppercase tracking-wide text-cyan-100/90">File</dt>
            <dd class="mt-1 text-3xl font-black tracking-tight sm:text-4xl">{{ attachmentCount }}</dd>
          </div>
        </dl>
      </div>
    </section>

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
import { toast } from 'vue-sonner'
import type { LearningModule } from '~/types/learning'
import ModuleList from '~/components/admin/ModuleList.vue'
import { useModulesStore } from '~/stores/modules'
import { apiErrorMessage } from '~/utils/apiErrors'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const store = useModulesStore()
const confirm = useConfirm()

const sectionCount = computed(() => store.modules.reduce((total, module) => total + module.details.length, 0))
const attachmentCount = computed(() => store.modules.reduce((total, module) => {
  return total + module.details.reduce((subtotal, detail) => subtotal + detail.attachments.length, 0)
}, 0))

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
    toast.success('Status diperbarui', { description: 'Status publikasi modul berubah.' })
  } catch (error) {
    toast.error('Error', { description: apiErrorMessage(error, 'Gagal memperbarui status.') })
  }
}

function confirmDelete(module: LearningModule) {
  confirm.require({
    message: `Hapus "${module.title}"? Semua bagian, komponen, dan lampirannya ikut terhapus.`,
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
</script>
