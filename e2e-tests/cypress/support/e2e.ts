// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import "./commands/global";
import "./commands/tenant";
import "./commands/owner";
import "cypress-axe";
import "cypress-wait-until";

function hideXhrRequestLogs() {
  const app = window.top;
  if (app) {
    const style = app.document.createElement("style");
    style.innerHTML =
      ".command-name-request, .command-name-xhr { display: none }";
    style.setAttribute("data-hide-command-log-request", "");

    app.document.head.appendChild(style);
  }
}

// See pending cypress issue https://github.com/cypress-io/cypress/issues/7362
hideXhrRequestLogs();

Cypress.on("uncaught:exception", (err, runnable, promise) => {
  return false;
});
