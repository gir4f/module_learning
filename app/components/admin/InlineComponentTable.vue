<template>
  <div class="space-y-3">
    <div class="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:block">
      <table class="w-full min-w-[720px] text-left text-sm">
        <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          <tr>
            <th class="w-10 px-3 py-3">
              <label class="flex items-center justify-center">
                <span class="sr-only">Pilih semua komponen</span>
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-slate-300 text-brand-teal focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-900 dark:focus:ring-cyan-900"
                  :checked="allSelected"
                  :disabled="!model.length"
                  @change="toggleSelectAll"
                >
              </label>
            </th>
            <th class="px-4 py-3 font-black">Kategori</th>
            <th class="px-4 py-3 font-black">Nama</th>
            <th class="px-4 py-3 font-black w-24">Jumlah</th>
            <th class="px-4 py-3 font-black w-24">Satuan</th>
            <th class="px-4 py-3 font-black">Catatan</th>
            <th class="px-4 py-3 text-right font-black w-16">Aksi</th>
          </tr>
        </thead>
        <tbody v-if="model.length" class="divide-y divide-slate-100 dark:divide-slate-800/50">
          <tr v-for="(row, index) in model" :key="rowKey(row)" class="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
            <td class="px-3 py-2">
              <label class="flex items-center justify-center">
                <span class="sr-only">Pilih komponen baris {{ index + 1 }}</span>
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-slate-300 text-brand-teal focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-900 dark:focus:ring-cyan-900"
                  :checked="selectedKeys.has(rowKey(row)!)"
                  @change="toggleRowSelection(rowKey(row)!, $event)"
                >
              </label>
            </td>
            <td class="p-2"><input v-model="row.category" class="cell-input" placeholder="Power"></td>
            <td class="p-2"><input v-model="row.name" class="cell-input" placeholder="Nama komponen"></td>
            <td class="p-2"><input v-model="row.quantity" class="cell-input" placeholder="1"></td>
            <td class="p-2"><input v-model="row.unit" class="cell-input" placeholder="pcs"></td>
            <td class="p-2"><input v-model="row.note" class="cell-input" placeholder="Catatan opsional"></td>
            <td class="p-2 pr-4 text-right">
              <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-xl text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300 dark:focus-visible:ring-red-950" :aria-label="`Hapus komponen baris ${index + 1}`" @click="removeRow(index)">
                <i class="pi pi-trash" aria-hidden="true" />
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="7" class="px-4 py-8 text-center">
              <div class="mx-auto flex max-w-sm flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                <span class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-brand-teal dark:bg-slate-800 dark:text-cyan-300">
                  <i class="pi pi-list-check" aria-hidden="true" />
                </span>
                <p class="text-sm font-bold">Belum ada komponen.</p>
                <p class="text-xs font-semibold">Tambahkan komponen yang dipakai di varian produk ini.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid gap-4 sm:hidden">
      <article v-for="(row, index) in model" :key="rowKey(row)" class="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-brand-teal dark:border-slate-800 dark:bg-slate-900 dark:focus-within:ring-cyan-700">
        <div class="mb-3 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <label class="flex items-center justify-center">
              <span class="sr-only">Pilih komponen baris {{ index + 1 }}</span>
              <input
                type="checkbox"
                class="h-4 w-4 rounded border-slate-300 text-brand-teal focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-900 dark:focus:ring-cyan-900"
                :checked="selectedKeys.has(rowKey(row)!)"
                @change="toggleRowSelection(rowKey(row)!, $event)"
              >
            </label>
            <span class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500 dark:bg-slate-800 dark:text-slate-300">#{{ index + 1 }}</span>
          </div>
          <button type="button" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50 dark:focus-visible:ring-red-950" :aria-label="`Hapus komponen baris ${index + 1}`" @click="removeRow(index)">
            <i class="pi pi-times text-sm" aria-hidden="true" />
          </button>
        </div>
        <div class="grid gap-3">
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

    <Transition name="bulk-pill">
      <BulkActionPill
        v-if="selectedKeys.size > 0"
        :selected-count="selectedKeys.size"
        :actions="bulkActions"
        :on-cancel="clearSelection"
        :position-style="{ position: 'sticky', bottom: '1rem', left: '50%', transform: 'translateX(-50%)' }"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { ComponentItem } from '~/types/learning'
import BulkActionPill, { type BulkAction } from '~/components/shared/BulkActionPill.vue'

const model = defineModel<ComponentItem[]>({ default: () => [] })
const localRowKeys = new WeakMap<ComponentItem, string>()
const selectedKeys = ref<Set<string>>(new Set())

const allSelected = computed(() => {
  return model.value.length > 0 && model.value.every(row => selectedKeys.value.has(rowKey(row)!))
})

const bulkActions: BulkAction[] = [
  {
    key: 'delete',
    label: 'Hapus',
    icon: 'pi pi-trash',
    severity: 'danger',
    handler: () => bulkDeleteComponents(),
  },
]

function rowKey(row: ComponentItem) {
  if (row.id) return row.id
  if (!localRowKeys.has(row)) localRowKeys.set(row, crypto.randomUUID())
  return localRowKeys.get(row)!
}

function toggleSelectAll(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  if (checked) {
    const allKeys = new Set<string>(model.value.map(row => rowKey(row)))
    selectedKeys.value = allKeys
  } else {
    selectedKeys.value = new Set()
  }
}

function toggleRowSelection(key: string, event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  const next = new Set(selectedKeys.value)
  if (checked) {
    next.add(key)
  } else {
    next.delete(key)
  }
  selectedKeys.value = next
}

function clearSelection() {
  selectedKeys.value = new Set()
}

function handleComponentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && selectedKeys.value.size > 0) {
    clearSelection()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleComponentKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleComponentKeydown)
})

function bulkDeleteComponents() {
  model.value = model.value
    .filter(row => !selectedKeys.value.has(rowKey(row)))
    .map((row, index) => ({ ...row, sortOrder: index }))
  selectedKeys.value = new Set()
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
