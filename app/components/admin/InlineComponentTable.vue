<template>
  <div class="space-y-3">
    <div class="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:block">
      <table class="w-full min-w-[720px] text-left text-sm">
        <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          <tr>
            <th class="px-4 py-3 font-black">Kategori</th>
            <th class="px-4 py-3 font-black">Nama</th>
            <th class="px-4 py-3 font-black w-24">Jumlah</th>
            <th class="px-4 py-3 font-black w-24">Satuan</th>
            <th class="px-4 py-3 font-black">Catatan</th>
            <th class="px-4 py-3 text-right font-black w-16">Aksi</th>
          </tr>
        </thead>
        <tbody v-if="model.length" v-auto-animate="{ duration: 160, easing: 'ease-out' }" class="divide-y divide-slate-100 dark:divide-slate-800/50">
          <tr v-for="(row, index) in model" :key="rowKey(row)" class="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
            <td class="p-2"><input v-model="row.category" class="cell-input" placeholder="Power"></td>
            <td class="p-2"><input v-model="row.name" class="cell-input" placeholder="Nama komponen"></td>
            <td class="p-2"><input v-model="row.quantity" class="cell-input" placeholder="1"></td>
            <td class="p-2"><input v-model="row.unit" class="cell-input" placeholder="pcs"></td>
            <td class="p-2"><input v-model="row.note" class="cell-input" placeholder="Catatan opsional"></td>
            <td class="p-2 pr-4 text-right">
              <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-xl text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300" aria-label="Hapus komponen" @click="removeRow(index)">
                <i class="pi pi-trash" aria-hidden="true" />
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" class="px-4 py-8 text-center">
              <div class="mx-auto flex max-w-sm flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                <span class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-brand-teal dark:bg-slate-800 dark:text-cyan-300">
                  <i class="pi pi-list-check" aria-hidden="true" />
                </span>
                <p class="text-sm font-bold">Belum ada komponen.</p>
                <p class="text-xs font-semibold">Tambahkan komponen yang dipakai di bagian ini.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-auto-animate="{ duration: 160, easing: 'ease-out' }" class="grid gap-4 sm:hidden">
      <article v-for="(row, index) in model" :key="rowKey(row)" class="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-brand-teal dark:border-slate-800 dark:bg-slate-900 dark:focus-within:ring-cyan-700">
        <span class="mb-3 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500 dark:bg-slate-800 dark:text-slate-300">#{{ index + 1 }}</span>
        <button type="button" class="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50" aria-label="Hapus komponen" @click="removeRow(index)">
          <i class="pi pi-times text-sm" aria-hidden="true" />
        </button>
        <div class="grid gap-3 pr-8">
          <label class="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Kategori<input v-model="row.category" class="cell-input" placeholder="Power"></label>
          <label class="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Nama<input v-model="row.name" class="cell-input" placeholder="Nama komponen"></label>
          <div class="grid grid-cols-2 gap-3">
            <label class="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Jumlah<input v-model="row.quantity" class="cell-input" placeholder="1"></label>
            <label class="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Satuan<input v-model="row.unit" class="cell-input" placeholder="pcs"></label>
          </div>
          <label class="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Catatan<input v-model="row.note" class="cell-input" placeholder="Catatan opsional"></label>
        </div>
      </article>
      <div v-if="!model.length" class="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <i class="pi pi-list-check text-xl text-brand-teal dark:text-cyan-300" aria-hidden="true" />
        <p class="mt-2 text-sm font-bold">Belum ada komponen.</p>
      </div>
    </div>

    <Button label="Tambah Komponen" icon="pi pi-plus" severity="secondary" outlined class="w-full sm:w-auto" @click="addRow" />
  </div>
</template>

<script setup lang="ts">
import type { ComponentItem } from '~/types/learning'

const model = defineModel<ComponentItem[]>({ default: () => [] })
const localRowKeys = new WeakMap<ComponentItem, string>()

function rowKey(row: ComponentItem) {
  if (row.id) return row.id
  if (!localRowKeys.has(row)) localRowKeys.set(row, crypto.randomUUID())
  return localRowKeys.get(row)
}

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
