import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true
    }
  },
  build: {
    // Ensure consistent builds
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
