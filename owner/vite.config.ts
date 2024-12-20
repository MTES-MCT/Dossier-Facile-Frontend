import { sentryVitePlugin } from '@sentry/vite-plugin'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import { fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    assetsInlineLimit: (file) => {
      if (file.endsWith('.svg')) {
        return false
      }
      // When this returns undefined, the default behaviour is used: inline only if size < 4k
    },

    sourcemap: true
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
  plugins: [
    vue(),
    vueI18n({ strictMessage: false }),
    sentryVitePlugin({
      org: 'betagouv',
      project: 'front-owner',
      url: 'https://sentry.incubateur.net'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
