import Aura from '@primeuix/themes/aura'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: false },
  experimental: {
    appManifest: false,
    viewTransition: true,
  },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    '@primevue/nuxt-module',
    '@formkit/auto-animate/nuxt',
    '@nuxt/image',
  ],
  css: [
    'primeicons/primeicons.css',
    '~/assets/css/main.css',
  ],
  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'primevue',
            order: 'base, primevue, theme, components, utilities',
          },
        }
      }
    },
    components: {
      include: [
        'Button',
        'Card',
        'Column',
        'ConfirmDialog',
        'DataTable',
        'Dialog',
        'Drawer',
        'FileUpload',
        'InputNumber',
        'InputText',
        'Menu',
        'Popover',
        'ProgressBar',
        'Select',
        'Skeleton',
        'Tag',
        'Tab',
        'TabList',
        'TabPanel',
        'TabPanels',
        'Tabs',
        'Textarea',
        'ToggleSwitch',
        'Toast',
        'Toolbar',
      ],
    },
    composables: {
      include: ['useConfirm', 'useToast'],
    },
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    sessionSecret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    public: {
    },
  },
  typescript: {
    typeCheck: false,
    strict: true,
  },
})
