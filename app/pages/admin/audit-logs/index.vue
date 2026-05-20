<template>
  <section class="mx-auto w-full max-w-7xl space-y-6 px-3 pb-12 sm:px-0">
    <!-- Page Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Riwayat Aktivitas
        </h1>
        <p class="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
          Riwayat semua perubahan data yang dilakukan oleh admin.
        </p>
      </div>
    </div>

    <!-- Filter Controls -->
    <div class="flex flex-wrap items-end gap-4">
      <label class="grid gap-1.5">
        <span class="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Kategori</span>
        <Select
          v-model="filterEntityType"
          :options="entityTypeOptions"
          option-label="label"
          option-value="value"
          class="w-44"
          @update:model-value="onFilterChange"
        />
      </label>

      <label class="grid gap-1.5">
        <span class="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Pengguna</span>
        <Select
          v-model="filterActorId"
          :options="actorOptions"
          option-label="label"
          option-value="value"
          class="w-44"
          @update:model-value="onFilterChange"
        />
      </label>
    </div>

    <!-- Loading State -->
    <div v-if="store.loading && store.items.length === 0" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-14 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!store.loading && !store.error && store.items.length === 0"
      class="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-950"
    >
      <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <i class="pi pi-history text-2xl text-brand-teal dark:text-cyan-300" aria-hidden="true" />
      </span>
      <p class="mt-4 text-base font-bold text-slate-700 dark:text-slate-200">Belum ada riwayat aktivitas.</p>
      <p class="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">Data aktivitas akan muncul setelah ada perubahan pada sistem.</p>
    </div>

    <!-- Data Display -->
    <div
      v-else-if="store.items.length > 0"
      class="flex flex-col gap-4"
    >
      <!-- Mobile Cards (hidden on md and up) -->
      <div class="grid gap-3 md:hidden">
        <article
          v-for="entry in store.items"
          :key="`mobile-${entry.id}`"
          class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-brand-teal/50 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-teal-dark/50"
        >
          <div class="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span :title="formatAbsoluteDate(entry.createdAt)">
                {{ formatRelativeTime(entry.createdAt) }}
              </span>
            </span>
            <span class="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand-teal-dark dark:bg-cyan-950/40 dark:text-cyan-400">
              {{ ENTITY_TYPE_MAP[entry.entityType] }}
            </span>
          </div>
          <div class="flex flex-col gap-3">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Pengguna</p>
                <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ resolveActorDisplay(entry) }}</p>
              </div>
              <div class="text-right">
                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Aksi</p>
                <p class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ ACTION_VERB_MAP[entry.action] }}</p>
              </div>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Item yang Diubah</p>
              <p class="text-base font-black text-slate-900 dark:text-slate-100">{{ entry.entityLabel }}</p>
            </div>
          </div>
        </article>
      </div>

      <!-- Desktop Table (hidden on sm and down) -->
      <div class="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:block">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                <th class="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Waktu
                </th>
                <th class="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Pengguna
                </th>
                <th class="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Aksi
                </th>
                <th class="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Kategori
                </th>
                <th class="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Item yang Diubah
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr
                v-for="entry in store.items"
                :key="entry.id"
                class="transition-all duration-200 hover:translate-x-1 hover:bg-slate-50 dark:hover:bg-slate-900/50"
              >
                <td class="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
                  <span :title="formatAbsoluteDate(entry.createdAt)">
                    {{ formatRelativeTime(entry.createdAt) }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                  {{ resolveActorDisplay(entry) }}
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
                  {{ ACTION_VERB_MAP[entry.action] }}
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
                  {{ ENTITY_TYPE_MAP[entry.entityType] }}
                </td>
                <td class="max-w-[200px] truncate px-4 py-3 text-slate-700 dark:text-slate-300">
                  {{ entry.entityLabel }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-if="store.error"
      class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/30"
    >
      <p class="text-sm font-semibold text-red-700 dark:text-red-300">
        Gagal memuat riwayat aktivitas.
      </p>
      <button
        type="button"
        class="mt-2 text-sm font-bold text-red-600 hover:underline dark:text-red-400"
        :disabled="store.loading"
        @click="retryFetch"
      >
        Coba lagi
      </button>
    </div>

    <!-- Load More Button -->
    <div v-if="store.nextCursor && !store.error" class="flex justify-center">
      <button
        type="button"
        class="rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-cyan-950"
        :disabled="store.loading"
        @click="loadMore"
      >
        <span v-if="store.loading" class="inline-flex items-center gap-2">
          <i class="pi pi-spinner pi-spin" aria-hidden="true" />
          Memuat...
        </span>
        <span v-else>Tampilkan Lebih Banyak</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAuditLogStore } from '~/stores/auditLog'
import { resolveActorDisplay, ACTION_VERB_MAP, ENTITY_TYPE_MAP } from '~/utils/auditDisplay'
import { timeAgo } from '~/utils/timeAgo'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const store = useAuditLogStore()

const filterEntityType = ref<string>('ALL')
const filterActorId = ref<string>('ALL')

const entityTypeOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Modul', value: 'MODULE' },
  { label: 'Varian Produk', value: 'MODULE_DETAIL' },
  { label: 'Komponen', value: 'COMPONENT_ITEM' },
  { label: 'Lampiran', value: 'ATTACHMENT' },
]

const actorOptions = computed(() => {
  const actorMap = new Map<string, string>()
  for (const entry of store.items) {
    if (entry.actorId && !actorMap.has(entry.actorId)) {
      actorMap.set(entry.actorId, resolveActorDisplay(entry))
    }
  }
  return [
    { label: 'Semua', value: 'ALL' },
    ...Array.from(actorMap.entries()).map(([id, display]) => ({ label: display, value: id })),
  ]
})

function formatRelativeTime(dateString: string): string {
  const result = timeAgo(dateString)
  return result === '-' ? 'Waktu tidak tersedia' : result
}

function formatAbsoluteDate(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Tanggal tidak valid'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(date)
}

function onFilterChange() {
  const filters: { entityType?: string; actorId?: string } = {}
  if (filterEntityType.value !== 'ALL') filters.entityType = filterEntityType.value
  if (filterActorId.value !== 'ALL') filters.actorId = filterActorId.value
  store.applyFilters(filters)
}

function loadMore() {
  store.fetchPage(50)
}

function retryFetch() {
  if (store.items.length === 0) {
    const filters: { entityType?: string; actorId?: string } = {}
    if (filterEntityType.value !== 'ALL') filters.entityType = filterEntityType.value
    if (filterActorId.value !== 'ALL') filters.actorId = filterActorId.value
    store.applyFilters(filters)
  } else {
    store.fetchPage(50)
  }
}

onMounted(() => {
  store.resetState()
  const filters: { entityType?: string; actorId?: string } = {}
  if (filterEntityType.value !== 'ALL') filters.entityType = filterEntityType.value
  if (filterActorId.value !== 'ALL') filters.actorId = filterActorId.value
  store.applyFilters(filters)
})
</script>
