import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
    viteCompression({ algorithm: 'gzip', ext: '.gz' }),
    visualizer({ open: false, filename: 'dist/bundle-analysis.html' })
  ],
  
  // Advanced dependency optimization
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'canvas-confetti',
      'gsap',
      'lottie-react',
      'matter-js',
      'react-dropzone',
      'react-table'
    ],
    // Force pre-bundling for better performance
    force: true
  },

  // Elite build configuration
  build: {
    target: 'esnext',
    minify: 'esbuild',
    // Enable CSS code splitting for better caching
    cssCodeSplit: true,
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 800,
    // Disable sourcemaps in production for smaller bundles
    sourcemap: false,
    
    rollupOptions: {
      output: {
        // Advanced manual chunking strategy
        manualChunks: (id) => {
          // Core React chunks
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          
          // Animation libraries
          if (id.includes('framer-motion') || id.includes('gsap') || id.includes('canvas-confetti')) {
            return 'animation-vendor';
          }
          
          // UI and icon libraries
          if (id.includes('lucide-react') || id.includes('lottie-react')) {
            return 'ui-vendor';
          }
          
          // Utility libraries
          if (id.includes('matter-js') || id.includes('react-dropzone') || id.includes('react-table')) {
            return 'utils-vendor';
          }
          
          // Admin-specific chunks (lazy load)
          if (id.includes('admin') || id.includes('Admin')) {
            return 'admin-vendor';
          }
          
          // Project-specific chunks
          if (id.includes('Project') || id.includes('project')) {
            return 'project-vendor';
          }
          
          // Dashboard chunks
          if (id.includes('Dashboard') || id.includes('dashboard')) {
            return 'dashboard-vendor';
          }
        },
        
        // Optimized file naming for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name;
          if (!name) return 'assets/[ext]/[name]-[hash].[ext]';
          
          const info = name.split('.');
          const ext = info[info.length - 1];
          
          // Optimize image assets
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(name)) {
            return `assets/images/[name]-[hash].[ext]`;
          }
          
          // Optimize CSS assets
          if (ext === 'css') {
            return `assets/css/[name]-[hash].[ext]`;
          }
          
          // Default asset handling
          return `assets/[ext]/[name]-[hash].[ext]`;
        }
      },
    },
  },

  // Development optimizations
  server: {
    // Enable HMR with optimized settings
    hmr: {
      overlay: false // Disable error overlay for cleaner dev experience
    }
  },

  // CSS optimizations
  css: {
    // Enable CSS modules for better scoping
    modules: {
      localsConvention: 'camelCase'
    }
  },

  // Performance optimizations
  esbuild: {
    // Remove console logs in production
    drop: ['console', 'debugger'],
    // Optimize for modern browsers
    target: 'esnext'
  }
});
