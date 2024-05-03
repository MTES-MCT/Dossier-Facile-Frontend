import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 9002,
    fs: {
      allow: [
        './src',
        '../node_modules',
        '../df-shared-next',
        './node_modules'
      ]
    }
  },
  plugins: [
    vue(),
    vueI18n({}),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
