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
    excludeSpecPattern: "**/accessibility.cy.ts",
  },
  env: {
    configName: "preprod",
    mainUrl: "https://www-preprod.dossierfacile.fr",
    tenantUrl: "https://locataire-preprod.dossierfacile.fr",
    tenantUser: "thibault",
    ownerUrl: "https://proprietaire-preprod.dossierfacile.fr",
    ownerUser: "william",
    testmailTag: "preprod-test",
    testmailEndpoint: "https://api.testmail.app/api/json",
  },
  chromeWebSecurity: false,
});
