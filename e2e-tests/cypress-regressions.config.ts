import { defineConfig } from "cypress";
import { AccountFixtures } from "./cypress/node/accounts";
import {
  installSupportTasks,
  loadPrivateSettings,
  resolvedTargets,
  targets,
} from "./cypress/node/settings";

loadPrivateSettings();
const target = targets(process.env.DF_E2E_ENVIRONMENT === "preprod");
export default defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  blockHosts: ["stats.beta.gouv.fr", "*.crisp.chat"],
  retries: 0,
  // As in the functional configs, server authorization is tested with real SSO.
  // This setting does not exercise browser CORS policy.
  chromeWebSecurity: false,
  viewportWidth: 1280,
  viewportHeight: 900,
  env: { ...target, suite: process.env.DF_E2E_SUITE ?? "all" },
  e2e: {
    specPattern: "cypress/e2e/{security,accounts}/**/*.cy.ts",
    defaultCommandTimeout: 15_000,
    requestTimeout: 20_000,
    taskTimeout: 120_000,
    setupNodeEvents(on, config) {
      const suite: unknown = config.env.suite;
      if (suite !== "all" && suite !== "security" && suite !== "accounts")
        throw new Error("Use suite=all, security or accounts.");
      const mailbox = installSupportTasks(on, config);
      const fixtures = new AccountFixtures(
        {
          ...resolvedTargets(config.env),
          tenantClient:
            process.env.DF_E2E_TENANT_CLIENT ??
            "dossier-facile-frontend-localhost",
          ownerClient:
            process.env.DF_E2E_OWNER_CLIENT ?? "dossier-facile-owner",
        },
        mailbox,
      );
      config.specPattern =
        suite === "all"
          ? "cypress/e2e/{security,accounts}/**/*.cy.ts"
          : `cypress/e2e/${suite}/**/*.cy.ts`;
      on("task", fixtures.tasks());
      // Also attempt cleanup if a hook failed before afterEach could run.
      on("after:spec", async () => {
        await fixtures.cleanup();
      });
      on("after:run", async () => {
        await fixtures.cleanup();
      });
      return config;
    },
  },
});
