/// <reference types="cypress" />

Cypress.Commands.add("tenantLogin", (username: string) => {
  cy.visit("www-dev.dossierfacile.fr");
  cy.contains("Se connecter").click();
  cy.loginWithFC(username);
  cy.visit(Cypress.env("tenantUrl"));
});

Cypress.Commands.add("uploadDocument", (numberOfFiles: number = 1) => {
  cy.intercept("POST", "/api/register/document*").as("uploadDocument");
  const files = [...Array(numberOfFiles).keys()].map(_ => "assets/test-document.pdf")
  cy.get(".input-file").selectFile(files);
  cy.wait("@uploadDocument").its('response.statusCode').should('eq', 200);
});

Cypress.Commands.add("disableTaxVerification", () => {
  cy.get(".disallow-btn").click();
  cy.get(".modal")
    .contains("Désactiver la vérification automatique")
    .click();
});

Cypress.Commands.add("simpleUploadDocumentStep", (buttonToSelect: string, waitBeforeNext: number = 0) => {
  cy.contains(buttonToSelect)
    .click()
    .uploadDocument();
  if (waitBeforeNext > 0) {
    cy.wait(waitBeforeNext);
  }
  cy.clickOnNext();
});

Cypress.Commands.add("selectProfessionalStatusStep", (professionalStatus: string) => {
  cy.get("#select")
    .select(professionalStatus)
    .uploadDocument()
    .clickOnNext();
});

Cypress.Commands.add("addFinancialResource", (resourceType: string, monthlySum: string) => {
  cy.contains(resourceType).click();
  cy.get("#monthlySum")
    .type(monthlySum)
    .uploadDocument()
    .clickOnNext();
  cy.get(".fr-tag")
    .contains(resourceType)
    .should("be.visible");
});

Cypress.Commands.add("validationStep", () => {
  cy.disableTaxVerification();

  cy.get('label[for="declaration"]').click();
  cy.get('label[for="declaration2"]').click();

  cy.get("#precision").type("Test");
  cy.contains("Valider mon dossier").click();
});
