<template>
  <div>
    <NuxtLoadingIndicator color="#0d9488" :height="4" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <Toaster position="top-right" theme="dark" richColors />
      <component :is="ScrollToTop" />
    </ClientOnly>
    <ConfirmDialog :style="{ width: '28rem', maxWidth: '90vw' }" />
  </div>
</template>

<script setup lang="ts">
import ScrollToTop from '~/components/shared/ScrollToTop.vue'
</script>
