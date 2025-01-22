import { sentryVitePlugin } from '@sentry/vite-plugin'
import { fileURLToPath, URL } from 'node:url'
import generateSiteMap from 'vite-ssg-sitemap'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'

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
    port: 9001,
    fs: {
      allow: ['./src', '../df-shared-next', '../node_modules', './node_modules']
    }
  },
  plugins: [
    vue(),
    vueI18n({ strictMessage: false }),
    sentryVitePlugin({
      org: 'betagouv',
      project: 'front-www',
      url: 'https://sentry.incubateur.net'
    })
  ],
  css: {
    preprocessorOptions: {
      scss: { api: 'modern' }
    }
  },
  ssgOptions: {
    onPageRendered: (route: string, renderedHTML: string) => {
      return renderedHTML.replace(/<link rel="modulepreload".*?>/i, '')
    },
    onFinished: () => {
      const baseURL = 'https://' + process.env.VITE_MAIN_URL
      generateSiteMap({ hostname: baseURL })
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
