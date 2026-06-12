import { defineConfig } from "cypress";
import { log } from "./cypress/support/accessibility";
import { generatePayslipPdf } from "./cypress/tasks/generatePayslipPdf";
import { forceFrenchLocale } from "./cypress/support/browserLocale";

export default defineConfig({
  e2e: {
    video: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on) {
      on("before:browser:launch", (browser, launchOptions) => {
        forceFrenchLocale(browser, launchOptions);
        return launchOptions;
      });
      on("task", {
        ...log(),
        generatePayslipPdf,
      });
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
    TESTMAIL_NAMESPACE: "7mxc3",
    boUrl: "https://bo-dev.dossierfacile.fr",
  },
  chromeWebSecurity: false,
});
