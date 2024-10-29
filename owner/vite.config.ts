import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
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
  server: {
    port: 3000,
    fs: {
      allow: ['./src', '../df-shared-next', '../node_modules', './node_modules']
    }
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern' }
    }
  },
  plugins: [vue(), vueI18n({})],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
