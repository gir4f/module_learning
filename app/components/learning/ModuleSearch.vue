<template>
  <label class="grid gap-2">
    <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Cari modul</span>
    <span class="relative block">
      <input
        ref="inputEl"
        :value="modelValue"
        type="search"
        class="w-full rounded-lg border border-slate-300 bg-white py-3 pl-4 pr-24 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-teal focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-cyan-950"
        placeholder="Cari modul, produk, komponen, atau keyword..."
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
      <button
        v-if="modelValue"
        type="button"
        class="absolute right-16 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus:ring-cyan-950"
        aria-label="Bersihkan pencarian"
        @click="$emit('update:modelValue', '')"
      >
        <i class="pi pi-times text-xs" aria-hidden="true" />
      </button>
      <kbd class="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-400">Ctrl K</kbd>
    </span>
  </label>
</template>

<script setup lang="ts">
const inputEl = ref<HTMLInputElement | null>(null)

defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

onMounted(() => {
  window.addEventListener('keydown', focusShortcut)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', focusShortcut)
})

function focusShortcut(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    inputEl.value?.focus()
  }
}
</script>
