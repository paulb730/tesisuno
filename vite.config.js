import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'fs'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import basicSsl from '@vitejs/plugin-basic-ssl'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    basicSsl()
  ],
  server: {
    https: {
      key: readFileSync(fileURLToPath(new URL('./key.pem', import.meta.url))),
      cert: readFileSync(fileURLToPath(new URL('./cert.pem', import.meta.url)))
    },
    host: '0.0.0.0', // Accesible en la red local
    cors: true,
    port: 3000,
    strictPort: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
    hmr: {
      protocol: 'wss',
      host: 'localhost' // Importante para HMR en red local
    },
    mimeTypes: { '.js': 'application/javascript' },
  },
  build: {
    assetsInlineLimit: 0, // Para asegurar que los modelos y audios no se inlinen
    rollupOptions: {
      output: {
        // Esto ayuda a que los chunks y workers se sirvan bien
        inlineDynamicImports: false,
      },
      external: ['@ar-js-org/ar.js']
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  optimizeDeps: {
    include: ['three', '@ar-js-org/ar.js']
  },
  worker: {
    format: 'es',
  }
})
