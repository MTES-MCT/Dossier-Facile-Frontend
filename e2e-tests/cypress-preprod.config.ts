import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    video: true,
    defaultCommandTimeout: 10000
  },
  env: {
    tenantUrl: "locataire-dev.dossierfacile.fr"
  },
  chromeWebSecurity: false
});
