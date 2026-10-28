/// <reference types="cypress" />

import type { TestAccount } from "../testAccounts";

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
    (_) => "cypress/fixtures/test-document.png",
  );
  cy.get(".input-file").selectFile(files);
  cy.wait(`@${alias}`).its("response.statusCode").should("eq", 200);
  cy.waitUntilStepIsReady();
});

Cypress.Commands.add("waitUntilStepIsReady", () => {
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="next-btn"]').length === 0) {
      return;
    }
    cy.get('[data-cy="next-btn"]', { timeout: 40000 })
      .should("not.be.disabled")
      .and("not.have.attr", "aria-disabled");
  });
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
  cy.get("body").then(($body) => {
    if ($body.find("#input-consent").length) {
      cy.get("#input-consent").check({ force: true });
    }
  });
  cy.contains("Soumettre mon dossier").click();
  // Every submission lands on the dashboard. An opt-in eligible dossier gets the post-submit
  // modal there: close it so that the scenarios never depend on the opt-in rollout
  cy.contains("h1", "Tableau de bord").should("exist");
  cy.closeCompletedFileModalIfPresent();
});

// Post-submit modal of an opt-in eligible dossier: close it when it is displayed so that the
// commands that follow work whether the dossier landed in COMPLETED or in the operator queue
Cypress.Commands.add("closeCompletedFileModalIfPresent", () => {
  cy.get("body").then(($body) => {
    if ($body.find("#modal-completed-file[open]").length) {
      cy.get("#modal-completed-file .fr-btn--close").click();
      cy.get("#modal-completed-file").should("not.have.attr", "open");
    }
  });
});

// Both rollout modes must end with a verification request. Eligible dossiers need
// an explicit opt-in; other dossiers are queued by submission itself.
Cypress.Commands.add("requestFileValidation", () => {
  cy.contains(
    /Faites vérifier votre dossier|Votre demande de vérification est (en cours de traitement|enregistrée)|Dossier en cours de traitement/,
  ).should("be.visible");
  cy.get("body").then(($body) => {
    if (
      $body
        .find("#validation-request")
        .text()
        .includes("Faites vérifier votre dossier")
    ) {
      cy.get("#validation-request")
        .contains("button", "Demander une vérification")
        .click();
    }
  });
  cy.contains(
    /Votre demande de vérification est (en cours de traitement|enregistrée)|Dossier en cours de traitement/,
  ).should("be.visible");
});

Cypress.Commands.add("gotoTenantDocumentsPage", (account: TestAccount) => {
  cy.tenantLogin(account.email, account.password);
  cy.rejectCookies();

  cy.fillTenantIdentity(account.firstname, account.lastname);

  cy.expectPath("/type-locataire");
  cy.clickOnNext();

  cy.expectPath("/documents-locataire/1");
});

// Residency navigation must work with analysis enabled or disabled. Once the
// step is ready, explain any reported errors before continuing.
Cypress.Commands.add("continuePastAnalysis", () => {
  cy.waitUntilStepIsReady();

  cy.get("body").then(($body) => {
    // The explanation must be at least 10 characters long
    if ($body.find(".analysis-error-block").length) {
      cy.get("#explainText").type("explication e2e");
    } else if ($body.find(".analysis-banners").length) {
      cy.get(".explain-link").first().click();
      cy.get("#explainText").should("exist").type("explication e2e");
    }
  });

  cy.clickOnNext();
});

// Documents whose category declares an error strategy (Visale) render AnalysisErrorBlock, which
// embeds the explanation textarea, instead of the AnalysisBanners list and its "explain" link.
Cypress.Commands.add("assertAnalysisErrorAndExplain", (urlFragment: string) => {
  cy.get(".analysis-banners, .analysis-error-block", {
    timeout: 20000,
  }).should("exist");

  cy.get("body").then(($body) => {
    if ($body.find(".analysis-error-block").length) {
      cy.assertAnalysisErrorBlockAndExplain(urlFragment);
    } else {
      cy.assertAnalysisBannersAndExplain(urlFragment);
    }
  });
});

Cypress.Commands.add(
  "assertAnalysisBannersAndExplain",
  (urlFragment: string) => {
    cy.get(".analysis-banners").should("have.focus");
    cy.get(".analysis-banner").should("have.length.at.least", 1);

    cy.get('[data-cy="next-btn"]').should("not.be.disabled");
    cy.get('[data-cy="next-btn"]').click();
    cy.get(".analysis-banners").should("have.focus");
    cy.url().should("include", urlFragment);

    cy.get(".explain-link").first().click();
    cy.get("#explainText").should("exist").and("have.focus");

    cy.get('[data-cy="next-btn"]').click();
    cy.contains("Veuillez décrire votre situation avant de continuer.").should(
      "be.visible",
    );
    cy.get("#explainText").should("have.focus");
    cy.url().should("include", urlFragment);

    cy.get("#explainText").type("explication e2e");

    cy.get('[data-cy="next-btn"]').click();
    cy.url().should("not.include", urlFragment);
  },
);

Cypress.Commands.add(
  "assertAnalysisErrorBlockAndExplain",
  (urlFragment: string) => {
    cy.get(".analysis-error-block").should("have.focus");
    cy.get(".analysis-error-header-title").should("be.visible");

    // Submitting without an explanation keeps the tenant on the step and
    // focuses the explanation field
    cy.get('[data-cy="next-btn"]').should("not.be.disabled");
    cy.get('[data-cy="next-btn"]').click();
    cy.contains("Veuillez décrire votre situation avant de continuer.").should(
      "be.visible",
    );
    cy.get("#explainText").should("have.focus");
    cy.url().should("include", urlFragment);

    cy.get("#explainText").type("explication e2e");
    cy.get('[data-cy="next-btn"]').click();
    cy.url().should("not.include", urlFragment);
  },
);
