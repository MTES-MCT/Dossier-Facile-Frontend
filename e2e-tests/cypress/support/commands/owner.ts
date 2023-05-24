/// <reference types="cypress" />

Cypress.Commands.add("ownerLogin", (username: string) => {
  cy.visit("proprietaire-dev.dossierfacile.fr");
  cy.contains("Se connecter").click();
  cy.loginWithFC(username);
});