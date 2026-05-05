import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/app.vue',
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    extend: {
      colors: {
        brand: {
          navy: '#1d4f80',
          'navy-light': '#e7f1fb',
          teal: '#10b7c5',
          'teal-dark': '#078996',
          ink: '#26323f',
          dark: {
            navy: '#8dc6ff',
            teal: '#48dce6',
            ink: '#e5edf5',
          },
        },
        category: {
          device: '#10b7c5',
          cable: '#f59e0b',
          accessory: '#64748b',
          sop: '#ef4444',
        },
      },
      animation: {
        'fade-up': 'fade-up 420ms ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-220% 0' },
          '100%': { backgroundPosition: '220% 0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
