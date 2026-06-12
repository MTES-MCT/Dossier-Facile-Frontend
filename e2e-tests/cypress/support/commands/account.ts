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

// Marks the Keycloak account as verified, replacing the verification email
Cypress.Commands.add("verifyUserEmail", (email: string) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("boUrl")}/api/testing/user/${email}/verify-email`,
  })
    .its("status")
    .should("eq", 200);
});

Cypress.Commands.add("signupTenant", (email: string, password: string) => {
  cy.visit(Cypress.env("tenantUrl") + "/login");
  cy.contains("S'inscrire").click();
  cy.expectPath("/registration");
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get("#acceptCgu").check({ force: true });
  cy.get("input[type=submit]").click();
  cy.location("pathname").should("not.include", "/registration");
});

Cypress.Commands.add("tenantLogin", (email: string, password: string) => {
  // Drop any pending Keycloak auth session (left by the signup flow) so the
  // login form is always displayed
  cy.clearAllCookies();
  cy.visit(Cypress.env("tenantUrl") + "/login");
  cy.get('input[name="username"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get("input[type=submit]").click();
});

// Recreates the account from scratch without logging in
Cypress.Commands.add("createTestAccount", (account: TestAccount) => {
  cy.resetTestAccount(account.email);
  cy.signupTenant(account.email, account.password);
  cy.verifyUserEmail(account.email);
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
