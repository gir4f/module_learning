<template>
  <section class="mx-auto w-full max-w-7xl space-y-6 px-3 pb-12 sm:px-0">
    <section class="relative overflow-hidden rounded-3xl bg-slate-900 px-4 py-5 text-white shadow-lg sm:p-8 xl:p-10">
      <div class="absolute inset-0 bg-linear-to-br from-brand-navy via-brand-teal-dark to-brand-teal opacity-90" aria-hidden="true" />
      <div class="absolute inset-0 bg-[url('/grid.svg')] opacity-20" aria-hidden="true" />

      <div class="relative flex flex-col gap-4 sm:gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div class="max-w-2xl">
          <p class="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200 sm:text-[11px] sm:tracking-[0.22em]">Operational Report</p>
          <h1 class="mt-2 text-[2rem] font-black leading-tight tracking-tight text-balance sm:text-4xl xl:text-[2.65rem]">
            Riwayat Aktivitas
          </h1>
          <p class="mt-3 text-sm leading-6 text-cyan-50/90 sm:mt-4 sm:text-base sm:leading-7">
            Laporan seluruh perubahan data yang dilakukan admin, dirancang untuk cepat dipindai tanpa kehilangan konteks operasional.
          </p>
        </div>

        <dl class="grid w-full grid-cols-3 gap-2 sm:gap-3 xl:w-auto xl:shrink-0">
          <div
            v-for="card in summaryCards"
            :key="card.label"
            class="rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-center shadow-lg shadow-slate-950/10 backdrop-blur-sm sm:rounded-2xl sm:px-4 sm:py-4 sm:text-left xl:w-[160px] 2xl:w-[180px]"
          >
            <dt class="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/85 sm:text-[10px] sm:tracking-[0.18em]">
              <span class="sm:hidden">{{ card.mobileLabel }}</span>
              <span class="hidden sm:inline">{{ card.label }}</span>
            </dt>
            <dd class="mt-1 text-2xl font-black tracking-tight text-white sm:mt-2 sm:text-[2rem]">{{ card.value }}</dd>
            <p class="mt-2 hidden text-xs font-medium leading-relaxed text-cyan-100/75 sm:block">{{ card.note }}</p>
          </div>
        </dl>
      </div>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white/95 px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.05)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
      <div class="flex flex-col gap-y-1 gap-x-4 xl:grid xl:grid-cols-[1fr_auto] xl:items-center xl:gap-x-5 xl:gap-y-1">
        
        <p class="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 xl:col-start-1 xl:row-start-1 xl:self-end xl:translate-y-1">
        Filter Aktivitas
        </p>

        <div class="hidden xl:grid xl:grid-cols-[10.5rem_10.5rem_15rem] xl:gap-3 xl:col-start-2 xl:row-start-1 xl:self-end">
          <span class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Kategori</span>
          <span class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Pengguna</span>
          <span class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Tanggal</span>
        </div>

        <p class="text-[16px] font-bold text-slate-700 dark:text-slate-300 xl:col-start-1 xl:row-start-2 s:pt-1.8">
          Menampilkan {{ paginatedEntries.length }} dari {{ filteredEntries.length }} aktivitas
        </p>

        <div class="mt-3 grid gap-4 sm:grid-cols-2 xl:mt-0 xl:grid-cols-[10.5rem_10.5rem_15rem] xl:gap-3 xl:col-start-2 xl:row-start-2">
          <label class="grid gap-1.5 xl:block">
            <span class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 xl:hidden">Kategori</span>
            <Select
              v-model="filterEntityType"
              :options="entityTypeOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </label>

          <label class="grid gap-1.5 xl:block">
            <span class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 xl:hidden">Pengguna</span>
            <Select
              v-model="filterActorId"
              :options="actorOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </label>

          <label class="grid gap-1.5 sm:col-span-2 xl:block xl:col-span-1">
            <span class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 xl:hidden">Tanggal</span>
            <div class="relative">
              <i
                class="pi pi-calendar pointer-events-none absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500"
                aria-hidden="true"
              />
              <DatePicker
                v-model="selectedDateRange"
                selection-mode="range"
                :manual-input="false"
                show-button-bar
                show-icon
                icon-display="button"
                placeholder="Semua tanggal"
                input-class="audit-date-picker-input"
                panel-class="audit-date-picker-panel"
                :pt="datePickerPt"
                class="w-full"
              >
                <template #dropdownicon>
                  <i class="pi pi-chevron-down text-sm" aria-hidden="true" />
                </template>
              </DatePicker>
            </div>
          </label>
        </div>
      </div>
    </section>

    <div v-if="showLoadingState" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-20 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
    </div>

    <div
      v-else-if="showEmptyState"
      class="rounded-[28px] border border-slate-200 bg-white px-6 py-16 text-center shadow-[0_18px_50px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950"
    >
      <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <i class="pi pi-history text-2xl text-brand-teal dark:text-cyan-300" aria-hidden="true" />
      </span>
      <p class="mt-4 text-base font-bold text-slate-700 dark:text-slate-200">
        {{ store.items.length === 0 ? 'Belum ada riwayat aktivitas.' : 'Tidak ada aktivitas yang cocok dengan filter.' }}
      </p>
      <p class="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
        {{ store.items.length === 0 ? 'Data aktivitas akan muncul setelah ada perubahan pada sistem.' : 'Coba ubah tanggal, kategori, atau pengguna untuk melihat aktivitas lain.' }}
      </p>
    </div>

    <section
      v-else-if="showContentState"
      class="space-y-4"
    >
      <div class="grid gap-3 md:hidden">
        <article
          v-for="entry in paginatedEntries"
          :key="`mobile-${entry.id}`"
          class="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.04)] transition-all hover:border-brand-teal/40 hover:shadow-[0_22px_45px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-teal-dark/40"
        >
          <div class="grid gap-3 min-[460px]:grid-cols-2">
            <div class="rounded-2xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
              <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Waktu</p>
              <p class="mt-2 text-sm font-bold text-slate-700 dark:text-slate-200">{{ formatAbsoluteDate(entry.createdAt) }}</p>
            </div>

            <div class="rounded-2xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
              <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Aksi</p>
              <span :class="actionMeta(entry.action).badgeClass" class="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide">
                <i :class="actionMeta(entry.action).icon" aria-hidden="true" />
                {{ actionMeta(entry.action).label }}
              </span>
            </div>
          </div>

          <div class="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
            <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Item yang Diubah</p>
            <p class="mt-2 text-base font-black text-slate-950 dark:text-slate-100">{{ entry.entityLabel }}</p>
          </div>

          <div class="mt-4 grid gap-3 min-[460px]:grid-cols-2">
            <div class="rounded-2xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
              <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Kategori</p>
              <span :class="entityMeta(entry.entityType).chipClass" class="mt-2 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-bold">
                <i :class="entityMeta(entry.entityType).icon" aria-hidden="true" />
                {{ entityMeta(entry.entityType).label }}
              </span>
            </div>

            <div class="rounded-2xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
              <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Pengguna</p>
              <p class="mt-2 text-sm font-bold text-slate-700 dark:text-slate-200">{{ resolveActorDisplay(entry) }}</p>
            </div>
          </div>
        </article>
      </div>

      <div class="hidden overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950 md:block">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[58rem] text-left text-sm">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900">
                <th class="whitespace-nowrap px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Waktu
                </th>
                <th class="whitespace-nowrap px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Pengguna
                </th>
                <th class="whitespace-nowrap px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Aksi
                </th>
                <th class="whitespace-nowrap px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Kategori
                </th>
                <th class="whitespace-nowrap px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Item yang Diubah
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr
                v-for="entry in paginatedEntries"
                :key="entry.id"
                class="transition-all duration-200 hover:bg-slate-50/80 dark:hover:bg-slate-900/70"
              >
                <td class="whitespace-nowrap px-5 py-4 align-top text-slate-600 dark:text-slate-400">
                  <span class="block font-semibold text-slate-700 dark:text-slate-200">
                    {{ formatAbsoluteDate(entry.createdAt) }}
                  </span>
                </td>

                <td class="whitespace-nowrap px-5 py-4 align-top">
                  <span class="font-bold text-slate-800 dark:text-slate-200">{{ resolveActorDisplay(entry) }}</span>
                </td>

                <td class="whitespace-nowrap px-5 py-4 align-top">
                  <span :class="actionMeta(entry.action).badgeClass" class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide">
                    <i :class="actionMeta(entry.action).icon" aria-hidden="true" />
                    {{ actionMeta(entry.action).label }}
                  </span>
                </td>

                <td class="whitespace-nowrap px-5 py-4 align-top">
                  <span :class="entityMeta(entry.entityType).chipClass" class="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-bold">
                    <i :class="entityMeta(entry.entityType).icon" aria-hidden="true" />
                    {{ entityMeta(entry.entityType).label }}
                  </span>
                </td>

                <td class="max-w-[24rem] px-5 py-4 align-top">
                  <span class="line-clamp-2 font-bold text-slate-800 dark:text-slate-200">{{ entry.entityLabel }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="filteredEntries.length > rows" class="flex justify-center border-t border-slate-200 pt-4 dark:border-slate-800">
        <Paginator
          v-model:first="firstRow"
          :rows="rows"
          :total-records="filteredEntries.length"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        />
      </div>
    </section>

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

    <Transition name="back-pill">
      <button
        v-if="showMobileBack"
        type="button"
        class="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-5 py-2.5 text-sm font-bold text-slate-700 shadow-lg backdrop-blur-md transition hover:border-brand-teal hover:text-brand-navy focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-200 dark:focus-visible:ring-cyan-950 sm:hidden"
        aria-label="Kembali ke dashboard admin"
        @click="navigateTo('/admin')"
      >
        <i class="pi pi-arrow-left text-xs" aria-hidden="true" />
        Kembali
      </button>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import type { AuditAction, AuditEntityType, AuditListFilters } from '~/types/audit'
import { useAuditLogStore } from '~/stores/auditLog'
import { filterAuditEntries, getAuditDayKey, paginateAuditEntries, shouldResetAuditPagination } from '~/utils/auditClient'
import { resolveActorDisplay } from '~/utils/auditDisplay'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const ACTION_META: Record<AuditAction, { label: string, icon: string, badgeClass: string }> = {
  CREATE: {
    label: 'Tambah',
    icon: 'pi pi-plus-circle',
    badgeClass: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-200',
  },
  UPDATE: {
    label: 'Edit',
    icon: 'pi pi-pencil',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-200',
  },
  DELETE: {
    label: 'Hapus',
    icon: 'pi pi-trash',
    badgeClass: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-200',
  },
}

const ENTITY_META: Record<AuditEntityType, { label: string, icon: string, chipClass: string }> = {
  MODULE: {
    label: 'Modul',
    icon: 'pi pi-book',
    chipClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  },
  MODULE_DETAIL: {
    label: 'Varian Produk',
    icon: 'pi pi-box',
    chipClass: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-200',
  },
  COMPONENT_ITEM: {
    label: 'Komponen',
    icon: 'pi pi-cog',
    chipClass: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-200',
  },
  ATTACHMENT: {
    label: 'Lampiran',
    icon: 'pi pi-paperclip',
    chipClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200',
  },
}

const store = useAuditLogStore()
const rows = 20
const firstRow = ref(0)
const showMobileBack = ref(true)
let lastScrollY = 0

const FALLBACK_ACTION_META = {
  label: 'Aktivitas',
  icon: 'pi pi-history',
  badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
}
const FALLBACK_ENTITY_META = {
  label: 'Lainnya',
  icon: 'pi pi-tag',
  chipClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
}

const filterEntityType = ref<AuditEntityType | 'ALL'>('ALL')
const filterActorId = ref<string | 'ALL'>('ALL')
const selectedDateRange = ref<Date[] | null>(null)

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

const activeDateRange = computed(() => {
  const selectedDates = (selectedDateRange.value ?? [])
    .filter((value): value is Date => value instanceof Date && !Number.isNaN(value.getTime()))
    .map(value => getAuditDayKey(value))
    .filter(Boolean)
    .sort()

  if (selectedDates.length === 0) {
    return { dateFrom: null, dateTo: null }
  }

  const dateFrom = selectedDates[0] || null
  const dateTo = selectedDates[selectedDates.length - 1] || dateFrom

  return { dateFrom, dateTo }
})

const activeFilters = computed<AuditListFilters>(() => ({
  entityType: filterEntityType.value,
  actorId: filterActorId.value,
  dateFrom: activeDateRange.value.dateFrom,
  dateTo: activeDateRange.value.dateTo,
}))

const filteredEntries = computed(() => filterAuditEntries(store.items, activeFilters.value))
const paginatedEntries = computed(() => paginateAuditEntries(filteredEntries.value, firstRow.value, rows))
const showLoadingState = computed(() => store.loading && store.items.length === 0)
const showEmptyState = computed(() => !store.loading && !store.error && filteredEntries.value.length === 0)
const showContentState = computed(() => filteredEntries.value.length > 0)
const activitiesTodayCount = computed(() => filteredEntries.value.filter(entry => getAuditDayKey(entry.createdAt) === getAuditDayKey(new Date())).length)
const activeUsersCount = computed(() => {
  const keys = filteredEntries.value
    .map(entry => entry.actorId || entry.actorEmail.trim().toLowerCase())
    .filter(Boolean)
  return new Set(keys).size
})
const summaryCards = computed(() => [
  {
    label: 'Total Aktivitas',
    mobileLabel: 'Aktivitas',
    value: formatNumber(filteredEntries.value.length),
    note: 'seluruh log pada hasil saat ini',
  },
  {
    label: 'Aktivitas Hari Ini',
    mobileLabel: 'Hari Ini',
    value: formatNumber(activitiesTodayCount.value),
    note: 'berdasarkan zona waktu Asia/Jakarta',
  },
  {
    label: 'Pengguna Aktif',
    mobileLabel: 'Pengguna',
    value: formatNumber(activeUsersCount.value),
    note: 'aktor unik dalam hasil saat ini',
  },
])

const datePickerPt = {
  root: { class: 'w-full' },
  dropdown: {
    class: 'absolute inset-y-1 right-1 flex w-10 items-center justify-center rounded-xl border-0 bg-transparent text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200 dark:focus-visible:ring-cyan-950',
  },
  panel: {
    class: 'rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900',
  },
  header: {
    class: 'border-b border-slate-200 px-3 py-3 dark:border-slate-800',
  },
  title: {
    class: 'text-sm font-black text-slate-800 dark:text-slate-100',
  },
  calendarContainer: {
    class: 'p-2',
  },
  day: {
    class: 'rounded-full font-semibold transition-colors',
  },
  buttonbar: {
    class: 'flex items-center justify-end gap-2 border-t border-slate-200 px-3 py-3 dark:border-slate-800',
  },
  pcPrevButton: {
    root: { class: 'h-9 w-9 rounded-full border-0 bg-transparent text-slate-500 shadow-none transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100' },
  },
  pcNextButton: {
    root: { class: 'h-9 w-9 rounded-full border-0 bg-transparent text-slate-500 shadow-none transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100' },
  },
  pcTodayButton: {
    root: { class: 'inline-flex min-h-8 items-center justify-center rounded-md border border-slate-200 bg-transparent px-3 text-sm font-semibold text-slate-600 shadow-none transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white' },
  },
  pcClearButton: {
    root: { class: 'inline-flex min-h-8 items-center justify-center rounded-md border border-transparent bg-transparent px-3 text-sm font-semibold text-slate-500 shadow-none transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100' },
  },
}

function actionMeta(action: AuditAction) {
  return ACTION_META[action] || FALLBACK_ACTION_META
}

function entityMeta(entityType: AuditEntityType) {
  return ENTITY_META[entityType] || FALLBACK_ENTITY_META
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('id-ID').format(value)
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

watch(activeFilters, (next, previous) => {
  if (previous && shouldResetAuditPagination(previous, next)) {
    firstRow.value = 0
  }
})

watch(filteredEntries, (entries) => {
  if (firstRow.value >= entries.length && firstRow.value !== 0) {
    firstRow.value = Math.max(0, Math.floor((entries.length - 1) / rows) * rows)
  }
})

function retryFetch() {
  firstRow.value = 0
  void store.fetchAll()
}

function handleMobileBackScroll() {
  const currentScrollY = window.scrollY
  if (currentScrollY < 10) {
    showMobileBack.value = true
  } else if (currentScrollY > lastScrollY) {
    showMobileBack.value = false
  } else {
    showMobileBack.value = true
  }
  lastScrollY = currentScrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleMobileBackScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleMobileBackScroll)
})

