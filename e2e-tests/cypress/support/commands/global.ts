import { continueFranceConnectLogin, dismissCookies } from "../auth";
import type { Realm } from "../types/accounts";
/// <reference types="cypress" />

import { terminalLog } from "../accessibility";
import { UserType } from "../users";

Cypress.Commands.add(
  "loginWithFC",
  (username: string, password: string, realm: Realm = "tenant") => {
    continueFranceConnectLogin({ username, password }, realm);
  },
);

Cypress.Commands.add(
  "loginWithFCAndDeleteAccount",
  (username: string, password: string, type: UserType) => {
    cy.visit(
      type === UserType.TENANT
        ? Cypress.env("mainUrl")
        : Cypress.env("ownerUrl"),
    );
    cy.contains(
      type === UserType.TENANT ? "Espace locataire" : "Se connecter",
    ).click();
    cy.loginWithFC(
      username,
      password,
      type === UserType.TENANT ? "tenant" : "owner",
    );

    cy.intercept("DELETE", "**/deleteAccount").as("deleteAccount");

    if (type === UserType.TENANT) {
      cy.contains("header button", "Supprimer mon compte").click();
    } else {
      cy.get(".fr-nav__btn").click();
      cy.get(".fr-nav__link").contains("Supprimer mon compte").click();
    }
    cy.get("#modal-delete-account")
      .find("button")
      .contains("Supprimer mon compte")
      .click();

    cy.wait("@deleteAccount").its("response.statusCode").should("eq", 200);
  },
);

Cypress.Commands.add("expectPath", (path: string) => {
  cy.location("pathname").should("contains", path);
});

// The next button is disabled while a file is uploading and while the document analysis report is
// being polled (up to 30s on residency steps). Clicking during that window is a no-op, so wait for
// the button to become actionable first.
const NEXT_BTN_TIMEOUT_MS = 40000;

Cypress.Commands.add("clickOnNext", () => {
  cy.get('[data-cy="next-btn"]', { timeout: NEXT_BTN_TIMEOUT_MS }).should(
    "not.be.disabled",
  );
  cy.get('[data-cy="next-btn"]').click();
});

Cypress.Commands.add("testAccessibility", () => {
  cy.wait(500);
  cy.injectAxe();
  cy.checkA11y(undefined, undefined, terminalLog);
});

Cypress.Commands.add("rejectCookies", () => {
  dismissCookies();
});

Cypress.Commands.add("ValidateAloneFile", (email: string) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("boUrl")}/api/testing/tenant/${email}/validate`,
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200);
  });
});

Cypress.Commands.add(
  "declineAloneFile",
  (email: string, messageBody: string, documentCategories: string[] = []) => {
    cy.request({
      method: "POST",
      url: `${Cypress.env("boUrl")}/api/testing/tenant/${email}/decline`,
      body: { messageBody, documentCategories },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  },
);

export function getInputByLabel(label: string) {
  return cy
    .contains(label)
    .invoke("attr", "for")
    .then((id) => cy.get("#" + id));
}
