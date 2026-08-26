/// <reference types="cypress" />

import type { TestAccount } from "../testAccounts";

// Idempotent reset: deletes the tenant and its Keycloak account if they exist
Cypress.Commands.add("resetTestAccount", (email: string) => {
  cy.request({
    method: "DELETE",
    url: `${Cypress.env("boUrl")}/api/testing/user/${email}`,
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.be.oneOf([200, 404]);
  });
});

Cypress.Commands.add("signupTenant", (email: string, password: string) => {
  cy.visit(Cypress.env("tenantUrl") + "/login");
  cy.contains("S'inscrire").click();
  cy.expectPath("/registration");
  cy.get('input[name="email"]').type(email);
  cy.get("body").then(($body) => {
    // Keycloak only shows a password field here when "Password Validation" is
    // required in the realm's registration flow; otherwise it asks for the
    // password after the confirmation link is opened (setPasswordIfRequested)
    if ($body.find('input[name="password"]').length > 0) {
      cy.get('input[name="password"]').type(password);
    }
  });
  cy.get("#acceptCgu").check({ force: true });
  cy.get("input[type=submit]").click();
  cy.location("pathname").should("not.include", "/registration");
});

Cypress.Commands.add("tenantLogin", (email: string, password: string) => {
  // Drop any pending Keycloak auth session (left by the signup flow) so the
  // login form is always displayed
  cy.clearAllCookies();
  cy.visit(Cypress.env("tenantUrl") + "/login");
  //cy.pause()
  cy.get('input[name="username"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get("input[type=submit]").click();
});

// Fills the Keycloak "update password" screen, which is displayed after the
// confirmation link when the account was created without a password
Cypress.Commands.add("setPasswordIfRequested", (password: string) => {
  cy.get("body").then(($body) => {
    if ($body.find("#password-new").length === 0) {
      cy.log("No password requested: the account already has one");
      return;
    }
    cy.get("#password-new").type(password);
    cy.get("#password-confirm").type(password);
    cy.get("#kc-passwd-update-form").submit();
  });
});

// Recreates the account from scratch without logging in
Cypress.Commands.add("createTestAccount", (account: TestAccount) => {
  cy.resetTestAccount(account.email);
  cy.request({
    method: "POST",
    url: `${Cypress.env("boUrl")}/api/testing/users`,
    body: { email: account.email, password: account.password },
  })
    .its("status")
    .should("eq", 200);
});

// Recreates the account from scratch and leaves the tenant logged in,
// on the first onboarding step
Cypress.Commands.add("createFreshTenant", (account: TestAccount) => {
  cy.createTestAccount(account);
  cy.tenantLogin(account.email, account.password);
  cy.rejectCookies();
});


Cypress.Commands.add(
  "fillTenantIdentity",
  (firstname: string, lastname: string) => {
    cy.contains("Pour vous").click();
    cy.get("#lastname").clear().type(lastname);
    cy.get("#firstName").clear().type(firstname);
    cy.clickOnNext();
  },
);
