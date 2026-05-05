<template>
  <div v-if="attachments.length" class="space-y-4">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="attachment in imageAttachments"
        :key="attachment.id || attachment.url"
        class="rounded-lg border border-slate-200 bg-white p-3"
      >
        <img
          :src="attachment.url"
          :alt="attachment.title"
          class="aspect-[4/3] w-full rounded-md bg-slate-50 object-contain"
        >
        <p class="mt-3 text-sm font-semibold text-slate-900">{{ attachment.title }}</p>
      </article>
    </div>
    <ul v-if="linkAttachments.length" class="grid gap-2">
      <li
        v-for="attachment in linkAttachments"
        :key="attachment.id || attachment.url"
        class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
      >
        <a :href="attachment.url" target="_blank" rel="noopener noreferrer" class="font-semibold text-brand-navy hover:underline">
          {{ attachment.title }}
        </a>
        <span class="text-xs font-semibold uppercase text-slate-500">{{ attachment.type }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Attachment } from '~/types/learning'

const props = defineProps<{
  attachments: Attachment[]
}>()

const imageAttachments = computed(() => props.attachments.filter((attachment) => attachment.type === 'IMAGE'))
const linkAttachments = computed(() => props.attachments.filter((attachment) => attachment.type !== 'IMAGE'))
</script>
