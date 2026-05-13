<template>
  <div class="space-y-3">
    <div class="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:block">
      <table class="w-full min-w-[720px] text-left text-sm">
        <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          <tr>
            <th class="px-4 py-3 font-black">Category</th>
            <th class="px-4 py-3 font-black">Name</th>
            <th class="px-4 py-3 font-black w-24">Qty</th>
            <th class="px-4 py-3 font-black w-24">Unit</th>
            <th class="px-4 py-3 font-black">Note</th>
            <th class="px-4 py-3 text-right font-black w-16">Actions</th>
          </tr>
        </thead>
        <tbody v-auto-animate class="divide-y divide-slate-100 dark:divide-slate-800/50">
          <tr v-for="(row, index) in model" :key="index" class="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
            <td class="p-2"><input v-model="row.category" class="cell-input" placeholder="Power"></td>
            <td class="p-2"><input v-model="row.name" class="cell-input" placeholder="Component name"></td>
            <td class="p-2"><input v-model="row.quantity" class="cell-input" placeholder="1"></td>
            <td class="p-2"><input v-model="row.unit" class="cell-input" placeholder="pcs"></td>
            <td class="p-2"><input v-model="row.note" class="cell-input" placeholder="Optional note"></td>
            <td class="p-2 pr-4 text-right">
              <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-xl text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300" aria-label="Delete component row" @click="removeRow(index)">
                <i class="pi pi-trash" aria-hidden="true" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-auto-animate class="grid gap-4 sm:hidden">
      <article v-for="(row, index) in model" :key="index" class="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-brand-teal dark:border-slate-800 dark:bg-slate-900 dark:focus-within:ring-cyan-700">
        <button type="button" class="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50" aria-label="Delete row" @click="removeRow(index)">
          <i class="pi pi-times text-sm" aria-hidden="true" />
        </button>
        <div class="grid gap-3 pr-8">
          <label class="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Category<input v-model="row.category" class="cell-input" placeholder="Power"></label>
          <label class="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Name<input v-model="row.name" class="cell-input" placeholder="Component name"></label>
          <div class="grid grid-cols-2 gap-3">
            <label class="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Qty<input v-model="row.quantity" class="cell-input" placeholder="1"></label>
            <label class="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Unit<input v-model="row.unit" class="cell-input" placeholder="pcs"></label>
          </div>
          <label class="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Note<input v-model="row.note" class="cell-input" placeholder="Optional note"></label>
        </div>
      </article>
    </div>

    <Button label="Add Row" icon="pi pi-plus" severity="secondary" outlined @click="addRow" />
  </div>
</template>

<script setup lang="ts">
import type { ComponentItem } from '~/types/learning'

const model = defineModel<ComponentItem[]>({ default: () => [] })

function addRow() {
  model.value = [
    ...model.value,
    { category: '', name: '', quantity: '', unit: '', note: '', sortOrder: model.value.length },
  ]
}

function removeRow(index: number) {
  model.value = model.value.filter((_, rowIndex) => rowIndex !== index).map((row, rowIndex) => ({ ...row, sortOrder: rowIndex }))
}
</script>

<style scoped>
.cell-input {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  background: transparent;
  padding: 0.5rem 0.75rem;
  color: rgb(15 23 42);
  outline: none;
  transition: all 0.2s;
}

.cell-input:hover {
  background: rgba(241, 245, 249, 0.5);
}

.cell-input:focus {
  border-color: rgb(18 184 190);
  background: white;
  box-shadow: 0 0 0 3px rgb(207 250 254);
}

:global(.dark) .cell-input {
  color: rgb(241 245 249);
}

:global(.dark) .cell-input:hover {
  background: rgba(30, 41, 59, 0.5);
}

:global(.dark) .cell-input:focus {
  border-color: rgb(8 145 178);
  background: rgb(15 23 42);
  box-shadow: 0 0 0 3px rgb(8 51 68);
}
</style>
