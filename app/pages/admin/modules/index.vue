<template>
  <section class="mx-auto w-full max-w-7xl space-y-6 px-3 pb-12 sm:px-0">
    <section class="relative mb-8 overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-lg sm:p-10 sm:shadow-2xl">
      <div class="absolute inset-0 bg-linear-to-br from-brand-navy via-brand-teal-dark to-brand-teal opacity-90" aria-hidden="true" />
      <div class="absolute inset-0 bg-[url('/grid.svg')] opacity-20" aria-hidden="true" />
      
      <div class="relative grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
        <div>
          <img
            :src="'/module-assets/Gitronikbgputih.jpg'"
            alt="PT. Gitronik Dimindo Indonesia"
            class="h-16 w-auto rounded-lg bg-white shadow-md ring-4 ring-white/10"
            loading="lazy"
          >
          <p class="mt-8 text-sm font-black uppercase tracking-wider text-cyan-200">PT. Gitronik Dimindo Indonesia</p>
          <h1 class="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-balance">
            Modul Ajar
          </h1>
          <p class="mt-5 max-w-2xl text-lg leading-relaxed text-cyan-50 opacity-90">
            Kelola modul, varian produk, komponen, dan file untuk materi internal.
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
            <dt class="text-[11px] font-black uppercase tracking-wide text-cyan-100/90">Varian Produk</dt>
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
      :pending="store.pendingList"
      @open-command-palette="openCommandPalette"
      @create="navigateTo('/admin/modules/new')"
      @edit="editModule"
      @delete="confirmDelete"
      @toggle-status="toggleStatus"
    />

    <div
      v-if="commandOpen"
      class="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/25 px-4 pt-20 backdrop-blur-[2px] sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette pencarian modul admin"
      @click.self="closeCommandPalette"
    >
      <section class="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-800 dark:bg-slate-950">
        <label class="sr-only" for="admin-command-module-search">Cari modul admin</label>
        <div class="border-b border-slate-200 p-3 dark:border-slate-800">
          <div class="flex items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 px-3 focus-within:border-brand-teal focus-within:ring-4 focus-within:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-cyan-400 dark:focus-within:ring-cyan-950">
            <i class="pi pi-search text-slate-400" aria-hidden="true" />
            <input
              id="admin-command-module-search"
              ref="commandInput"
              v-model="commandQuery"
              type="text"
              role="searchbox"
              class="min-w-0 flex-1 bg-transparent py-3 text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
              placeholder="Cari modul untuk diedit..."
              autocomplete="off"
              @keydown.down.prevent="moveCommandSelection(1)"
              @keydown.up.prevent="moveCommandSelection(-1)"
              @keydown.enter.prevent="openSelectedModule"
              @keydown.escape.prevent="closeCommandPalette"
            >
            <button type="button" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:focus-visible:ring-cyan-950" aria-label="Tutup pencarian" @click="closeCommandPalette">
              <i class="pi pi-times" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div class="max-h-[55vh] overflow-y-auto p-2">
          <NuxtLink
            v-for="(module, index) in commandSuggestions"
            :key="module.id || module.slug"
            :to="adminModuleTarget(module)"
            class="flex items-center justify-between gap-4 rounded-xl px-3 py-3 text-sm transition hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:hover:bg-slate-800 dark:focus-visible:ring-cyan-950"
            :class="commandSelectedIndex === index ? 'bg-cyan-50 dark:bg-cyan-950/30' : ''"
            @mouseenter="commandSelectedIndex = index"
            @click="closeCommandPalette"
          >
            <span class="min-w-0">
              <span class="block truncate font-black text-brand-navy dark:text-cyan-200">
                <template v-for="(part, partIndex) in highlightParts(module.title)" :key="`${module.slug}-admin-title-${partIndex}`">
                  <mark v-if="part.hit" class="rounded bg-cyan-100 px-0.5 text-brand-navy dark:bg-cyan-900/70 dark:text-cyan-100">{{ part.text }}</mark>
                  <span v-else>{{ part.text }}</span>
                </template>
              </span>
              <span class="mt-1 block truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
                <template v-for="(part, partIndex) in highlightParts(module.slug)" :key="`${module.slug}-admin-slug-${partIndex}`">
                  <mark v-if="part.hit" class="rounded bg-cyan-100 px-0.5 text-brand-navy dark:bg-cyan-900/70 dark:text-cyan-100">{{ part.text }}</mark>
                  <span v-else>{{ part.text }}</span>
                </template>
              </span>
              <span v-if="module.description || module.keywords" class="mt-2 block truncate text-xs leading-5 text-slate-500 dark:text-slate-400">
                <template v-for="(part, partIndex) in highlightParts(module.description || module.keywords || '')" :key="`${module.slug}-admin-meta-${partIndex}`">
                  <mark v-if="part.hit" class="rounded bg-cyan-100 px-0.5 text-brand-navy dark:bg-cyan-900/70 dark:text-cyan-100">{{ part.text }}</mark>
                  <span v-else>{{ part.text }}</span>
                </template>
              </span>
            </span>
            <span class="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">{{ module.details.length }} varian produk</span>
          </NuxtLink>
          <p v-if="commandBusy" class="px-3 py-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">Mencari modul...</p>
          <p v-else-if="commandError" class="px-3 py-6 text-center text-sm font-semibold text-red-600 dark:text-red-300">{{ commandError }}</p>
          <p v-else-if="commandQuery && !commandSuggestions.length" class="px-3 py-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">Tidak ada modul ditemukan.</p>
          <div v-else class="px-3 py-6 text-center">
            <p class="text-sm font-black text-slate-700 dark:text-slate-200">Cari modul admin</p>
            <p class="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">Ketik judul, slug, komponen, atau kata kunci modul.</p>
          </div>
        </div>
      </section>
    </div>
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
const commandOpen = ref(false)
const commandInput = useTemplateRef<HTMLInputElement>('commandInput')
const {
  query: commandQuery,
  suggestions: commandSuggestions,
  error: commandError,
  selectedIndex: commandSelectedIndex,
  isBusy: commandBusy,
  moveSelection,
  highlightParts,
} = useModuleSearch({
  source: computed(() => store.modules),
})

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

function openCommandPalette() {
  commandOpen.value = true
  nextTick(() => commandInput.value?.focus())
}

function closeCommandPalette() {
  commandOpen.value = false
}

function moveCommandSelection(direction: 1 | -1) {
  moveSelection(direction)
}

async function openSelectedModule() {
  const module = commandSuggestions.value[commandSelectedIndex.value]
  if (!module) return
  closeCommandPalette()
  await navigateTo(adminModuleTarget(module))
}

function adminModuleTarget(module: LearningModule) {
  return `/admin/modules/${module.id || module.slug}`
}

async function toggleStatus(module: LearningModule) {
  if (!module.id) return
  try {
    await store.updateModule(module.id, {
      status: module.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
    })
    await store.fetchModules()
    toast.success('Status diperbarui', { description: 'Status publikasi modul berubah.' })
  } catch (error) {
    toast.error('Error', { description: apiErrorMessage(error, 'Gagal memperbarui status.') })
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
        await store.fetchModules()
        toast.success('Terhapus', { description: 'Modul dihapus.' })
      } catch (error) {
        toast.error('Error', { description: apiErrorMessage(error, 'Gagal menghapus modul.') })
      }
    },
  })
}
</script>
