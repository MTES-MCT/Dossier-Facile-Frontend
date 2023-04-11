import { defineConfig } from "cypress";
import { log } from "./cypress/support/accessibility";

export default defineConfig({
  e2e: {
    video: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on) {
      on("task", log());
    }
  },
  env: {
    tenantUrl: "locataire-dev.dossierfacile.fr",
    tenantUser: "thibault",
    ownerUser: "william",
  },
  chromeWebSecurity: false
});
