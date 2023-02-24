import {getTenantUser} from "../../support/users";

describe("accessibility checks", () => {
  const username = getTenantUser().username;

  before("reset account", () => {
    cy.tenantLogin(username);
    cy.deleteAccount();
  });

  it("funnel accessibility", () => {
    cy.tenantLogin(username);
    cy.acceptCookies();
    cy.testAccessibility();
    cy.clickOnNext();

    cy.testAccessibility();
    cy.clickOnNext();

    cy.testAccessibility();
    cy.simpleUploadDocumentStep("Passeport");

    cy.testAccessibility();
    cy.simpleUploadDocumentStep("Locataire");

    cy.testAccessibility();
    cy.selectProfessionalStatusStep("CDI");

    cy.testAccessibility();
    cy.addFinancialResource("Revenus professionnels", "2000");

    cy.testAccessibility();
    cy.clickOnNext();

    cy.testAccessibility();
    cy.simpleUploadDocumentStep("Vous avez un avis d’imposition à votre nom");

    cy.testAccessibility();
    cy.get("button")
      .contains("Un garant physique")
      .click()
      .clickOnNext();

    cy.testAccessibility();
    cy.get("#lastname").type("Dupont");
    cy.get("#firstname").type("Jean");
    cy.clickOnNext();

    cy.testAccessibility();
    cy.simpleUploadDocumentStep("Passeport");

    cy.testAccessibility();
    cy.simpleUploadDocumentStep("Propriétaire");

    cy.testAccessibility();
    cy.selectProfessionalStatusStep("Retraité");

    cy.testAccessibility();
    cy.addFinancialResource("Pension", "2000");

    cy.testAccessibility();
    cy.clickOnNext();

    cy.testAccessibility();
    cy.simpleUploadDocumentStep("Vous avez un avis d’imposition à votre nom");

    cy.testAccessibility();
    cy.clickOnNext();

    cy.testAccessibility();
    cy.clickOnNext();

    cy.disableTaxVerification();
    cy.get('label[for="declaration"]').click();
    cy.get('label[for="declaration2"]').click();

    cy.testAccessibility();
    cy.contains("Valider mon dossier").click();

    cy.testAccessibility();
  });
});
