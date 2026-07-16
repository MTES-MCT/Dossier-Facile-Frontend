import { defineConfig } from "cypress";
import { log } from "./cypress/support/accessibility";
import { forceFrenchLocale } from "./cypress/support/browserLocale";

export default defineConfig({
  e2e: {
    video: false,
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 5000,
    setupNodeEvents(on) {
      on("before:browser:launch", (browser, launchOptions) => {
        forceFrenchLocale(browser, launchOptions);
        return launchOptions;
      });
      on("task", {
        ...log(),
      });
    },
  },
  env: {
    configName: "local",
    mainUrl: "http://localhost:9001",
    tenantUrl: "http://localhost:9002",
    tenantUser: "elsa",
    ownerUrl: "http://localhost:3000",
    ownerUser: "laurent",
    boUrl: "http://localhost:8081",
    TESTMAIL_NAMESPACE: "local",
  },
  viewportWidth: 1200,
  viewportHeight: 800,
  chromeWebSecurity: false,
});
