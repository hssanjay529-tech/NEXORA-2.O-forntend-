import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://nexora-2-o-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'https://nexora-2-o-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
