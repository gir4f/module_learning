<template>
  <div
    class="fixed bottom-5 z-50 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 py-1.5 pl-4 pr-1.5 shadow-xl ring-1 ring-black/5 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/90 dark:ring-white/5 sm:gap-3 sm:py-2 sm:pl-5 sm:pr-2"
    :style="positionStyle"
  >
    <p class="whitespace-nowrap text-xs font-black text-slate-800 dark:text-slate-100 sm:text-sm">
      {{ countLabel ?? `${selectedCount} dipilih` }}
    </p>
    <div class="flex items-center gap-1 sm:gap-1.5">
      <button
        v-for="action in actions"
        :key="action.key"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold shadow-sm transition disabled:opacity-50 sm:px-3 sm:py-1.5 sm:text-xs"
        :class="severityClasses(action.severity)"
        :disabled="busy"
        @click="action.handler()"
      >
        <i :class="[action.icon, 'text-[10px]']" aria-hidden="true" />
        <span class="hidden min-[28rem]:inline">{{ action.label }}</span>
      </button>
      <button
        type="button"
        class="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 dark:hover:bg-slate-700 dark:hover:text-slate-200 sm:h-8 sm:w-8"
        :disabled="busy"
        aria-label="Batal pilih"
        @click="onCancel"
      >
        <i class="pi pi-times text-xs" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

export interface BulkAction {
  key: string
  label: string
  icon: string
  severity?: 'danger' | 'secondary' | 'primary'
  handler: () => void
}

export interface BulkActionPillProps {
  selectedCount: number
  actions: BulkAction[]
  busy?: boolean
  onCancel: () => void
  positionStyle?: CSSProperties
  /** Override the default "{count} dipilih" label, e.g. for progress */
  countLabel?: string
}

const props = withDefaults(defineProps<BulkActionPillProps>(), {
  busy: false,
  positionStyle: undefined,
  countLabel: undefined,
})

function severityClasses(severity?: 'danger' | 'secondary' | 'primary'): string {
  switch (severity) {
    case 'primary':
      return 'bg-brand-teal text-white hover:bg-brand-teal/90'
    case 'danger':
      return 'border border-red-200 bg-white text-red-600 hover:bg-red-50 dark:border-red-800 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/50'
    case 'secondary':
    default:
      return 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
  }
}
</script>

<style scoped>
.bulk-pill-enter-active,
.bulk-pill-leave-active {
  transition: transform 180ms ease-out, opacity 180ms ease-out;
}

.bulk-pill-enter-from,
.bulk-pill-leave-to {
  opacity: 0;
  transform: translateY(0.75rem);
}
</style>
