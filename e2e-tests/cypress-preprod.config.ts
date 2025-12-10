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
    tenantUser: "mario",
    ownerUrl: "https://proprietaire-preprod.dossierfacile.fr",
    ownerUser: "mario",
    testmailTag: "preprod-test",
    testmailEndpoint: "https://api.testmail.app/api/json",
    boUrl: "https://bo-dev.dossierfacile.fr",
    aloneTenantEmail: "ywiwyne-1268@yopmail.com",
  },
  chromeWebSecurity: false,
});
