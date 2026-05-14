<template>
  <section class="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8" :class="wide ? 'max-w-[88rem]' : 'max-w-7xl'">
    <slot />
  </section>
</template>

<script setup lang="ts">
const { wide = false } = defineProps<{
  wide?: boolean
}>()
</script>
