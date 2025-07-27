import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer for production builds
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    // Gzip compression
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Brotli compression
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'framer-motion'],
          utils: ['gsap', 'canvas-confetti'],
        },
        // Optimize chunk naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name || '')) {
            return `assets/css/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      'framer-motion',
      'gsap',
      'canvas-confetti',
    ],
  },
  // Server configuration for production preview
  server: {
    port: 3000,
    host: true,
  },
  // Preview configuration
  preview: {
    port: 4173,
    host: true,
  },
}); 