store.resetState()
await store.fetchAll()
</script>

<style scoped>
.back-pill-enter-active,
.back-pill-leave-active {
  transition: transform 200ms ease-out, opacity 200ms ease-out;
}

.back-pill-enter-from,
.back-pill-leave-to {
  opacity: 0;
  transform: translate(-50%, 0.75rem);
}

:deep(.audit-date-picker-input) {
  width: 100%;
  min-height: 2.75rem;
  cursor: pointer;
  border-radius: 0.75rem;
  border: 1px solid rgb(203 213 225 / 1);
  background: rgb(255 255 255 / 1);
  padding-left: 2.5rem;
  padding-right: 3rem;
  color: rgb(51 65 85 / 1);
  font-weight: 600;
  caret-color: transparent;
  box-shadow: none;
  transition: border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease, color 160ms ease;
}

:deep(.audit-date-picker-input::placeholder) {
  color: rgb(100 116 139 / 1);
  font-weight: 500;
}

:deep(.audit-date-picker-input:hover) {
  border-color: rgb(148 163 184 / 1);
  background: rgb(248 250 252 / 1);
}

:deep(.audit-date-picker-input:focus) {
  border-color: rgb(45 212 191 / 1);
  box-shadow: 0 0 0 4px rgb(204 251 241 / 0.85);
  outline: none;
}

