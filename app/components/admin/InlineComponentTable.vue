<template>
  <div class="space-y-3">
    <div class="hidden overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 sm:block">
      <table class="w-full min-w-[720px] text-left text-sm">
        <thead class="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          <tr>
            <th class="px-3 py-2 font-black">Category</th>
            <th class="px-3 py-2 font-black">Name</th>
            <th class="px-3 py-2 font-black">Qty</th>
            <th class="px-3 py-2 font-black">Unit</th>
            <th class="px-3 py-2 font-black">Note</th>
            <th class="px-3 py-2 text-right font-black">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
          <tr v-for="(row, index) in model" :key="index">
            <td class="p-2"><input v-model="row.category" class="cell-input" placeholder="Power"></td>
            <td class="p-2"><input v-model="row.name" class="cell-input" placeholder="Component name"></td>
            <td class="p-2"><input v-model="row.quantity" class="cell-input w-24" placeholder="1"></td>
            <td class="p-2"><input v-model="row.unit" class="cell-input w-24" placeholder="pcs"></td>
            <td class="p-2"><input v-model="row.note" class="cell-input" placeholder="Optional note"></td>
            <td class="p-2 text-right">
              <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40" aria-label="Delete component row" @click="removeRow(index)">
                <i class="pi pi-trash" aria-hidden="true" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid gap-3 sm:hidden">
      <article v-for="(row, index) in model" :key="index" class="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
        <div class="grid gap-3">
          <label class="grid gap-1 text-xs font-black text-slate-500 dark:text-slate-400">Category<input v-model="row.category" class="cell-input" placeholder="Power"></label>
          <label class="grid gap-1 text-xs font-black text-slate-500 dark:text-slate-400">Name<input v-model="row.name" class="cell-input" placeholder="Component name"></label>
          <div class="grid grid-cols-2 gap-2">
            <label class="grid gap-1 text-xs font-black text-slate-500 dark:text-slate-400">Qty<input v-model="row.quantity" class="cell-input" placeholder="1"></label>
            <label class="grid gap-1 text-xs font-black text-slate-500 dark:text-slate-400">Unit<input v-model="row.unit" class="cell-input" placeholder="pcs"></label>
          </div>
          <label class="grid gap-1 text-xs font-black text-slate-500 dark:text-slate-400">Note<input v-model="row.note" class="cell-input" placeholder="Optional note"></label>
          <Button label="Delete row" icon="pi pi-trash" severity="danger" outlined size="small" @click="removeRow(index)" />
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
  min-height: 2.5rem;
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgb(203 213 225);
  background: white;
  padding: 0.5rem 0.75rem;
  color: rgb(15 23 42);
  outline: none;
}

.cell-input:focus {
  border-color: rgb(18 184 190);
  box-shadow: 0 0 0 4px rgb(207 250 254);
}

:global(.dark) .cell-input {
  border-color: rgb(51 65 85);
  background: rgb(2 6 23);
  color: rgb(241 245 249);
}

:global(.dark) .cell-input:focus {
  box-shadow: 0 0 0 4px rgb(8 51 68);
}
</style>
