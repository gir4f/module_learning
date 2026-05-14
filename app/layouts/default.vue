<template>
  <div class="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
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

useHead({
  bodyAttrs: {
    class: 'app-shell-learning',
  },
})
</script>
