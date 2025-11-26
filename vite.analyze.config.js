import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// Config specifically for bundle analysis without builder plugin
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  build: {
    minify: 'esbuild',
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd', '@ant-design/icons'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'utils-vendor': ['axios', 'moment', 'i18next'],
          'media-vendor': ['react-slick', 'slick-carousel', 'react-player'],
          'icons-vendor': ['react-icons'],
          'editor-vendor': ['@tinymce/tinymce-react', 'jodit-react'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name.split('.').pop();
          if (['css', 'scss'].includes(ext)) {
            return `assets/css/[name]-[hash].${ext}`;
          }
          return `assets/[ext]/[name]-[hash].${ext}`;
        },
      },
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1500,
  },

  css: {
    devSourcemap: false,
  },
  
  assetsInclude: ["**/*.PNG"],
});