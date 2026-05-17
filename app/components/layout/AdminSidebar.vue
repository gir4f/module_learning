<template>
  <div class="sticky top-0 z-40 w-full lg:static lg:z-auto lg:w-auto">
    <!-- Mobile Top Navbar -->
    <AppTopNavbar mode="admin" class="lg:hidden" />

    <!-- Desktop Sidebar -->
    <aside class="hidden h-screen w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:flex sticky top-0">
      <div class="flex h-16 items-center gap-3 border-b border-slate-200 px-6 dark:border-slate-800">
        <span class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-white p-1 shadow-sm ring-1 ring-slate-900/10 dark:ring-white/10">
          <img :src="logoSrc" alt="" class="h-full w-full object-contain" aria-hidden="true">
        </span>
        <span class="font-black text-brand-navy dark:text-cyan-200">Gitronik Admin</span>
      </div>
      
      <div class="flex flex-1 flex-col justify-between overflow-y-auto p-4">
        <nav class="flex flex-col gap-2">
          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors" :class="isActive(item.to) ? 'bg-brand-teal/10 text-brand-teal dark:bg-cyan-900/20 dark:text-cyan-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900'">
            <i :class="item.icon" />
            {{ item.label }}
          </NuxtLink>
        </nav>
        
        <div class="flex flex-col gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
          <button type="button" class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900" @click="toggleDark">
            <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" />
            {{ isDark ? 'Mode Terang' : 'Mode Gelap' }}
          </button>
          <button type="button" class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30" @click="handleLogout">
            <i class="pi pi-sign-out" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import AppTopNavbar from '~/components/layout/AppTopNavbar.vue'

const route = useRoute()
const auth = useAuthStore()
const { isDark, init, toggle: toggleDark } = useDarkMode()
const logoSrc = '/module-assets/LogoGitronikPolosNoBG.png'

const navItems = [
  { label: 'Modul Ajar', to: '/admin/modules', icon: 'pi pi-book' },
  { label: 'Halaman Modul', to: '/', icon: 'pi pi-external-link' },
]

onMounted(() => {
  init()
})

function isActive(path: string) {
  if (path === '/') return false
  return route.path.startsWith(path)
}

async function handleLogout() {
  await auth.logout()
  await navigateTo('/login')
}
</script>
