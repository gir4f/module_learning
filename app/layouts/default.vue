<template>
  <div class="min-h-screen bg-slate-100">
    <LearningHeader />
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import LearningHeader from '~/components/layout/LearningHeader.vue'
</script>
