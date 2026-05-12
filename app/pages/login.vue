<template>
  <section class="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center px-3 py-8 sm:px-4 sm:py-12">
    <div class="w-full rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-colors duration-150 dark:bg-slate-900 dark:ring-slate-800 sm:p-6">
      <p class="text-xs font-black uppercase tracking-[0.16em] text-brand-teal dark:text-cyan-300">Internal Access</p>
      <h1 class="mt-2 text-2xl font-black text-brand-navy dark:text-cyan-200">Login</h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Sign in with your internal learning module account.
      </p>

      <form class="mt-6 grid gap-4" @submit.prevent="loginWithPassword">
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
          <input v-model.trim="email" type="email" class="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition duration-150 focus:border-brand-teal focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-cyan-950" required autocomplete="email">
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</span>
          <input v-model="password" type="password" class="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition duration-150 focus:border-brand-teal focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-cyan-950" required autocomplete="current-password">
        </label>

        <p v-if="auth.error" class="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-100">{{ auth.error }}</p>

        <button class="min-h-11 rounded-xl bg-brand-teal px-4 py-2 font-black text-white transition duration-150 hover:bg-brand-teal-dark active:scale-[0.99] disabled:opacity-60" type="submit" :disabled="auth.pending">
          {{ auth.pending ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const email = ref('')
const password = ref('')

async function loginWithPassword() {
  try {
    await auth.login(email.value, password.value)
    await navigateTo('/admin/modules')
  } catch {
    // The store owns the user-facing error message.
  }
}
</script>
