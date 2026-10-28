import { defineConfig } from "cypress";
import {
  installSupportTasks,
  loadPrivateSettings,
  targets,
} from "./cypress/node/settings";

loadPrivateSettings();
export default defineConfig({
  video: true,
  chromeWebSecurity: false,
  blockHosts: ["stats.beta.gouv.fr", "*.crisp.chat"],
  env: {
    ...targets(true),
    configName: "preprod",
    mainUrl: "https://www-preprod.dossierfacile.fr",
    tenantUser: "mario",
    ownerUser: "mario",
    testmailTag: "preprod-test",
    TESTMAIL_NAMESPACE: process.env.DF_E2E_TESTMAIL_NAMESPACE ?? "7mxc3",
    boUrl: "https://bo-dev.dossierfacile.fr",
    dfConnectDemoUrl: "https://demo-partenaire.dossierfacile.fr",
  },
  e2e: {
    specPattern: "cypress/e2e/{tenant,owner,accessibility}/**/*.cy.ts",
    excludeSpecPattern: "cypress/e2e/accessibility/**",
    defaultCommandTimeout: 15_000,
    taskTimeout: 90_000,
    retries: { runMode: 5 },
    setupNodeEvents(on, config) {
      installSupportTasks(on, config);
      return config;
    },
  },
});
