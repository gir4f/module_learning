<template>
  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div
        v-if="url"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-sm sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="title || 'Preview PDF'"
        @click.self="$emit('close')"
      >
        <section class="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-950">
          <header class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <div class="min-w-0">
              <h2 class="truncate text-sm font-black text-slate-950 dark:text-white">{{ title || 'Preview PDF' }}</h2>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400">Halaman {{ currentPage }} dari {{ pageCount || '-' }}</p>
            </div>
            <div class="flex items-center gap-1">
              <Button icon="pi pi-chevron-left" text rounded severity="secondary" aria-label="Halaman sebelumnya" :disabled="currentPage <= 1" @click="currentPage -= 1" />
              <Button icon="pi pi-chevron-right" text rounded severity="secondary" aria-label="Halaman berikutnya" :disabled="pageCount > 0 && currentPage >= pageCount" @click="currentPage += 1" />
              <a :href="url" target="_blank" rel="noopener noreferrer" class="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-brand-navy dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-cyan-200" aria-label="Buka PDF di tab baru">
                <i class="pi pi-external-link" aria-hidden="true" />
              </a>
              <a :href="url" :download="title || 'lampiran.pdf'" class="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-brand-navy dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-cyan-200" aria-label="Unduh PDF">
                <i class="pi pi-download" aria-hidden="true" />
              </a>
              <Button icon="pi pi-times" text rounded severity="secondary" aria-label="Tutup preview PDF" @click="$emit('close')" />
            </div>
          </header>
          <div class="overflow-auto bg-slate-100 p-4 dark:bg-slate-900">
            <ClientOnly>
              <VuePdfEmbed :source="url" :page="currentPage" class="mx-auto max-w-4xl" />
            </ClientOnly>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { url, title } = defineProps<{
  url: string | null
  title?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const VuePdfEmbed = defineAsyncComponent(() => import('vue-pdf-embed'))
const currentPage = ref(1)
const pageCount = ref(0)
let pdfDocument: { destroy: () => Promise<void> } | null = null

watch(() => url, loadPageCount, { immediate: true })

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  void pdfDocument?.destroy()
})

async function loadPageCount(nextUrl: string | null) {
  currentPage.value = 1
  pageCount.value = 0
  await pdfDocument?.destroy()
  pdfDocument = null
  if (!nextUrl || !import.meta.client) return

  try {
    const [pdfjs, worker] = await Promise.all([
      import('pdfjs-dist'),
      import('pdfjs-dist/build/pdf.worker.min.js?url'),
    ])
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default
    const pdf = await pdfjs.getDocument(nextUrl).promise
    pdfDocument = pdf
    pageCount.value = pdf.numPages
  } catch {
    pageCount.value = 0
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (!url) return
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
  }
  if (event.key === 'ArrowLeft' && currentPage.value > 1) currentPage.value -= 1
  if (event.key === 'ArrowRight' && (!pageCount.value || currentPage.value < pageCount.value)) currentPage.value += 1
}
</script>

<style scoped>
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 170ms ease-out;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}
</style>
