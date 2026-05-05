<template>
  <section class="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center px-4 py-12">
    <div class="w-full rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p class="text-sm font-bold uppercase text-brand-teal">Internal Access</p>
      <h1 class="mt-2 text-2xl font-bold text-brand-navy">Login</h1>
      <p class="mt-2 text-sm text-slate-600">
        Sign in with your Supabase account. Admin access is controlled by the Profile role in the database.
      </p>

      <form class="mt-6 grid gap-4" @submit.prevent="loginWithPassword">
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700">Email</span>
          <input v-model.trim="email" type="email" class="rounded-md border border-slate-300 px-3 py-2" required>
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700">Password</span>
          <input v-model="password" type="password" class="rounded-md border border-slate-300 px-3 py-2">
        </label>

        <p v-if="message" class="rounded-md bg-cyan-50 px-3 py-2 text-sm text-brand-navy">{{ message }}</p>
        <p v-if="error" class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>

        <button class="rounded-md bg-brand-teal px-4 py-2 font-semibold text-white disabled:opacity-60" type="submit" :disabled="pending">
          {{ pending ? 'Signing in...' : 'Sign in' }}
        </button>
        <button class="rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-700 disabled:opacity-60" type="button" :disabled="pending || !email" @click="sendMagicLink">
          Send magic link
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const supabase = useSupabaseClient()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const pending = ref(false)
const error = ref('')
const message = ref('')

async function afterLogin() {
  const profile = await auth.fetchProfile()
  await navigateTo(profile?.role === 'ADMIN' ? '/admin/modules' : '/')
}

async function loginWithPassword() {
  pending.value = true
  error.value = ''
  message.value = ''

  try {
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (loginError) throw loginError
    await afterLogin()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed.'
  } finally {
    pending.value = false
  }
}

async function sendMagicLink() {
  pending.value = true
  error.value = ''
  message.value = ''

  try {
    const { error: linkError } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })

    if (linkError) throw linkError
    message.value = 'Magic link sent. Check your email.'
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to send magic link.'
  } finally {
    pending.value = false
  }
}
</script>
