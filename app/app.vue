<template>
  <div>
    <NuxtLoadingIndicator color="#0d9488" :height="4" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toast />
    <ConfirmDialog />
  </div>
</template>
