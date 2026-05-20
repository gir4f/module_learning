<template>
  <div v-if="attachments.length" class="space-y-3">
    <h3 class="text-sm font-bold uppercase text-slate-500 dark:text-slate-400">Lampiran</h3>
    <div v-auto-animate="learnerAutoAnimateConfig" class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="attachment in sortedAttachments"
        :key="attachment.id || attachment.url"
        class="group relative min-w-0 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-brand-teal hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
      >
        <button
          v-if="attachment.type === 'IMAGE'"
          type="button"
          class="block w-full focus:outline-none focus:ring-4 focus:ring-cyan-100"
          :aria-label="`Perbesar ${attachment.title}`"
          @click="lightboxAttachment = attachment"
        >
          <img
            :src="previewUrlForAttachment(attachment)"
            :alt="attachment.title"
            class="aspect-4/3 w-full rounded-md bg-slate-50 object-contain dark:bg-slate-800"
            loading="lazy"
            @error="fallbackToOriginal($event, attachment)"
          />
        </button>
        <button
          v-else-if="isPdfAttachment(attachment)"
          type="button"
          class="flex aspect-4/3 w-full flex-col items-center justify-center gap-3 rounded-md bg-slate-50 px-4 text-center text-red-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:bg-slate-800 dark:focus-visible:ring-cyan-950"
          :aria-label="`Preview PDF ${attachment.title}`"
          @click="pdfPreviewAttachment = attachment"
        >
          <i class="pi pi-file-pdf text-3xl" aria-hidden="true" />
          <span class="max-w-full truncate text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">Preview PDF</span>
        </button>
        <a
          v-else
          :href="attachment.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex aspect-4/3 flex-col items-center justify-center gap-3 rounded-md bg-slate-50 px-4 text-center text-brand-navy focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:bg-slate-800 dark:text-cyan-200 dark:focus-visible:ring-cyan-950"
          :aria-label="`Buka ${attachment.title}`"
        >
          <i :class="iconFor(attachment.type)" class="text-3xl" aria-hidden="true" />
          <span class="max-w-full truncate text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">{{ openLabelFor(attachment.type) }}</span>
        </a>
        <span class="absolute right-5 top-5 rounded-full bg-slate-950/70 px-2 py-1 text-[10px] font-bold text-white">
          {{ typeLabelFor(attachment.type) }}
        </span>
        <div class="mt-3 flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-slate-900 group-hover:text-brand-navy dark:text-slate-100" :title="attachment.title">{{ attachment.title }}</p>
            <p class="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{{ metaFor(attachment) }}</p>
          </div>
          <a
            :href="attachment.url"
            :download="attachment.type === 'IMAGE' ? attachment.title : undefined"
            target="_blank"
            rel="noopener noreferrer"
            class="shrink-0 rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-navy focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-cyan-200 dark:focus-visible:ring-cyan-950"
            :aria-label="attachment.type === 'IMAGE' ? `Unduh ${attachment.title}` : `Buka ${attachment.title}`"
          >
            <i :class="attachment.type === 'IMAGE' ? 'pi pi-download' : 'pi pi-external-link'" aria-hidden="true" />
          </a>
        </div>
      </article>
    </div>

    <ImageLightbox :image="lightboxAttachment" @close="lightboxAttachment = null" />
    <PdfPreviewModal
      :url="pdfPreviewAttachment?.url || null"
      :title="pdfPreviewAttachment?.title"
      @close="pdfPreviewAttachment = null"
    />
  </div>
</template>

<script setup lang="ts">
import type { Attachment } from '~/types/learning'
import { learnerAutoAnimateConfig } from '~/utils/motion'
import { isPdfAttachment, previewUrlForAttachment } from '~/utils/upload'
const ImageLightbox = defineAsyncComponent(() => import('~/components/shared/ImageLightbox.vue'))
const PdfPreviewModal = defineAsyncComponent(() => import('~/components/shared/PdfPreviewModal.vue'))

const { attachments } = defineProps<{
  attachments: Attachment[]
}>()

const lightboxAttachment = ref<Attachment | null>(null)
const pdfPreviewAttachment = ref<Attachment | null>(null)
const sortedAttachments = computed(() => [...attachments].sort((a, b) => a.sortOrder - b.sortOrder))

function iconFor(type: string) {
  if (type === 'IMAGE') return 'pi pi-image'
  if (type === 'SPREADSHEET') return 'pi pi-table'
  if (type === 'LINK') return 'pi pi-external-link'
  return 'pi pi-file'
}

function typeLabelFor(type: string) {
  if (type === 'IMAGE') return 'Gambar'
  if (type === 'SPREADSHEET') return 'Spreadsheet'
  if (type === 'LINK') return 'Link'
  return 'File'
}

function openLabelFor(type: string) {
  if (type === 'LINK') return 'Buka link'
  if (type === 'SPREADSHEET') return 'Buka spreadsheet'
  return 'Buka file'
}

function metaFor(attachment: Attachment) {
  const parts: string[] = [typeLabelFor(attachment.type)]
  if (attachment.mimeType) parts.push(attachment.mimeType)
  if (attachment.sizeBytes) parts.push(formatBytes(attachment.sizeBytes))
  return parts.join(' | ')
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fallbackToOriginal(event: Event, attachment: Attachment) {
  const image = event.currentTarget as HTMLImageElement | null
  if (!image || image.src.endsWith(attachment.url)) return
  image.src = attachment.url
}
</script>
