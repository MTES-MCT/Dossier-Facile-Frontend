/// <reference types="cypress" />

import type { User } from "../users";

Cypress.Commands.add(
  "tenantLoginWithFC",
  (username: string, password: string) => {
    cy.visit(Cypress.env("tenantUrl"));
    cy.contains("Espace locataire").click();
    cy.loginWithFC(username, password);
  },
);

Cypress.Commands.add(
  "verifyTenantIdentity",
  (firstname: string, lastname: string) => {
    cy.get("#lastname").should(($input) => {
      const value = $input.val();
      expect(value).to.be.oneOf([lastname, lastname.toUpperCase()]);
    });

    cy.get("#firstName").should(($input) => {
      const value = $input.val();
      expect(value).to.be.oneOf([firstname, firstname.toUpperCase()]);
    });
  },
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
    alias,
  );
  const files = [...Array(numberOfFiles).keys()].map(
    (_) => "assets/test-document.png",
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
    { interval: 100, timeout: 10000 },
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
  },
);

Cypress.Commands.add(
  "selectResidencyStep",
  (residencyLabel: string, step2Label?: string, numberOfFiles = 1) => {
    cy.contains(residencyLabel).click();
    if (step2Label) {
      cy.contains(step2Label).click();
    }
    cy.uploadDocument(numberOfFiles).clickOnNext();
  },
);

Cypress.Commands.add(
  "selectProfessionalStatusStep",
  (professionalStatus: string) => {
    cy.contains(professionalStatus).click();
    cy.uploadDocument().clickOnNext();
  },
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
  },
);

Cypress.Commands.add("validationStep", () => {
  cy.get('[name="message"]').type("Test");
  cy.get("#input-honor").check({ force: true });
  cy.get("#input-consent").check({ force: true });
  cy.contains("Soumettre mon dossier").click();
});

Cypress.Commands.add(
  "gotoTenantDocumentsPage",
  (user: User) => {
    cy.tenantLoginWithFC(user.username, user.password);
    cy.rejectCookies();

    cy.contains("Pour vous").click();
    cy.verifyTenantIdentity(user.firstname, user.lastname);
    cy.clickOnNext();

    cy.expectPath("/type-locataire");
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/1");
  },
);

Cypress.Commands.add(
  "assertAnalysisErrorAndExplain",
  (urlFragment: string) => {
    cy.get(".analysis-banners", { timeout: 20000 }).should("exist");
    cy.get(".analysis-banners").should("have.focus");
    cy.get(".analysis-banner").should("have.length.at.least", 1);

    cy.get('[data-cy="next-btn"]').should("not.be.disabled");
    cy.get('[data-cy="next-btn"]').click();
    cy.get(".analysis-banners").should("have.focus");
    cy.url().should("include", urlFragment);

    cy.get(".explain-link").first().click();
    cy.get("#explainText").should("exist").and("have.focus");

    cy.get('[data-cy="next-btn"]').click();
    cy.get(".fr-error-text").should("be.visible");
    cy.get("#explainText").should("have.focus");
    cy.url().should("include", urlFragment);

    cy.get("#explainText").type("test");

    cy.get('[data-cy="next-btn"]').click();
    cy.url().should("not.include", urlFragment);
  },
);
