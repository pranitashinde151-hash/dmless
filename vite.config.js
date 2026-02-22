import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  root: './src',
  
  server: {
    // Development server configuration
    port: 5173,
    proxy: {
      // Proxy API calls to Express backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: false,
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
})
