import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/app.vue',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1d4f80',
          teal: '#10b7c5',
          ink: '#26323f',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
