import { defineConfig } from "cypress";
import { log } from "./cypress/support/accessibility";
import { forceFrenchLocale } from "./cypress/support/browserLocale";

export default defineConfig({
  fixturesFolder: "assets",
  e2e: {
    video: false,
    defaultCommandTimeout: 5000,
    setupNodeEvents(on, config) {
      // CI supplies the public mailbox namespace through CYPRESS_TESTMAIL_NAMESPACE.
      if (config.env.TESTMAIL_NAMESPACE) {
        config.expose.TESTMAIL_NAMESPACE = config.env.TESTMAIL_NAMESPACE;
      }
      on("before:browser:launch", (browser, launchOptions) => {
        forceFrenchLocale(browser, launchOptions);
        return launchOptions;
      });
      on("task", {
        ...log(),
      });
      return config;
    },
  },
  expose: {
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
