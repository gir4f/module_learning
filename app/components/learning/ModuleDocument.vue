<template>
  <article class="mx-auto max-w-[88rem] overflow-x-clip px-4 pb-24 pt-6 text-slate-900 dark:text-slate-100 sm:px-6 sm:pb-6 lg:px-8">
    <PrintHeader :module="module" />
    <!-- Breadcrumbs above the grid so all 3 columns start at the same level -->
    <nav class="mb-5 text-sm text-slate-500 dark:text-slate-400 no-print" aria-label="Breadcrumb">
      <NuxtLink to="/" class="font-semibold hover:text-brand-navy dark:hover:text-white">Beranda</NuxtLink>
      <span class="mx-2">/</span>
      <button type="button" class="font-semibold text-brand-navy hover:text-brand-teal dark:text-cyan-200 dark:hover:text-cyan-100" @click="scrollTop">{{ module.title }}</button>
    </nav>

    <!-- 3-column grid: all columns start at the same vertical position -->
    <div class="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)_280px] 2xl:grid-cols-[250px_minmax(0,1fr)_300px]">
      <aside class="hidden lg:block lg:z-20">
        <div class="sticky top-24">
          <SectionNav :details="module.details" />
        </div>
      </aside>

      <div class="min-w-0 space-y-5">
        <DocumentHeader :module="module" />
        <details class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:hidden">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black text-slate-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:text-slate-100 dark:focus-visible:ring-cyan-950">
            <span>Daftar isi</span>
            <span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">{{ module.details.length }}</span>
          </summary>
          <ol class="mt-3 grid gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            <li v-for="detail in module.details" :key="detail.slug">
              <a
                :href="`#${detail.slug}`"
                class="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-brand-navy focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-cyan-200 dark:focus-visible:ring-cyan-950"
              >
                <span class="min-w-0 truncate">{{ detail.title }}</span>
                <span class="shrink-0 text-xs text-slate-500 dark:text-slate-400">{{ detail.components.length }}</span>
              </a>
            </li>
          </ol>
        </details>
        <section
          v-for="detail in module.details"
          :id="detail.slug"
          :key="detail.slug"
          class="scroll-mt-28 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:scroll-mt-32"
        >
          <div class="mb-5">
            <h2 class="text-2xl font-black leading-tight text-slate-950 dark:text-slate-100">{{ detail.title }}</h2>
            <p v-if="detail.summary" class="mt-3 max-w-prose text-base leading-8 text-slate-600 dark:text-slate-300">{{ detail.summary }}</p>
          </div>

          <ComponentTable v-if="detail.components.length" :components="detail.components" />
          <p v-else class="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
            Belum ada tabel komponen untuk varian produk ini.
          </p>

          <div class="mt-5">
            <AttachmentList :attachments="detail.attachments" />
          </div>
        </section>
      </div>

      <aside class="hidden xl:block self-start">
        <div class="sticky top-24 space-y-4 no-print">
          <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 class="text-sm font-bold text-slate-900 dark:text-slate-100">Ringkasan modul</h2>
            <dl class="mt-4 grid gap-3">
              <div v-for="item in summaryItems" :key="item.label" class="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
                <dt class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{{ item.label }}</dt>
                <dd class="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">{{ item.value }}</dd>
              </div>
            </dl>
            <div class="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-teal hover:text-brand-navy focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:text-slate-200 dark:hover:text-cyan-200"
                @click="shareModule"
              >
                <i class="pi pi-share-alt text-xs" aria-hidden="true" />
                {{ copied ? 'Disalin' : 'Bagikan' }}
              </button>
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-md bg-brand-teal px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-teal-dark focus:outline-none focus:ring-4 focus:ring-cyan-100"
                @click="printModule"
              >
                <i class="pi pi-print text-xs" aria-hidden="true" />
                Cetak
              </button>
            </div>
          </section>

          <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-sm font-bold text-slate-900 dark:text-slate-100">Lampiran cepat</h2>
              <span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">{{ attachmentCount }}</span>
            </div>
            <div v-if="quickAttachments.length" class="mt-3 space-y-2">
              <a
                v-for="attachment in quickAttachments"
                :key="attachment.id || attachment.url"
                :href="attachment.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm transition hover:border-brand-teal hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-brand-teal dark:bg-cyan-950/40 dark:text-cyan-200">
                  <i :class="attachmentIcon(attachment.type)" aria-hidden="true" />
                </span>
                <span class="min-w-0">
                  <span class="block truncate font-semibold text-slate-900 dark:text-slate-100">{{ attachment.title }}</span>
                  <span class="block text-xs text-slate-500 dark:text-slate-400">{{ attachmentTypeLabel(attachment.type) }}</span>
                </span>
              </a>
            </div>
            <p v-else class="mt-3 rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Belum ada lampiran.
            </p>
          </section>
        </div>
      </aside>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Attachment, LearningModule } from '~/types/learning'
import AttachmentList from '~/components/learning/AttachmentList.vue'
import ComponentTable from '~/components/learning/ComponentTable.vue'
import DocumentHeader from '~/components/learning/DocumentHeader.vue'
import PrintHeader from '~/components/learning/PrintHeader.vue'
import SectionNav from '~/components/learning/SectionNav.vue'

const { module } = defineProps<{
  module: LearningModule
}>()

const copied = ref(false)
const componentCount = computed(() => module.details.reduce((total, detail) => total + detail.components.length, 0))
const attachmentCount = computed(() => module.details.reduce((total, detail) => total + detail.attachments.length, 0))
const readingTime = computed(() => Math.max(1, Math.ceil((module.details.length * 90 + componentCount.value * 18) / 220)))
const updatedAt = computed(() => module.updatedAt ? formatStableDate(module.updatedAt) : '-')
const statusLabel = computed(() => module.status === 'PUBLISHED' ? 'Publikasi' : 'Draf')
const quickAttachments = computed(() => {
  return module.details
    .flatMap((detail) => detail.attachments)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 5)
})
const summaryItems = computed(() => [
  { label: 'Status', value: statusLabel.value },
  { label: 'Varian Produk', value: module.details.length },
  { label: 'Komponen', value: componentCount.value },
  { label: 'Lampiran', value: attachmentCount.value },
  { label: 'Waktu baca', value: `${readingTime.value} menit` },
  { label: 'Diperbarui', value: updatedAt.value },
])

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function printModule() {
  window.print()
}

async function shareModule() {
  const url = window.location.href
  if (navigator.share) {
    await navigator.share({ title: module.title, url })
    return
  }
  await navigator.clipboard.writeText(url)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1800)
}

function formatStableDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}

function attachmentIcon(type: Attachment['type']) {
  if (type === 'IMAGE') return 'pi pi-image'
  if (type === 'SPREADSHEET') return 'pi pi-table'
  if (type === 'LINK') return 'pi pi-external-link'
  return 'pi pi-file'
}

function attachmentTypeLabel(type: Attachment['type']) {
  if (type === 'IMAGE') return 'Gambar'
  if (type === 'SPREADSHEET') return 'Spreadsheet'
  if (type === 'LINK') return 'Link'
  return 'File'
}
</script>
