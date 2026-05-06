<template>
  <div v-if="attachments.length" class="space-y-3">
    <h3 class="text-sm font-bold uppercase text-slate-500">Lampiran</h3>
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="attachment in sortedAttachments"
        :key="attachment.id || attachment.url"
        class="group relative rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-brand-teal hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
      >
        <button
          v-if="attachment.type === 'IMAGE'"
          type="button"
          class="block w-full focus:outline-none focus:ring-4 focus:ring-cyan-100"
          :aria-label="`Perbesar ${attachment.title}`"
          @click="lightboxAttachment = attachment"
        >
          <img
            :src="attachment.url"
            :alt="attachment.title"
            class="aspect-[4/3] w-full rounded-md bg-slate-50 object-contain dark:bg-slate-800"
            loading="lazy"
          >
        </button>
        <a
          v-else
          :href="attachment.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex aspect-[4/3] items-center justify-center rounded-md bg-slate-50 text-brand-navy focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:bg-slate-800 dark:text-brand-dark-navy"
          :aria-label="`Buka ${attachment.title}`"
        >
          <i :class="iconFor(attachment.type)" class="text-3xl" aria-hidden="true" />
        </a>
        <span class="absolute right-5 top-5 rounded-full bg-slate-950/70 px-2 py-1 text-[10px] font-bold text-white">
          {{ attachment.type }}
        </span>
        <div class="mt-3 flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-slate-900 group-hover:text-brand-navy dark:text-slate-100">{{ attachment.title }}</p>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ metaFor(attachment) }}</p>
          </div>
          <a
            :href="attachment.url"
            :download="attachment.type === 'IMAGE' ? attachment.title : undefined"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-navy focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:hover:bg-slate-800"
            :aria-label="attachment.type === 'IMAGE' ? `Unduh ${attachment.title}` : `Buka ${attachment.title}`"
          >
            <i :class="attachment.type === 'IMAGE' ? 'pi pi-download' : 'pi pi-external-link'" aria-hidden="true" />
          </a>
        </div>
      </article>
    </div>

    <ImageLightbox :image="lightboxAttachment" @close="lightboxAttachment = null" />
  </div>
</template>

<script setup lang="ts">
import type { Attachment } from '~/types/learning'
import ImageLightbox from '~/components/shared/ImageLightbox.vue'

const props = defineProps<{
  attachments: Attachment[]
}>()

const lightboxAttachment = ref<Attachment | null>(null)
const sortedAttachments = computed(() => [...props.attachments].sort((a, b) => a.sortOrder - b.sortOrder))

function iconFor(type: string) {
  if (type === 'IMAGE') return 'pi pi-image'
  if (type === 'SPREADSHEET') return 'pi pi-table'
  if (type === 'LINK') return 'pi pi-external-link'
  return 'pi pi-file'
}

function metaFor(attachment: Attachment) {
  const parts: string[] = [attachment.type]
  if (attachment.mimeType) parts.push(attachment.mimeType)
  if (attachment.sizeBytes) parts.push(formatBytes(attachment.sizeBytes))
  return parts.join(' | ')
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>
