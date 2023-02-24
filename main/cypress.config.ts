import { defineConfig } from "cypress";
import { log } from "../e2e-tests/cypress/support/accessibility";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:9001",
    video: false,
    setupNodeEvents(on) {
      on("task", log());
    }
  }
});
