<template>
  <div class="min-h-screen bg-slate-100">
    <Toast />
    <ConfirmDialog />
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NuxtLink to="/admin/modules" class="text-lg font-semibold text-brand-navy">
          Admin Modul Ajar
        </NuxtLink>
        <nav class="flex items-center gap-3 text-sm">
          <NuxtLink to="/" class="text-slate-600 hover:text-brand-navy">Learner View</NuxtLink>
          <NuxtLink to="/login" class="rounded-md bg-brand-teal px-3 py-2 font-semibold text-white">Login</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>
