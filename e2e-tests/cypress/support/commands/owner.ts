/// <reference types="cypress" />

Cypress.Commands.add("ownerLogin", (username: string) => {
  cy.visit(Cypress.env("ownerUrl"));
  cy.contains("Se connecter").click();
  cy.loginWithFC(username);
  cy.visit(Cypress.env("ownerUrl"));
});