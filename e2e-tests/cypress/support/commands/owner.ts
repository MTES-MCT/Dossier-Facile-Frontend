/// <reference types="cypress" />

Cypress.Commands.add("ownerLogin", (username: string) => {
  cy.visit("www-dev.dossierfacile.fr");
  cy.contains("Espace propriétaire").click();
  cy.loginWithFC(username);
});