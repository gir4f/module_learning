<template>
  <NuxtLink
    :to="`/modules/${module.slug}`"
    class="group flex min-h-52 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-teal hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-800 dark:bg-slate-900 dark:focus:ring-cyan-950"
    :class="animationClass"
    :style="{ animationDelay: `${Math.min(index || 0, 12) * 45}ms` }"
  >
    <div class="h-1.5" :class="accentClass" />
    <div class="flex flex-1 flex-col p-4 sm:p-5">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-start gap-3">
          <span class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border" :class="categoryClass">
            <i :class="icon" aria-hidden="true" />
          </span>
          <div>
            <p class="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{{ label }}</p>
            <h2 class="mt-1 text-lg font-bold text-brand-navy dark:text-brand-dark-navy">
              <template v-for="(part, partIndex) in highlightedTitle" :key="`${part.text}-${partIndex}`">
                <mark v-if="part.match" class="rounded bg-cyan-100 px-0.5 text-brand-navy dark:bg-cyan-900 dark:text-cyan-100">{{ part.text }}</mark>
                <span v-else>{{ part.text }}</span>
              </template>
            </h2>
          </div>
        </div>
        <span
          class="shrink-0 rounded-full px-2 py-1 text-xs font-bold"
          :class="module.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-200'"
        >
          {{ module.status }}
        </span>
      </div>

      <p class="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        <template v-for="(part, partIndex) in highlightedDescription" :key="`${part.text}-${partIndex}`">
          <mark v-if="part.match" class="rounded bg-cyan-100 px-0.5 text-brand-navy dark:bg-cyan-900 dark:text-cyan-100">{{ part.text }}</mark>
          <span v-else>{{ part.text }}</span>
        </template>
      </p>

      <div class="mt-4 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
        <span class="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {{ module.details.length }} section
        </span>
        <span class="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {{ componentCount }} komponen
        </span>
        <span class="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {{ attachmentCount }} file
        </span>
      </div>

      <div class="mt-auto flex items-center justify-between pt-5 text-sm">
        <span class="text-slate-500 dark:text-slate-400">Diperbarui {{ updatedAt }}</span>
        <span class="font-semibold text-brand-teal group-hover:text-brand-navy dark:group-hover:text-brand-dark-navy">
          Buka
          <i class="pi pi-arrow-right ml-1 text-xs" aria-hidden="true" />
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { LearningModule } from '~/types/learning'
import { categoryClasses, categoryLabel, moduleCategory, moduleIcon } from '~/utils/moduleUi'

const props = defineProps<{
  module: LearningModule
  index?: number
  search?: string
}>()

const componentCount = computed(() => props.module.details.reduce((total, detail) => total + detail.components.length, 0))
const attachmentCount = computed(() => props.module.details.reduce((total, detail) => total + detail.attachments.length, 0))
const category = computed(() => moduleCategory(props.module))
const label = computed(() => categoryLabel(category.value))
const categoryClass = computed(() => categoryClasses(category.value))
const accentClass = computed(() => {
  if (category.value === 'kabel') return 'bg-category-cable'
  if (category.value === 'aksesori') return 'bg-category-accessory'
  if (category.value === 'sop') return 'bg-category-sop'
  return 'bg-category-device'
})
const icon = computed(() => moduleIcon(props.module))
const updatedAt = computed(() => props.module.updatedAt ? new Date(props.module.updatedAt).toLocaleDateString() : '-')
const animationClass = computed(() => 'animate-fade-up')
const description = computed(() => props.module.description || props.module.keywords || 'Dokumentasi produk dan komponen tersedia di dalam modul.')
const highlightedTitle = computed(() => highlightParts(props.module.title, props.search || ''))
const highlightedDescription = computed(() => highlightParts(description.value, props.search || ''))

function highlightParts(text: string, query: string) {
  const needle = query.trim()
  if (!needle) return [{ text, match: false }]
  const index = text.toLowerCase().indexOf(needle.toLowerCase())
  if (index === -1) return [{ text, match: false }]
  return [
    { text: text.slice(0, index), match: false },
    { text: text.slice(index, index + needle.length), match: true },
    { text: text.slice(index + needle.length), match: false },
  ].filter((part) => part.text)
}
</script>
