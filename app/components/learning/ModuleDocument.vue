<template>
  <article class="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
    <aside class="hidden lg:block">
      <nav class="sticky top-24 rounded-lg border border-slate-200 bg-white p-4">
        <p class="mb-3 text-xs font-bold uppercase text-slate-500">Sections</p>
        <ol class="space-y-2 text-sm">
          <li v-for="detail in module.details" :key="detail.slug">
            <a class="text-slate-600 hover:text-brand-navy" :href="`#${detail.slug}`">{{ detail.title }}</a>
          </li>
        </ol>
      </nav>
    </aside>

    <div class="space-y-6">
      <header class="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p class="text-sm font-semibold uppercase text-brand-teal">Learning Module</p>
        <h1 class="mt-2 text-3xl font-bold text-brand-navy">{{ module.title }}</h1>
        <p v-if="module.description" class="mt-3 max-w-3xl text-slate-600">{{ module.description }}</p>
      </header>

      <section
        v-for="detail in module.details"
        :id="detail.slug"
        :key="detail.slug"
        class="scroll-mt-28 rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <div class="mb-5">
          <h2 class="text-xl font-bold text-slate-900">{{ detail.title }}</h2>
          <p v-if="detail.summary" class="mt-2 text-slate-600">{{ detail.summary }}</p>
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
  </article>
</template>

<script setup lang="ts">
import type { LearningModule } from '~/types/learning'
import AttachmentList from '~/components/learning/AttachmentList.vue'
import ComponentTable from '~/components/learning/ComponentTable.vue'

defineProps<{
  module: LearningModule
}>()
</script>
