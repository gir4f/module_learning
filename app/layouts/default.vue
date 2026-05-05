<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-950">
    <LearningHeader />
    <main>
      <slot />
    </main>
    <LearningFooter />
  </div>
</template>

<script setup lang="ts">
import LearningFooter from '~/components/layout/LearningFooter.vue'
import LearningHeader from '~/components/layout/LearningHeader.vue'
</script>
