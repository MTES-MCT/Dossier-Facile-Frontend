import { defineConfig } from "cypress";
import { log } from "./cypress/support/accessibility";

export default defineConfig({
  e2e: {
    video: false,
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 5000,
    setupNodeEvents(on) {
      on("task", log());
    }
  },
  env: {
    tenantUrl: "localhost:9002",
    tenantUser: "elsa",
    ownerUser: "laurent",
  },
  chromeWebSecurity: false
});
