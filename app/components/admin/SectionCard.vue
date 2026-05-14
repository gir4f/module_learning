<template>
  <article class="group rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-brand-teal hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <button type="button" class="flex min-w-0 flex-1 gap-3 text-left" @click="$emit('edit', section)">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-brand-navy-light text-brand-navy dark:bg-slate-800 dark:text-cyan-200">
          <i class="pi pi-file-edit" aria-hidden="true" />
        </span>
        <span class="min-w-0">
          <span class="flex flex-wrap items-center gap-2">
            <span class="truncate text-base font-black text-slate-950 dark:text-white">{{ section.title }}</span>
            <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[0.68rem] font-black uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              #{{ section.sortOrder }}
            </span>
          </span>
          <span class="mt-1 block break-all text-xs font-semibold text-slate-500 dark:text-slate-400">/{{ section.slug }}</span>
          <span class="mt-2 line-clamp-2 block text-sm leading-6 text-slate-600 dark:text-slate-300">
            {{ section.summary || 'No summary yet. Add one so learners can scan this section faster.' }}
          </span>
        </span>
      </button>

      <div class="flex shrink-0 flex-wrap gap-1 lg:justify-end">
        <Button icon="pi pi-arrow-up" text rounded severity="secondary" :disabled="isFirst" aria-label="Move section up" @click="$emit('move', -1)" />
        <Button icon="pi pi-arrow-down" text rounded severity="secondary" :disabled="isLast" aria-label="Move section down" @click="$emit('move', 1)" />
        <Button icon="pi pi-copy" text rounded severity="secondary" aria-label="Duplicate section" @click="$emit('duplicate', section)" />
        <Button icon="pi pi-pencil" text rounded aria-label="Edit section" @click="$emit('edit', section)" />
        <Button icon="pi pi-trash" text rounded severity="danger" aria-label="Delete section" @click="$emit('delete', section)" />
      </div>
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-4">
      <div class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
        <p class="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">Components</p>
        <p class="mt-1 text-lg font-black text-slate-950 dark:text-white">{{ section.components.length }}</p>
      </div>
      <div class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
        <p class="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">Attachments</p>
        <p class="mt-1 text-lg font-black text-slate-950 dark:text-white">{{ section.attachments.length }}</p>
      </div>
      <div class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800 sm:col-span-2">
        <div class="flex items-center justify-between gap-3">
          <p class="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{{ health.label }}</p>
          <p class="text-xs font-black text-slate-500 dark:text-slate-300">{{ health.score }}%</p>
        </div>
        <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div class="h-full rounded-full" :class="health.barClass" :style="{ width: `${health.score}%` }" />
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ModuleDetail } from '~/types/learning'

defineProps<{
  section: ModuleDetail
  health: { score: number, label: string, barClass: string }
  isFirst?: boolean
  isLast?: boolean
}>()

defineEmits<{
  edit: [section: ModuleDetail]
  duplicate: [section: ModuleDetail]
  delete: [section: ModuleDetail]
  move: [direction: -1 | 1]
}>()
</script>
