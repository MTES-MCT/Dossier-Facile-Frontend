import { defineConfig } from "cypress";
import config from "./cypress.config";

export default defineConfig({
  ...config,
  e2e: {
    ...config.e2e,
    specPattern: "cypress/integration/**/*.cy.ts",
  },
});
