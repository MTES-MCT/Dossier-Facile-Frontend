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
    configName: "local",
    mainUrl: "localhost:9001",
    tenantUrl: "localhost:9002",
    tenantUser: "elsa",
    ownerUrl: "localhost:3000",
    ownerUser: "laurent",
  },
  chromeWebSecurity: false
});
