import {
  loginWithPassword,
  registerTenant,
  setKeycloakPasswordIfRequested,
} from "../auth";
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
  registerTenant({ email, password });
});

Cypress.Commands.add("tenantLogin", (email: string, password: string) => {
  loginWithPassword({ email, password });
});

Cypress.Commands.add("setPasswordIfRequested", (password: string) => {
  setKeycloakPasswordIfRequested(password);
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
