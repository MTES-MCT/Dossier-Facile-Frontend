/// <reference types="cypress" />

import type { User } from "../users";

Cypress.Commands.add(
  "tenantLoginWithFC",
  (username: string, password: string) => {
    cy.visit(Cypress.env("tenantUrl"));
    cy.contains("Espace locataire").click();
    cy.loginWithFC(username, password);
    cy.visit(Cypress.env("tenantUrl"));
  }
);

Cypress.Commands.add(
  "verifyTenantIdentity",
  (firstname: string, lastname: string) => {
    cy.get("#lastname").should(($input) => {
      const value = $input.val();
      expect(value).to.be.oneOf([lastname, lastname.toUpperCase()]);
    });

    cy.get("#firstname").should(($input) => {
      const value = $input.val();
      expect(value).to.be.oneOf([firstname, firstname.toUpperCase()]);
    });
  }
);

Cypress.Commands.add("verifyErrorToastMessage", (message: string) => {
  cy.get(".toast-container")
    .find(".fr-alert.fr-alert--error")
    .should("be.visible")
    .find("p")
    .should("contain", message);

  // Cliquer sur le bouton de fermeture de l'alerte
  cy.get(".toast-container .fr-alert.fr-alert--error button").click();
});

let uploadCount = 0;

Cypress.Commands.add("uploadDocument", (numberOfFiles: number = 1) => {
  const alias = "uploadDocument" + uploadCount++;
  cy.intercept("POST", /.*\/api\/register\/(guarantor[^\/]*\/)?document.*/).as(
    alias
  );
  const files = [...Array(numberOfFiles).keys()].map(
    (_) => "assets/test-document.png"
  );
  cy.get(".input-file").selectFile(files);
  cy.wait(`@${alias}`).its("response.statusCode").should("eq", 200);
  cy.waitUntilLoaderIsGone();
});

Cypress.Commands.add("waitUntilModalIsGone", () => {
  cy.waitUntil(
    () =>
      Cypress.$(".modal").length === 0 ||
      Cypress.$(".modal").is(":visible") === false,
    { interval: 100, timeout: 10000 }
  );
});

Cypress.Commands.add("waitUntilLoaderIsGone", () => {
  cy.waitUntil(() => Cypress.$(".vld-background").length === 0, {
    interval: 100,
    timeout: 10000,
  });
});

Cypress.Commands.add(
  "simpleUploadDocumentStep",
  (buttonToSelect: string, numberOfFiles: number = 1) => {
    cy.contains(buttonToSelect).click().uploadDocument(numberOfFiles);
    cy.clickOnNext();
  }
);

Cypress.Commands.add(
  "selectResidencyStep",
  (residencyLabel: string, step2Label?: string, numberOfFiles = 1) => {
    cy.contains(residencyLabel).click();
    if (step2Label) {
      cy.contains(step2Label).click();
    }
    cy.uploadDocument(numberOfFiles).clickOnNext();
  }
);

Cypress.Commands.add(
  "selectProfessionalStatusStep",
  (professionalStatus: string) => {
    cy.contains(professionalStatus).click();
    cy.uploadDocument().clickOnNext();
  }
);

Cypress.Commands.add(
  "addFinancialResource",
  (steps: string[], monthlySum: string) => {
    cy.contains(/Déclarer ses ressources|Ajouter une autre ressource/).click();
    for (const step of steps) {
      cy.contains(step).click();
    }
    cy.get('[data-cy="monthlySum"]').type(monthlySum);
    cy.uploadDocument();
    cy.clickOnNext();
  }
);

Cypress.Commands.add("validationStep", () => {
  cy.get('label[for="declaration"]').click();
  cy.get('label[for="declaration2"]').click();

  cy.get("#precision").type("Test");
  cy.contains("Valider mon dossier").click();
});
