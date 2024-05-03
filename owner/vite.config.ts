import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/vite-plugin-vue-i18n';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    fs: {
      allow: [
        './src',
        '../df-shared-next',
        '../node_modules',
        './node_modules',
      ],
    },
  },
  plugins: [vue(),
    vueI18n({}),
  ],
});
