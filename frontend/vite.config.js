import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'vite.svg'],
      manifest: {
        name: 'CareerNexus AI',
        short_name: 'CareerNexus AI',
        description: 'AI-Powered Adaptive Learning & Career Ecosystem',
        theme_color: '#6366f1',
        background_color: '#020617',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/vite.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
      devOptions: {
        enabled: false, // Disable in dev to avoid issues
        type: 'module',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
  server: {
    port: 5173,
    open: true,
  },
})
