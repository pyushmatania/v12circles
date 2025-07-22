import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React and React DOM
          if (id.includes('react') && !id.includes('react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('react-dom')) {
            return 'react-vendor';
          }
          
          // Framer Motion - keep it separate and ensure it's not tree-shaken
          if (id.includes('framer-motion')) {
            return 'framer-motion';
          }
          
          // Other animation libraries
          if (id.includes('canvas-confetti')) {
            return 'animation-vendor';
          }
          
          // Admin-related chunks
          if (id.includes('admin') || id.includes('Admin')) {
            return 'admin-vendor';
          }
          
          // Dashboard-related chunks
          if (id.includes('dashboard') || id.includes('Dashboard')) {
            return 'dashboard-vendor';
          }
          
          // Project-related chunks
          if (id.includes('project') || id.includes('Project')) {
            return 'project-vendor';
          }
          
          // Default vendor chunk for other dependencies
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'lucide-react',
      'canvas-confetti'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
})

