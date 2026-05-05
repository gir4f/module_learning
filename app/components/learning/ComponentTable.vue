<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-2 no-print">
      <h3 class="text-sm font-bold uppercase text-slate-500">Tabel Komponen</h3>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-brand-teal focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:text-slate-200"
        @click="copyTable"
      >
        <i class="pi pi-copy text-xs" aria-hidden="true" />
        Salin tabel
      </button>
    </div>

    <div class="hidden overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:block">
      <table class="min-w-[720px] divide-y divide-slate-200 text-sm dark:divide-slate-800">
        <caption class="sr-only">Daftar komponen dan parts</caption>
        <thead class="sticky top-0 z-10 bg-sky-50 text-left text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-100">
          <tr>
            <th scope="col" class="px-4 py-3 font-semibold">Komponen</th>
            <th scope="col" class="w-28 px-4 py-3 font-semibold">Jumlah</th>
            <th scope="col" class="w-28 px-4 py-3 font-semibold">Satuan</th>
            <th scope="col" class="px-4 py-3 font-semibold">Keterangan</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
          <template v-for="group in groupedComponents" :key="group.category">
            <tr class="bg-slate-50 dark:bg-slate-800/70">
              <th colspan="4" scope="rowgroup" class="px-4 py-2 text-left text-xs font-bold uppercase text-brand-navy dark:text-brand-dark-navy">
                {{ group.category }}
              </th>
            </tr>
            <tr
              v-for="(component, index) in group.items"
              :key="component.id || `${component.name}-${index}`"
              class="even:bg-slate-50/70 hover:bg-cyan-50/70 dark:even:bg-slate-800/35 dark:hover:bg-cyan-950/30"
            >
              <th scope="row" class="px-4 py-3 text-left font-medium text-slate-900 dark:text-slate-100">{{ component.name }}</th>
              <td class="px-4 py-3 text-slate-700 dark:text-slate-300">{{ component.quantity }}</td>
              <td class="px-4 py-3 text-slate-700 dark:text-slate-300">{{ component.unit }}</td>
              <td class="px-4 py-3 text-slate-700 dark:text-slate-300">{{ component.note || '-' }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="grid gap-3 sm:hidden">
      <details
        v-for="group in groupedComponents"
        :key="group.category"
        open
        class="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      >
        <summary class="cursor-pointer px-4 py-3 text-sm font-bold uppercase text-brand-navy dark:text-brand-dark-navy">
          {{ group.category }}
        </summary>
        <div class="grid gap-2 border-t border-slate-100 p-3 dark:border-slate-800">
          <article
            v-for="component in group.items"
            :key="component.id || component.name"
            class="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800"
          >
            <h4 class="font-bold text-slate-900 dark:text-slate-100">{{ component.name }}</h4>
            <dl class="mt-2 grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
              <div>
                <dt class="text-xs uppercase text-slate-500">Jumlah</dt>
                <dd class="font-semibold">{{ component.quantity }}</dd>
              </div>
              <div>
                <dt class="text-xs uppercase text-slate-500">Satuan</dt>
                <dd class="font-semibold">{{ component.unit }}</dd>
              </div>
              <div class="col-span-2">
                <dt class="text-xs uppercase text-slate-500">Keterangan</dt>
                <dd>{{ component.note || '-' }}</dd>
              </div>
            </dl>
          </article>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComponentItem } from '~/types/learning'

const props = defineProps<{
  components: ComponentItem[]
}>()

const groupedComponents = computed(() => {
  const groups = new Map<string, ComponentItem[]>()
  props.components.forEach((component) => {
    const category = component.category || 'Umum'
    groups.set(category, [...(groups.get(category) || []), component])
  })
  return [...groups.entries()].map(([category, items]) => ({ category, items }))
})

async function copyTable() {
  const rows = [
    ['Komponen', 'Jumlah', 'Satuan', 'Keterangan'],
    ...props.components.map((component) => [
      component.name,
      component.quantity,
      component.unit,
      component.note || '',
    ]),
  ]
  await navigator.clipboard.writeText(rows.map((row) => row.join('\t')).join('\n'))
}
</script>