:global(.dark .audit-date-picker-input) {
  border-color: rgb(51 65 85 / 1);
  background: rgb(15 23 42 / 1);
  color: rgb(248 250 252 / 1);
}

:global(.dark .audit-date-picker-input:hover) {
  border-color: rgb(71 85 105 / 1);
  background: rgb(15 23 42 / 1);
}

:global(.dark .audit-date-picker-input:focus) {
  border-color: rgb(34 211 238 / 1);
  box-shadow: 0 0 0 4px rgb(8 47 73 / 0.75);
}

:deep(.audit-date-picker-panel .p-datepicker-calendar-container) {
  padding: 0.5rem;
}

:deep(.audit-date-picker-panel .p-datepicker-header) {
  margin: 0;
  border-bottom: 1px solid rgb(226 232 240 / 1);
  background: transparent !important;
  padding: 0.75rem;
}

:deep(.audit-date-picker-panel .p-datepicker-title) {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent !important;
}

:deep(.audit-date-picker-panel .p-datepicker-select-month),
:deep(.audit-date-picker-panel .p-datepicker-select-year) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2rem;
  border: 1px solid rgb(226 232 240 / 1);
  border-radius: 0.625rem;
  background: rgb(248 250 252 / 0.95) !important;
  padding: 0.35rem 0.7rem;
  font-size: 0.95rem;
  font-weight: 800;
  color: rgb(15 23 42 / 1);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.75);
  transition: border-color 160ms ease, background-color 160ms ease, color 160ms ease;
}

