import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/polymarket-api-docs/learn/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      // Allow serving files from two levels up to access ../docs/polymarket-learn/
      allow: ['../..'],
    },
  },
})
