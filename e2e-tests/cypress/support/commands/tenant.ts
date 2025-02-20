/// <reference types="cypress" />

Cypress.Commands.add("tenantLogin", (username: string) => {
  cy.visit(Cypress.env("tenantUrl"));
  cy.contains("Se connecter").click();
  cy.loginWithFC(username);
  cy.visit(Cypress.env("tenantUrl"));
});

let uploadCount = 0;

Cypress.Commands.add("uploadDocument", (numberOfFiles: number = 1) => {
  const alias = "uploadDocument" + uploadCount++;
  cy.intercept("POST", /.*\/api\/register\/(guarantor[^\/]*\/)?document.*/).as(alias);
  const files = [...Array(numberOfFiles).keys()].map(_ => "assets/test-document.png")
  cy.get(".input-file").selectFile(files);
  cy.wait(`@${alias}`)
    .its('response.statusCode')
    .should('eq', 200);
  cy.waitUntilLoaderIsGone();
});

Cypress.Commands.add("waitUntilModalIsGone", () => {
  cy.waitUntil(
    () => Cypress.$('.modal').length === 0 || Cypress.$('.modal').is(':visible') === false,
    { interval: 100, timeout: 10000 }
  );
});

Cypress.Commands.add("waitUntilLoaderIsGone", () => {
  cy.waitUntil(
    () => Cypress.$('.vld-background').length === 0,
    { interval: 100, timeout: 10000 }
  );
});

Cypress.Commands.add("simpleUploadDocumentStep", (buttonToSelect: string, numberOfFiles: number = 1) => {
  cy.contains(buttonToSelect)
    .click()
    .uploadDocument(numberOfFiles);
  cy.clickOnNext();
});

Cypress.Commands.add("selectResidencyStep", (residencyLabel: string,  step2Label?: string, numberOfFiles = 1) => {
  cy.contains(residencyLabel)
    .click();
  if (step2Label) {
    cy.contains(step2Label).click();
  }
  cy.uploadDocument(numberOfFiles)
    .clickOnNext();
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
  cy.get('label[for="declaration"]').click();
  cy.get('label[for="declaration2"]').click();

  cy.get("#precision").type("Test");
  cy.contains("Valider mon dossier").click();
});
