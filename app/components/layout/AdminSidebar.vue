<template>
  <div>
    <!-- Mobile Header -->
    <header class="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 lg:hidden">
      <NuxtLink to="/admin/modules" class="flex items-center gap-3">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-navy text-white dark:bg-brand-teal-dark">
          <span class="text-xs font-black">G</span>
        </span>
        <span class="font-black text-brand-navy dark:text-cyan-200">Admin</span>
      </NuxtLink>
      <button type="button" class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400" @click="drawerOpen = true">
        <i class="pi pi-bars" />
      </button>
    </header>

    <!-- Mobile Drawer -->
    <Drawer v-model:visible="drawerOpen" header="Admin Panel" class="!w-72 lg:!hidden" :pt="{ root: { class: 'dark:bg-slate-950' } }">
      <div class="flex h-full flex-col justify-between py-4">
        <nav class="flex flex-col gap-2">
          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="flex items-center gap-3 rounded-xl px-4 py-3 font-bold transition-colors" :class="isActive(item.to) ? 'bg-brand-teal/10 text-brand-teal dark:bg-cyan-900/20 dark:text-cyan-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900'" @click="drawerOpen = false">
            <i :class="item.icon" />
            {{ item.label }}
          </NuxtLink>
        </nav>
        <div class="flex flex-col gap-2">
          <button type="button" class="flex items-center gap-3 rounded-xl px-4 py-3 font-bold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900" @click="toggleDark">
            <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" />
            {{ isDark ? 'Light Mode' : 'Dark Mode' }}
          </button>
          <button type="button" class="flex items-center gap-3 rounded-xl px-4 py-3 font-bold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30" @click="handleLogout">
            <i class="pi pi-sign-out" />
            Logout
          </button>
        </div>
      </div>
    </Drawer>

    <!-- Desktop Sidebar -->
    <aside class="hidden h-screen w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:flex sticky top-0">
      <div class="flex h-16 items-center gap-3 border-b border-slate-200 px-6 dark:border-slate-800">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-navy text-white shadow-sm dark:bg-brand-teal-dark">
          <span class="text-xs font-black">G</span>
        </span>
        <span class="font-black text-brand-navy dark:text-cyan-200">Admin Panel</span>
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
            {{ isDark ? 'Light Mode' : 'Dark Mode' }}
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

const route = useRoute()
const auth = useAuthStore()
const { isDark, init, toggle: toggleDark } = useDarkMode()
const drawerOpen = ref(false)

const navItems = [
  { label: 'Modules', to: '/admin/modules', icon: 'pi pi-book' },
  { label: 'Learner View', to: '/', icon: 'pi pi-external-link' },
]

onMounted(() => {
  init()
})

function isActive(path: string) {
  if (path === '/') return false
  return route.path.startsWith(path)
}

async function handleLogout() {
  drawerOpen.value = false
  await auth.logout()
  await navigateTo('/login')
}
</script>
