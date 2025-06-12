import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: { // Add server configuration
    proxy: { // Add proxy configuration
      '/auzan-proteinmart': { // Requests starting with /auzan-proteinmart
        target: 'http://localhost:5000', // Will be forwarded to http://localhost:5000
        changeOrigin: true, // Helps with virtual hosted sites
        rewrite: (path) => path.replace(/^\/auzan-proteinmart/, '/auzan-proteinmart'), // Rewrite path (optional, but good practice) - keep the /auzan-proteinmart path for the backend router
      },
    }
  }
})