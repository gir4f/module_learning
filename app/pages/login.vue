<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-teal text-white">
          <i class="pi pi-lock text-xl" aria-hidden="true" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-black tracking-tight text-slate-900 dark:text-white">Login Internal</h2>
        <p class="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Masuk sebagai admin atau viewer untuk membuka modul pembelajaran internal.
        </p>
      </div>
      <form
        v-auto-animate="{ duration: 170, easing: 'ease-in-out' }"
        method="post"
        action="/api/auth/login"
        class="mt-8 space-y-6"
        @submit.prevent="handleLogin"
      >
        <div class="space-y-4 rounded-md shadow-sm">
          <div>
            <label for="email-address" class="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300">Alamat Email</label>
            <input
              id="email-address"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="relative block w-full appearance-none rounded-lg border border-slate-300 px-3 py-3 text-slate-900 placeholder-slate-500 focus:z-10 focus:border-brand-teal focus:outline-none focus:ring-brand-teal dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 sm:text-sm"
              placeholder="Alamat Email"
            >
          </div>
          <div>
            <label for="password" class="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300">Kata Sandi</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full appearance-none rounded-lg border border-slate-300 px-3 py-3 text-slate-900 placeholder-slate-500 focus:z-10 focus:border-brand-teal focus:outline-none focus:ring-brand-teal dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 sm:text-sm"
              placeholder="Kata Sandi"
            >
          </div>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-950/50 dark:text-red-400">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative flex w-full justify-center rounded-lg border border-transparent bg-brand-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2 disabled:opacity-50 dark:bg-slate-800 dark:hover:bg-brand-teal"
          >
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <i v-if="loading" class="pi pi-spin pi-spinner text-brand-teal-light group-hover:text-cyan-100" />
              <i v-else class="pi pi-sign-in text-brand-teal-light group-hover:text-cyan-100" />
            </span>
            {{ loading ? 'Memeriksa...' : 'Masuk' }}
          </button>
        </div>
      </form>
      <div class="text-center">
        <NuxtLink to="/" class="text-sm font-semibold text-brand-teal hover:text-brand-navy dark:text-cyan-400 dark:hover:text-cyan-200">
          &larr; Kembali ke halaman utama
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { resolvePostLoginRedirect } from '~/utils/authRoutes'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const auth = useAuthStore()
const route = useRoute()

useHead({
  bodyAttrs: {
    class: 'app-shell-admin',
  },
})

definePageMeta({
  layout: false
})

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    const profile = await auth.login(email.value, password.value)
    await navigateTo(resolvePostLoginRedirect(profile, route.query.redirect))
  } catch (err: any) {
    error.value = err.data?.statusMessage || 'Gagal masuk. Periksa kembali email dan password Anda.'
  } finally {
    loading.value = false
  }
}
</script>
