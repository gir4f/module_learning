import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import tailwindcss from '@tailwindcss/vite'

const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#10b7c5',
      600: '#078996',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
      950: '#083344'
    },
    success: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
      950: '#042f2e'
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.500}',
          inverseColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}'
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}'
        }
      },
      dark: {
        primary: {
          color: '{primary.400}',
          inverseColor: '#0f172a',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}'
        },
        highlight: {
          background: 'rgba(16, 183, 197, 0.16)',
          focusBackground: 'rgba(16, 183, 197, 0.24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)'
        }
      }
    }
  }
})


export default defineNuxtConfig({
  devtools: { enabled: false },
  sourcemap: {
    client: false,
    server: false,
  },
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
        { rel: 'icon', type: 'image/png', href: '/module-assets/LogoGitronikPolosNoBG.png' },
      ],
      script: [
        {
          innerHTML: `(function(){try{var stored=localStorage.getItem('dark-mode');var prefers=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;if(stored==='true'||(stored===null&&prefers)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})();`,
          tagPosition: 'head',
        },
      ],
    },
    pageTransition: false,
  },
  vite: {
    plugins: [tailwindcss()],
    css: {
      devSourcemap: false,
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (
            warning.code === 'SOURCEMAP_BROKEN'
            && warning.message.includes('Sourcemap is likely to be incorrect')
          ) {
            return
          }

          warn(warning)
        },
      },
    },
  },
  modules: [
    '@pinia/nuxt',
    '@primevue/nuxt-module',
    '@nuxt/image',
    '@formkit/auto-animate/nuxt',
    'vue-sonner/nuxt'
  ],
  nitro: {
    externals: {
      traceOptions: {
        base: process.cwd(),
      },
    },
  },
  css: [
    'primeicons/primeicons.css',
    '~/assets/css/main.css',
  ],
  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: AppPreset,
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
        'ConfirmDialog',
        'Drawer',
        'InputNumber',
        'InputText',
        'Paginator',
        'Select',
        'Textarea',
      ],
    },
    composables: {
      include: ['useConfirm'],
    },
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    sessionSecret: process.env.SESSION_SECRET || 'dev-secret-must-be-at-least-32-characters-long!',
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    public: {
    },
  },
  typescript: {
    typeCheck: false,
    strict: true,
  },
})
