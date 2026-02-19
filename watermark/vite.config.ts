import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueI18n from "@intlify/unplugin-vue-i18n/vite";
import { VitePWA } from "vite-plugin-pwa";

import { createRobotsTxtPlugin } from "../df-shared-next/src/plugin/robots";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 9184,
    fs: {
      allow: ["../df-shared-next", ".."]
    }
  },

  plugins: [
    vue(),
    createRobotsTxtPlugin(),
    vueI18n({ strictMessage: true }),
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
            type: "image/png"
          },
          {
            src: "/pwa-icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    }),
    sentryVitePlugin({
      org: "betagouv",
      project: "filigrane-front",
      url: "https://sentry.incubateur.net"
    })
  ],

  build: {
    sourcemap: true
  }
});
