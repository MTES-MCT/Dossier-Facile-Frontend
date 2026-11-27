import { defineConfig } from "cypress";
import { log } from "./cypress/support/accessibility";
import { forceFrenchLocale } from "./cypress/support/browserLocale";

export default defineConfig({
  fixturesFolder: "assets",
  e2e: {
    video: true,
    defaultCommandTimeout: 10000,
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
    retries: {
      runMode: 5,
    },
    excludeSpecPattern: "**/accessibility.cy.ts",
  },
  expose: {
    configName: "preprod",
    mainUrl: "https://www-preprod.dossierfacile.fr",
    tenantUrl: "https://locataire-preprod.dossierfacile.fr",
    tenantUser: "mario",
    ownerUrl: "https://proprietaire-preprod.dossierfacile.fr",
    ownerUser: "mario",
    testmailTag: "preprod-test",
    testmailEndpoint: "https://api.testmail.app/api/json",
    TESTMAIL_NAMESPACE: "7mxc3",
    boUrl: "https://bo-dev.dossierfacile.fr",
    dfConnectDemoUrl: "https://demo-partenaire.dossierfacile.fr",
  },
  chromeWebSecurity: false,
});
