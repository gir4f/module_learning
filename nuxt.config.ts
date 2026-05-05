export default defineNuxtConfig({
  compatibilityDate: '2026-05-05',
  devtools: { enabled: true },
  srcDir: 'app',
  serverDir: 'server',
  experimental: {
    appManifest: false,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@nuxtjs/supabase',
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
        'FileUpload',
        'InputNumber',
        'InputText',
        'Select',
        'Tag',
        'Textarea',
        'Toast',
        'Toolbar',
      ],
    },
    composables: {
      include: ['useConfirm', 'useToast'],
    },
  },
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'http://127.0.0.1:54321',
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY || 'local-anon-key',
    redirect: false,
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY,
      moduleAssetsBucket: process.env.NUXT_PUBLIC_MODULE_ASSETS_BUCKET || 'module-assets',
    },
  },
  typescript: {
    typeCheck: false,
    strict: true,
  },
})
