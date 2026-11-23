import { defineConfig } from 'cypress'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'

export default defineConfig({
  video: false,
  component: {
    specPattern: 'cypress/component/**/*.cy.ts',
    supportFile: 'cypress/support/component.ts',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: {
        // Use the app's compiler and translations, without starting main.ts or auth.
        configFile: false,
        cacheDir: 'node_modules/.vite-cypress',
        plugins: [vue(), vueI18n({ strictMessage: false })],
        resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }
      }
    }
  }
})
