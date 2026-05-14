<template>
  <component
    :is="as"
    class="admin-surface-enter overflow-hidden border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition-colors duration-150 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20"
    :class="[radiusClass, paddingClass]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
const { as = 'div', padded = false, compact = false } = defineProps<{
  as?: string
  padded?: boolean
  compact?: boolean
}>()

const radiusClass = computed(() => compact ? 'rounded-2xl' : 'rounded-[24px]')
const paddingClass = computed(() => padded ? (compact ? 'p-4' : 'p-5 sm:p-6') : '')
</script>
