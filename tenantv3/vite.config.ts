import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es2022',
    assetsInlineLimit: (file) => {
      return (
        !file.endsWith('.svg') &&
        !file.endsWith('.min.js') &&
        !file.endsWith('.woff') &&
        !file.endsWith('.woff2') &&
        !file.endsWith('.ttf') &&
        !file.endsWith('.otf') &&
        !file.endsWith('.eot')
      )
    }
  },
  esbuild: {
    target: 'es2022'
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist'],
    esbuildOptions: {
      target: 'es2022'
    }
  },
  server: {
    port: 9002,
    fs: {
      allow: ['./src', '../node_modules', '../df-shared-next', './node_modules']
    }
  },
  plugins: [vue(), vueI18n({})],
  css: {
    preprocessorOptions: {
      scss: { api: 'modern' }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  }
})
