/// <reference types="cypress" />

import { terminalLog } from "../accessibility";
import { UserType } from "../users";

Cypress.Commands.add("loginWithFC", (username: string) => {
  cy.get("#social-oidc").click();

  cy.get("body").then(($body: any) => {
    const providerButton = "#fi-identity-provider-example-faible";
    if ($body.find(providerButton).length) {
      cy.get(providerButton).click();
      cy.get(":nth-child(1) > .form-control").clear().type(username);
      cy.get(".button").click();
    }
  });

  cy.get("form").submit();
  cy.wait(100);
});

Cypress.Commands.add("deleteAccount", (username: string, type: UserType) => {
  ignoreErrorsOnSsoPage();

  cy.visit(
    type === UserType.TENANT
      ? Cypress.env("tenantUrl")
      : Cypress.env("ownerUrl")
  );
  cy.contains("Se connecter").click();
  cy.loginWithFC(username);

  cy.intercept("DELETE", "**/deleteAccount").as("deleteAccount");

  cy.get(".fr-nav__btn").click();
  cy.get(".fr-nav__link")
    .contains("Supprimer mon compte")
    .click({ force: true });
  cy.get("#modal-delete-account")
    .find("button")
    .contains("Supprimer mon compte")
    .click();

  cy.wait("@deleteAccount").its("response.statusCode").should("eq", 200);
});

Cypress.Commands.add("expectPath", (path: string) => {
  cy.location("pathname").should("contains", path);
});

Cypress.Commands.add("clickOnNext", () => {
  cy.get(".next-btn").click();
});

Cypress.Commands.add("testAccessibility", () => {
  cy.wait(500);
  cy.injectAxe();
  cy.configureAxe({
    // TODO fix disabled rules
    rules: [
      { id: "color-contrast", enabled: false },
      { id: "aria-allowed-attr", enabled: false },
      { id: "duplicate-id-aria", enabled: false },
      { id: "region", enabled: false },
      { id: "label", enabled: false },
      { id: "skip-link", enabled: false },
      { id: "page-has-heading-one", enabled: false },
    ],
  });
  cy.checkA11y(null, null, terminalLog);
});

Cypress.Commands.add("rejectCookies", () => {
  cy.contains("Tout refuser").click();
});

function ignoreErrorsOnSsoPage() {
  if (Cypress.env("configName") === "local") {
    cy.origin("https://sso-preprod.dossierfacile.fr", () => {
      cy.on("uncaught:exception", (_) => {
        return false;
      });
    });
  }
}
