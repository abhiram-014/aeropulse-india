import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Charting library (~553 KB raw, kept as single chunk)
          'vendor-recharts': ['recharts'],
          // Map library
          'vendor-leaflet': ['leaflet', 'react-leaflet'],
          // Icon library
          'vendor-lucide': ['lucide-react'],
        }
      }
    }
  }
});
