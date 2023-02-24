/// <reference types="cypress" />

import { terminalLog } from "../accessibility";

Cypress.Commands.add("loginWithFC", (username: string) => {
  cy.get("#social-oidc").click();

  cy.get('body').then(($body: any) => {
    const providerButton = "#fi-identity-provider-example-faible";
    if ($body.find(providerButton).length) {
      cy.get(providerButton).click();
      cy.get(":nth-child(1) > .form-control")
        .clear()
        .type(username);
      cy.get(".button").click();
    }
  })

  cy.get("form").submit();
  cy.wait(100);
});

Cypress.Commands.add("deleteAccount", () => {
  cy.intercept("DELETE", "**/deleteAccount").as("deleteAccount");

  cy.get(".fr-nav__btn").click();
  cy.get("button")
    .contains("Supprimer mon compte")
    .click({ force: true });
  cy.get(".modal")
    .find("button")
    .contains("Supprimer mon compte")
    .click();

  cy.wait("@deleteAccount");
});

Cypress.Commands.add("expectPath", (path: string) => {
  cy.location("pathname").should("contains", path);
});

Cypress.Commands.add("clickOnNext", () => {
  cy.get(".next-btn").click();
});

Cypress.Commands.add("acceptCookies", () => {
  cy.get(".cookie")
    .contains("Accepter")
    .click();
});

Cypress.Commands.add("testAccessibility", () => {
  cy.wait(200);
  cy.injectAxe();
  cy.configureAxe({
    // TODO fix disabled rules
    rules: [
      { id: 'color-contrast', enabled: false },
      { id: 'aria-allowed-attr', enabled: false },
      { id: 'region', enabled: false },
      { id: 'label', enabled: false },
      { id: 'skip-link', enabled: false },
      { id: 'page-has-heading-one', enabled: false },
    ]
  })
  cy.checkA11y(null, null, terminalLog);
});
