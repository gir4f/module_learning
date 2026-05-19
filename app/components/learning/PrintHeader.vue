<template>
  <div class="print-only hidden">
    <div class="flex items-start justify-between gap-6 border-b border-slate-300 pb-4">
      <div class="flex items-center gap-4">
        <img src="/module-assets/LogoGitronikPolosNoBG.png" alt="PT. Gitronik Dimindo Indonesia" class="h-14 w-14 object-contain">
        <div>
          <p class="text-xs font-bold uppercase text-slate-600">PT. Gitronik Dimindo Indonesia</p>
          <h1 class="mt-1 text-2xl font-black text-slate-950">{{ module.title }}</h1>
        </div>
      </div>
      <dl class="grid min-w-48 gap-1 text-right text-xs">
        <div>
          <dt class="font-bold uppercase text-slate-500">Tanggal Cetak</dt>
          <dd class="font-semibold text-slate-900">{{ printedAt }}</dd>
        </div>
        <div>
          <dt class="font-bold uppercase text-slate-500">Status</dt>
          <dd class="font-semibold text-slate-900">{{ module.status === 'PUBLISHED' ? 'Publikasi' : 'Draf' }}</dd>
        </div>
        <div>
          <dt class="font-bold uppercase text-slate-500">Isi Modul</dt>
          <dd class="font-semibold text-slate-900">{{ module.details.length }} varian produk / {{ attachmentCount }} file</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LearningModule } from '~/types/learning'

const { module } = defineProps<{
  module: LearningModule
}>()

const printedAt = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
}).format(new Date())

const attachmentCount = computed(() => module.details.reduce((total, detail) => total + detail.attachments.length, 0))
</script>
