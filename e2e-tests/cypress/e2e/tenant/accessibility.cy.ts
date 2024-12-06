import { getTenantUser, UserType } from "../../support/users";

describe("accessibility checks", () => {
  const username = getTenantUser().username;

  beforeEach("reset account", () => {
    cy.deleteAccount(username, UserType.TENANT);
  });

  it("funnel accessibility", () => {
    cy.tenantLogin(username);
    cy.rejectCookies();
    cy.wait(3000);
    cy.testAccessibility();
    cy.clickOnNext();

    cy.expectPath("/type-locataire");
    cy.testAccessibility();
    cy.clickOnNext();

    cy.testAccessibility();
    cy.simpleUploadDocumentStep("Passeport");

    cy.testAccessibility();
    cy.selectResidencyStep("Locataire", 3);

    cy.testAccessibility();
    cy.selectProfessionalStatusStep("CDI");

    cy.testAccessibility();
    cy.addFinancialResource("Revenus professionnels", "2000");

    cy.testAccessibility();
    cy.clickOnNext();

    cy.testAccessibility();
    cy.simpleUploadDocumentStep("Vous avez un avis d’imposition à votre nom");

    cy.testAccessibility();
    cy.contains("Une personne").click().clickOnNext();

    cy.testAccessibility();
    cy.get("#lastname").type("Dupont");
    cy.get("#firstname").type("Jean");
    cy.clickOnNext();

    cy.testAccessibility();
    cy.simpleUploadDocumentStep("Passeport");

    cy.testAccessibility();
    cy.selectResidencyStep("Propriétaire");

    cy.testAccessibility();
    cy.selectProfessionalStatusStep("Retraite");

    cy.testAccessibility();
    cy.addFinancialResource("Pension", "2000");

    cy.testAccessibility();
    cy.clickOnNext();

    cy.testAccessibility();
    cy.simpleUploadDocumentStep(
      "Votre garant a un avis d'imposition à son nom"
    );

    cy.testAccessibility();
    cy.clickOnNext();

    cy.testAccessibility();
    cy.clickOnNext();

    cy.get('label[for="declaration"]').click();
    cy.get('label[for="declaration2"]').click();

    cy.testAccessibility();
    cy.contains("Valider mon dossier").click();
    cy.wait(300);

    cy.testAccessibility();
  });
});
