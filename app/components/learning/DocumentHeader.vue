<template>
  <header class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <span class="inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase" :class="categoryClass">{{ categoryName }}</span>
        <h1 class="mt-3 text-3xl font-bold text-brand-navy dark:text-cyan-200">{{ module.title }}</h1>
        <p v-if="module.description" class="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">{{ module.description }}</p>
      </div>
      <div class="flex flex-wrap gap-2 no-print xl:hidden">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-teal hover:text-brand-navy focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:text-slate-200"
          @click="shareModule"
        >
          <i class="pi pi-share-alt text-xs" aria-hidden="true" />
          {{ copied ? 'Disalin' : 'Bagikan' }}
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-md bg-brand-teal px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-teal-dark focus:outline-none focus:ring-4 focus:ring-cyan-100"
          @click="printModule"
        >
          <i class="pi pi-print text-xs" aria-hidden="true" />
          Cetak
        </button>
      </div>
    </div>

    <dl class="mt-5 grid gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-4 xl:hidden">
      <div>
        <dt class="text-xs font-semibold uppercase text-slate-500">Status</dt>
        <dd class="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{{ statusLabel }}</dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase text-slate-500">Bagian</dt>
        <dd class="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{{ module.details.length }}</dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase text-slate-500">Komponen</dt>
        <dd class="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{{ componentCount }}</dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase text-slate-500">Waktu baca</dt>
        <dd class="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{{ readingTime }} menit</dd>
      </div>
    </dl>
    <p class="mt-3 text-xs text-slate-500 dark:text-slate-400 xl:hidden">Diperbarui {{ updatedAt }}</p>
  </header>
</template>

<script setup lang="ts">
import type { LearningModule } from '~/types/learning'
import { categoryClasses, categoryLabel, moduleCategory } from '~/utils/moduleUi'

const { module } = defineProps<{
  module: LearningModule
}>()

const componentCount = computed(() => module.details.reduce((total, detail) => total + detail.components.length, 0))
const category = computed(() => moduleCategory(module))
const categoryName = computed(() => categoryLabel(category.value))
const categoryClass = computed(() => categoryClasses(category.value))
const readingTime = computed(() => Math.max(1, Math.ceil((module.details.length * 90 + componentCount.value * 18) / 220)))
const updatedAt = computed(() => module.updatedAt ? formatStableDate(module.updatedAt) : '-')
const statusLabel = computed(() => module.status === 'PUBLISHED' ? 'Publikasi' : 'Draf')

function formatStableDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}
const copied = ref(false)

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
</script>
