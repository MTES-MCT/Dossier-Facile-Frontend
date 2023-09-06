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
    excludeSpecPattern: "**/accessibility.cy.ts"
  },
  env: {
    configName: "preprod",
    mainUrl: "https://www-dev.dossierfacile.fr",
    tenantUrl: "https://locataire-dev.dossierfacile.fr",
    tenantUser: "thibault",
    ownerUrl: "https://proprietaire-dev.dossierfacile.fr",
    ownerUser: "william",
  },
  chromeWebSecurity: false,
});
