import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Vercel serves the app from the domain root.
  base: '/',
  server: {
    port: 3000,
    proxy: {
      '/query': { target: 'http://localhost:8000', changeOrigin: true },
      '/stats': { target: 'http://localhost:8000', changeOrigin: true },
      '/samples': { target: 'http://localhost:8000', changeOrigin: true },
      '/upload-csv': { target: 'http://localhost:8000', changeOrigin: true },
      '/session/close': { target: 'http://localhost:8000', changeOrigin: true },
      '/health': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
  preview: {
    port: 3000,
  },
})

