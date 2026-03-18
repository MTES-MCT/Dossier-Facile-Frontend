import { sentryVitePlugin } from '@sentry/vite-plugin'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import pluginPurgeCss from 'vite-plugin-purgecss-updated-v5'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'

import { createRobotsTxtPlugin } from '../df-shared-next/src/plugin/robots'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(
        browserslist('baseline widely available with downstream, >= 0.5%')
      ),
      errorRecovery: true
    }
  },
  build: {
    cssMinify: 'lightningcss',
    sourcemap: true,
    assetsInlineLimit: (file) => {
      if (file.endsWith('.svg')) {
        return false
      }
      // When this returns undefined, the default behaviour is used: inline only if size < 4k
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('pdfjs')) return 'pdfjs'
          if (id.includes('vue-pdf')) return 'vue-pdf'
          if (id.includes('@gouvfr/dsfr')) return 'dsfr'
          if (id.includes('node_modules')) return 'vendor'
          if (id.includes('/residency/')) return 'residency'
        }
      }
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
      allow: ['./src', '../node_modules', '../df-shared-next', './node_modules', 'index.html']
    }
  },
  plugins: [
    vue(),
    createRobotsTxtPlugin(),
    vueI18n({ strictMessage: false }),
    pluginPurgeCss({
      variables: false,
      content: [`./dist/**/*.html`, `./src/**/*.vue`, `../df-shared-next/src/**/*.vue`],
      safelist: {
        standard: [/^fr-[a-z]+--/],
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
      project: 'front-tenant',
      url: 'https://sentry.incubateur.net'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  }
})
