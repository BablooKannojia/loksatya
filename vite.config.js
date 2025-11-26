
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import builder from "vite-plugin-builder";

export default defineConfig({
  plugins: [
    react(),
    builder({
      serverEntry: "server/main.js",
      serverConfig: {
        define: {
          "BUILD.BASE": '"/"',
          "BUILD.BASE_API": '"/api"',
          "BUILD.STATIC_DIR": '"public"',
          "BUILD.SERVER_IP": '"0.0.0.0"',
          "BUILD.SERVER_PORT": "3001",
        },
      },
    }),
  ],

  build: {
    minify: 'esbuild',
    target: 'es2015',

    // Add these optimizations
    // sourcemap: false, // Disable source maps in production

    // ESBuild specific minification options
    esbuild: {
      pure: ['console.log', 'console.debug', 'console.info'],
      legalComments: 'none',
    },
    rollupOptions: {
      output: {
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
    chunkSizeWarningLimit: 1000,
  },

  server: {
    host: true,
  },
  
  css: {
    devSourcemap: false,
    // CSS minification through build
    modules: {
      localsConvention: 'camelCase',
    },
  },
  
  assetsInclude: ["**/*.PNG"],
});