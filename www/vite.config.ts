import { fileURLToPath, URL } from 'node:url'
import generateSiteMap from 'vite-ssg-sitemap'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 9001,
    fs: {
      allow: [
        './src',
        '../node_modules',
        './node_modules'
      ]
    }
  },
  plugins: [
    vue(),
    vueI18n({})
  ],
  ssgOptions: {
    onFinished: () => {
      generateSiteMap()
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
