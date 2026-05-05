<template>
  <article class="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
    <aside class="lg:sticky lg:top-24 lg:self-start">
      <SectionNav :details="module.details" />
    </aside>

    <div class="space-y-5">
      <nav class="text-sm text-slate-500 dark:text-slate-400 no-print" aria-label="Breadcrumb">
        <NuxtLink to="/" class="font-semibold hover:text-brand-navy dark:hover:text-white">Beranda</NuxtLink>
        <span class="mx-2">/</span>
        <button type="button" class="font-semibold text-brand-navy dark:text-brand-dark-navy" @click="scrollTop">{{ module.title }}</button>
      </nav>
      <DocumentHeader :module="module" />
      <section
        v-for="detail in module.details"
        :id="detail.slug"
        :key="detail.slug"
        class="scroll-mt-28 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="mb-5">
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">{{ detail.title }}</h2>
          <p v-if="detail.summary" class="mt-2 max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300">{{ detail.summary }}</p>
        </div>

        <ComponentTable v-if="detail.components.length" :components="detail.components" />
        <p v-else class="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
          Belum ada tabel komponen untuk detail ini.
        </p>

        <div class="mt-5">
          <AttachmentList :attachments="detail.attachments" />
        </div>
      </section>
    </div>

    <button
      v-if="showTopButton"
      type="button"
      class="fixed bottom-5 right-5 z-30 rounded-full bg-brand-teal p-3 text-white shadow-lg transition hover:bg-brand-teal-dark focus:outline-none focus:ring-4 focus:ring-cyan-100 no-print"
      aria-label="Kembali ke atas"
      @click="scrollTop"
    >
      <i class="pi pi-arrow-up" aria-hidden="true" />
    </button>
  </article>
</template>

<script setup lang="ts">
import type { LearningModule } from '~/types/learning'
import AttachmentList from '~/components/learning/AttachmentList.vue'
import ComponentTable from '~/components/learning/ComponentTable.vue'
import DocumentHeader from '~/components/learning/DocumentHeader.vue'
import SectionNav from '~/components/learning/SectionNav.vue'

defineProps<{
  module: LearningModule
}>()

const showTopButton = ref(false)

onMounted(() => {
  window.addEventListener('scroll', updateTopButton, { passive: true })
  updateTopButton()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateTopButton)
})

function updateTopButton() {
  showTopButton.value = window.scrollY > 300
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
