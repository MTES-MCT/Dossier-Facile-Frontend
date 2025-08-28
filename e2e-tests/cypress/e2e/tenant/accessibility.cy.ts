import { getTenantUser, UserType } from "../../support/users";

describe("accessibility checks", () => {
  const user = getTenantUser();

  beforeEach("reset account", () => {
    cy.loginWithFCAndDeleteAccount(
      user.username,
      user.password,
      UserType.TENANT
    );
  });

  it("funnel accessibility", () => {
    cy.tenantLoginWithFC(user.username, user.password);
    cy.rejectCookies();
    cy.contains("Pour vous").click();
    cy.testAccessibility();
    cy.clickOnNext();

    cy.expectPath("/type-locataire");
    cy.testAccessibility();
    cy.clickOnNext();

    cy.testAccessibility();
    cy.simpleUploadDocumentStep("Passeport");

    cy.testAccessibility();
    cy.selectResidencyStep(
      "Locataire",
      "Vous avez vos 3 dernières quittances de loyer",
      3
    );

    cy.testAccessibility();
    cy.selectProfessionalStatusStep("CDI");

    cy.testAccessibility();
    cy.addFinancialResource(
      ["Revenus du travail", "salarié", "Depuis moins de 3 mois"],
      "2000"
    );

    cy.testAccessibility();
    cy.clickOnNext();

    cy.testAccessibility();
    cy.contains("Vous avez un avis d’impôt").click();
    cy.simpleUploadDocumentStep("un avis d’impôt français");

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
    cy.addFinancialResource(
      ["Retraite ou autre pension", "une pension alimentaire"],
      "2000"
    );

    cy.testAccessibility();
    cy.clickOnNext();

    cy.testAccessibility();
    cy.contains("Votre garant a un avis d’impôt").click();
    cy.simpleUploadDocumentStep("un avis d’impôt français");

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
