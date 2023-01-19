/// <reference types="cypress" />

Cypress.Commands.add("fillContactForm", () => {
  cy.get("#firstname").type("Louise");
  cy.get("#lastname").type("Martin");
  cy.get("#email").type("louise.martin@mail.fr");
  cy.get("#profile-tenant").click({ force: true });
  cy.get("#subject").type("Demande de support");
  cy.get("#message").type("Bonjour");
  cy.get(".bg-purple > label").click();
});

Cypress.Commands.add("expectLocationContaining", expected => {
  cy.location("pathname").should("contains", expected);
});

Cypress.Commands.add("mockStats", () => {
  cy.intercept("GET", "/api/stats/dossiers/validated", {
    statusCode: 200,
    body: "12345"
  }).as("getStats");
});
