<template>
  <NuxtLink to="/admin/audit-logs" class="hidden lg:flex flex-col gap-3 border-t border-slate-200 pt-4 cursor-pointer rounded-lg transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
    <div class="flex items-center justify-between px-4">
      <h3 class="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <i class="pi pi-history text-brand-teal dark:text-cyan-300" aria-hidden="true" />
        Aktivitas Terbaru
      </h3>
      <span class="inline-flex items-center gap-1 text-xs font-bold text-brand-teal dark:text-cyan-300">
        Lihat semua
        <i class="pi pi-arrow-right text-[10px]" aria-hidden="true" />
      </span>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="flex flex-col gap-2 px-4">
      <div v-for="i in 3" :key="i" class="h-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="px-4 text-xs text-slate-500 dark:text-slate-400">
      <p>Gagal memuat aktivitas.</p>
      <button
        class="mt-1 text-brand-teal hover:underline dark:text-cyan-300"
        :disabled="retrying"
        @click="retry"
      >
        Coba lagi
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="items.length === 0" class="px-4 text-xs text-slate-500 dark:text-slate-400">
      Belum ada aktivitas tercatat.
    </div>

    <!-- Entry list -->
    <ul v-else class="flex flex-col gap-2 px-4 pb-4">
      <li v-for="entry in items.slice(0, 14)" :key="entry.id" class="text-xs">
        <div class="flex items-center justify-between gap-2">
          <span class="font-semibold text-slate-700 dark:text-slate-300 truncate">{{ resolveActorDisplay(entry) }}</span>
          <span class="shrink-0 text-[10px] text-slate-400 dark:text-slate-500">{{ formatTime(entry.createdAt) }}</span>
        </div>
        <div class="mt-0.5 truncate text-slate-600 dark:text-slate-400">
          <span class="capitalize">{{ ACTION_VERB_MAP[entry.action] }}</span> {{ ENTITY_TYPE_MAP[entry.entityType] }}
          <span class="font-medium text-brand-navy dark:text-cyan-100">"{{ entry.entityLabel }}"</span>
        </div>
      </li>
    </ul>
  </NuxtLink>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuditLogStore } from '~/stores/auditLog'
import { resolveActorDisplay, ACTION_VERB_MAP, ENTITY_TYPE_MAP } from '~/utils/auditDisplay'
import { timeAgo } from '~/utils/timeAgo'

const store = useAuditLogStore()
const { items, loading, error } = storeToRefs(store)

const retrying = ref(false)

function formatTime(dateString: string): string {
  const result = timeAgo(dateString)
  if (!result || result === '-') return 'Waktu tidak tersedia'
  return result
}

async function retry() {
  retrying.value = true
  await store.fetchRecent(20)
  retrying.value = false
}

onMounted(() => {
  if (window.innerWidth >= 1024) {
    store.fetchRecent(20)
  }
})
</script>
