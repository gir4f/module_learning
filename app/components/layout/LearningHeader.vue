<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex items-center gap-3">
        <img class="h-12 w-auto" :src="'/module-assets/Gitronikbgputih.jpg'" alt="PT. Gitronik Dimindo Indonesia">
        <span class="hidden text-sm font-semibold text-slate-700 sm:inline">Learning Modules</span>
      </NuxtLink>
      <nav class="flex items-center gap-3 text-sm">
        <NuxtLink to="/" class="font-medium text-slate-600 hover:text-brand-navy">Modules</NuxtLink>
        <NuxtLink to="/admin/modules" class="rounded-md bg-brand-teal px-3 py-2 font-semibold text-white">
          Admin
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
