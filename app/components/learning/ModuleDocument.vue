<template>
  <article class="mx-auto grid max-w-7xl gap-6 px-4 py-6 text-slate-900 dark:text-slate-100 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
    <aside class="lg:sticky lg:top-24 lg:self-start">
      <SectionNav :details="module.details" />
    </aside>

    <div class="space-y-5">
      <nav class="text-sm text-slate-500 dark:text-slate-400 no-print" aria-label="Breadcrumb">
        <NuxtLink to="/" class="font-semibold hover:text-brand-navy dark:hover:text-white">Beranda</NuxtLink>
        <span class="mx-2">/</span>
        <button type="button" class="font-semibold text-brand-navy hover:text-brand-teal dark:text-cyan-200 dark:hover:text-cyan-100" @click="scrollTop">{{ module.title }}</button>
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
        <p v-else class="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
          Belum ada tabel komponen untuk detail ini.
        </p>

        <div class="mt-5">
          <AttachmentList :attachments="detail.attachments" />
        </div>
      </section>
    </div>
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

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
