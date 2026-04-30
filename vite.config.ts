import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: 'Pomodoro',
        short_name: 'Pomodoro',
        description: 'Minimal Pomodoro timer',
        theme_color: '#1e1e2e',
        background_color: '#1e1e2e',
        display: 'standalone',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
