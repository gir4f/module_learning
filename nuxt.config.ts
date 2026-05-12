export default defineNuxtConfig({
  compatibilityDate: '2026-05-05',
  devtools: { enabled: false },
  srcDir: 'app',
  serverDir: 'server',
  experimental: {
    appManifest: false,
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
  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
  ],
  css: [
    'primeicons/primeicons.css',
    '~/assets/css/main.css',
  ],
  primevue: {
    options: {
      ripple: true,
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
