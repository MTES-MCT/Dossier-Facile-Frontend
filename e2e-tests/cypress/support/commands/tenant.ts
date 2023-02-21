/// <reference types="cypress" />

Cypress.Commands.add("tenantLogin", (username: string) => {
  cy.visit("www-dev.dossierfacile.fr");
  cy.contains("Se connecter").click();
  cy.loginWithFC(username);
});

Cypress.Commands.add("uploadDocument", () => {
  cy.intercept("POST", "/api/register/document*").as("uploadDocument");
  cy.get(".input-file").selectFile("assets/test-document.pdf");
  cy.wait("@uploadDocument");
});

Cypress.Commands.add("disableTaxVerification", () => {
  cy.get(".disallow-btn").click();
  cy.get(".modal")
    .contains("Désactiver la vérification automatique")
    .click();
});
