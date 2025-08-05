/// <reference types="cypress" />

Cypress.Commands.add(
  "ownerLoginWithFC",
  (username: string, password: string) => {
    cy.visit(Cypress.env("ownerUrl"));
    cy.contains("Se connecter").click();
    cy.loginWithFC(username, password);
    cy.visit(Cypress.env("ownerUrl"));
  }
);
