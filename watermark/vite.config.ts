import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueI18n from "@intlify/vite-plugin-vue-i18n";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 9184,
    fs: {
      allow: ["../df-shared-next", ".."],
    },
  },
  css: {
    preprocessorOptions: {
      scss: { api: "modern" },
    },
  },
  plugins: [
    vue(),
    vueI18n({}),
    VitePWA({
      manifest: {
        name: "FiligraneFacile",
        short_name: "FiligraneFacile",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/pwa-icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
