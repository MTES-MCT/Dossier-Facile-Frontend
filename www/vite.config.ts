import { fileURLToPath, URL } from 'node:url'
import generateSiteMap from 'vite-ssg-sitemap'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 9001
  },
  plugins: [
    vue(),
    vueI18n({})
  ],
  ssgOptions: {
    onFinished: () => {
      const hostname = import.meta.env.VITE_MAIN_URL | 'www.dossierfacile.logement.gouv.fr';
      const baseURL =  `https://`+ hostname;
      generateSiteMap({ hostname: baseURL})
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
