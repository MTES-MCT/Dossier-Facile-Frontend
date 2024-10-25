import { fileURLToPath, URL } from 'node:url'
import generateSiteMap from 'vite-ssg-sitemap'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

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
    port: 9001,
    fs: {
      allow: ['./src', '../df-shared-next', '../node_modules', './node_modules']
    }
  },
  plugins: [vue(), vueI18n({})],
  css: {
    preprocessorOptions: {
      scss: { api: 'modern' }
    }
  },
  ssgOptions: {
    onFinished: () => {
      const baseURL = 'https://' + process.env.VITE_MAIN_URL
      generateSiteMap({ hostname: baseURL })
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  ssr: {
    noExternal: [/vue3-cookies/]
  }
})