:deep(.audit-date-picker-panel .p-datepicker-select-month:hover),
:deep(.audit-date-picker-panel .p-datepicker-select-year:hover) {
  border-color: rgb(148 163 184 / 1);
  background: rgb(241 245 249 / 1) !important;
  color: rgb(15 118 110 / 1);
}

:global(.dark .audit-date-picker-panel .p-datepicker-header) {
  border-bottom-color: rgb(51 65 85 / 1);
  background: transparent !important;
}

:global(.dark .audit-date-picker-panel .p-datepicker-title) {
  background: transparent !important;
}

:global(.dark .audit-date-picker-panel .p-datepicker-select-month),
:global(.dark .audit-date-picker-panel .p-datepicker-select-year) {
  border-color: rgb(51 65 85 / 1);
  background: rgb(30 41 59 / 0.9) !important;
  color: rgb(248 250 252 / 1);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.04);
}

:global(.dark .audit-date-picker-panel .p-datepicker-select-month:hover),
:global(.dark .audit-date-picker-panel .p-datepicker-select-year:hover) {
  border-color: rgb(71 85 105 / 1);
  background: rgb(51 65 85 / 0.95) !important;
  color: rgb(103 232 249 / 1);
}

:deep(.audit-date-picker-panel .p-datepicker-day-selected),
:deep(.audit-date-picker-panel .p-datepicker-day-range-start),
:deep(.audit-date-picker-panel .p-datepicker-day-range-end) {
  background: rgb(13 148 136 / 1);
  color: rgb(255 255 255 / 1);
}

