<template>
  <div class="overflow-x-auto rounded-lg border border-slate-200">
    <table class="min-w-full divide-y divide-slate-200 text-sm">
      <thead class="bg-sky-50 text-left text-slate-700">
        <tr>
          <th class="px-4 py-3 font-semibold">Komponen</th>
          <th class="px-4 py-3 font-semibold">Jumlah</th>
          <th class="px-4 py-3 font-semibold">Satuan</th>
          <th class="px-4 py-3 font-semibold">Keterangan</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 bg-white">
        <template v-for="(component, index) in components" :key="component.id || `${component.name}-${index}`">
          <tr v-if="showCategory(index)" class="bg-slate-50">
            <td colspan="4" class="px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand-navy">
              {{ component.category }}
            </td>
          </tr>
          <tr>
            <td class="px-4 py-3 text-slate-900">{{ component.name }}</td>
            <td class="px-4 py-3 text-slate-700">{{ component.quantity }}</td>
            <td class="px-4 py-3 text-slate-700">{{ component.unit }}</td>
            <td class="px-4 py-3 text-slate-700">{{ component.note || '-' }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { ComponentItem } from '~/types/learning'

const props = defineProps<{
  components: ComponentItem[]
}>()

function showCategory(index: number) {
  const category = props.components[index]?.category
  if (!category) return false
  return index === 0 || props.components[index - 1]?.category !== category
}
</script>
