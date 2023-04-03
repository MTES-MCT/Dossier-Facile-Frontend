import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    video: false,
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 5000
  },
  env: {
    tenantUrl: "localhost:9002",
    tenantUser: "elsa",
    ownerUser: "laurent",
  },
  chromeWebSecurity: false
});
