import { sentryVitePlugin } from '@sentry/vite-plugin'
import { fileURLToPath, URL } from 'node:url'
import generateSiteMap from 'vite-ssg-sitemap'
import pluginPurgeCss from 'vite-plugin-purgecss-updated-v5'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'

import { createRobotsTxtPlugin } from '../df-shared-next/src/plugin/robots'

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
      allow: ['./src', '../df-shared-next', '../node_modules', './node_modules', 'index.html']
    }
  },
  plugins: [
    vue(),
    createRobotsTxtPlugin(),
    vueI18n({ strictMessage: false }),
    pluginPurgeCss({
      variables: true,
      content: [`./public/**/*.html`, `./src/**/*.vue`, `../df-shared-next/src/**/*.vue`],
      defaultExtractor(content) {
        const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '')
        return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]/g) || []
      },
      safelist: {
        deep: [
          /-(leave|enter|appear)(-(to|from|active))?$/,
          /^(?!(.*?:)?cursor-move).+-move$/,
          /^router-link(-exact)?-active$/,
          /data-v-.*/
        ]
      }
    }),
    sentryVitePlugin({
      org: 'betagouv',
      project: 'front-www',
      url: 'https://sentry.incubateur.net'
    })
  ],
  ssgOptions: {
    onPageRendered: (route: string, renderedHTML: string) => {
      return renderedHTML.replace(/<link rel="modulepreload".*?>/i, '')
    },
    onFinished: () => {
      const baseURL = 'https://' + process.env.VITE_MAIN_URL
      if (process.env.VITE_ENVIRONMENT === 'prod') {
        generateSiteMap({ hostname: baseURL })
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@icons': fileURLToPath(new URL('./src/assets/icons', import.meta.url)),
      '@images': fileURLToPath(new URL('./src/assets/images', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url))
    }
  }
})