:deep(.audit-date-picker-panel .p-datepicker-day-selected:hover),
:deep(.audit-date-picker-panel .p-datepicker-day-range-start:hover),
:deep(.audit-date-picker-panel .p-datepicker-day-range-end:hover) {
  background: rgb(15 118 110 / 1);
}

@media (max-width: 639px) {
  :global(.audit-date-picker-panel) {
    left: 50% !important;
    width: min(20rem, calc(100vw - 2rem)) !important;
    min-width: min(20rem, calc(100vw - 2rem)) !important;
    max-width: min(20rem, calc(100vw - 2rem)) !important;
    overflow: hidden;
    transform: translateX(-50%) !important;
  }

  :deep(.audit-date-picker-panel .p-datepicker-header) {
    padding: 0.5rem 0.625rem;
  }

  :deep(.audit-date-picker-panel .p-datepicker-title) {
    gap: 0.375rem;
  }

  :deep(.audit-date-picker-panel .p-datepicker-select-month),
  :deep(.audit-date-picker-panel .p-datepicker-select-year) {
    min-height: 1.625rem;
    border-radius: 0.5rem;
    padding: 0.125rem 0.5rem;
    font-size: 0.8rem;
  }

  :deep(.audit-date-picker-panel .p-datepicker-prev-button),
  :deep(.audit-date-picker-panel .p-datepicker-next-button) {
    height: 1.875rem;
    width: 1.875rem;
  }

  :deep(.audit-date-picker-panel .p-datepicker-calendar-container) {
    box-sizing: border-box;
    padding: 0.5rem;
  }

  :deep(.audit-date-picker-panel .p-datepicker-day-view) {
    width: 100%;
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 0 0.25rem;
    font-size: 0.82rem;
  }

  :deep(.audit-date-picker-panel .p-datepicker-weekday-cell),
  :deep(.audit-date-picker-panel .p-datepicker-day-cell) {
    box-sizing: border-box;
    width: 14.285714%;
    padding: 0;
    text-align: center;
  }

  :deep(.audit-date-picker-panel .p-datepicker-day),
  :deep(.audit-date-picker-panel .p-datepicker-weekday) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-inline: auto;
    width: 1.875rem;
    height: 1.875rem;
    font-size: 0.82rem;
  }

  :deep(.audit-date-picker-panel .p-datepicker-buttonbar) {
    gap: 0.375rem;
    padding: 0.625rem;
  }

  :deep(.audit-date-picker-panel .p-datepicker-buttonbar .p-button) {
    min-height: 1.8rem;
    padding-inline: 0.7rem;
    font-size: 0.8rem;
  }
}
</style>
