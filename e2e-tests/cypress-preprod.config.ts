import { defineConfig } from "cypress";
import { log } from "./cypress/support/accessibility";

export default defineConfig({
  e2e: {
    video: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on) {
      on("task", log());
    },
    retries: {
      runMode: 5,
    },
  },
  env: {
    configName: "preprod",
    mainUrl: "www-dev.dossierfacile.fr",
    tenantUrl: "locataire-dev.dossierfacile.fr",
    tenantUser: "thibault",
    ownerUrl: "proprietaire-dev.dossierfacile.fr",
    ownerUser: "william",
  },
  chromeWebSecurity: false,
});
