import { defineConfig } from "cypress";
import {
  installSupportTasks,
  loadPrivateSettings,
  targets,
} from "./cypress/node/settings";

loadPrivateSettings();
export default defineConfig({
  video: false,
  viewportWidth: 1200,
  viewportHeight: 800,
  chromeWebSecurity: false,
  blockHosts: ["stats.beta.gouv.fr", "*.crisp.chat"],
  env: {
    ...targets(),
    configName: "local",
    mainUrl: "http://localhost:9001",
    tenantUser: "elsa",
    ownerUser: "laurent",
    boUrl: "http://localhost:8081",
    TESTMAIL_NAMESPACE: process.env.DF_E2E_TESTMAIL_NAMESPACE ?? "local",
    testmailTag: "local-signup",
  },
  e2e: {
    specPattern: "cypress/e2e/{tenant,owner,accessibility}/**/*.cy.ts",
    defaultCommandTimeout: 15_000,
    taskTimeout: 90_000,
    setupNodeEvents(on, config) {
      installSupportTasks(on, config);
      return config;
    },
  },
});
