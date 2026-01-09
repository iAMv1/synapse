import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase warning limit (default is 500kb)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching and smaller initial bundle
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Animation libraries
          'vendor-animation': ['framer-motion'],
          // UI utilities
          'vendor-ui': ['lucide-react', 'clsx', 'date-fns'],
          // Data fetching & state
          'vendor-data': ['@tanstack/react-query', 'zustand'],
          // Supabase
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
  // Optimize CSS
  css: {
    devSourcemap: true,
  },
})

