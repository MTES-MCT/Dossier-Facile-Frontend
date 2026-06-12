import { testAccount } from "../../support/testAccounts";

describe("accessibility checks", () => {
  const account = testAccount("e2e-a11y");

  beforeEach("reset account", () => {
    cy.createTestAccount(account);
  });

  it("funnel accessibility", () => {
    cy.tenantLogin(account.email, account.password);
    cy.rejectCookies();
    cy.contains("Pour vous").click();
    cy.testAccessibility();
    cy.get("#lastname").clear().type(account.lastname);
    cy.get("#firstName").clear().type(account.firstname);
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
      3,
    );

    cy.testAccessibility();
    cy.selectProfessionalStatusStep("CDI");

    cy.testAccessibility();
    cy.addFinancialResource(
      ["Revenus du travail", "salarié", "Depuis moins de 3 mois"],
      "2000",
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
      "2000",
    );

    cy.testAccessibility();
    cy.clickOnNext();

    cy.testAccessibility();
    cy.contains("Votre garant a un avis d’impôt").click();
    cy.simpleUploadDocumentStep("un avis d’impôt français");

    cy.testAccessibility();
    cy.clickOnNext();

    cy.get("#input-honor").check({ force: true });
    cy.get("#input-consent").check({ force: true });

    cy.testAccessibility();
    cy.contains("Soumettre mon dossier").click();
    cy.wait(300);

    cy.testAccessibility();
  });

  it("Sharing page accessibility", () => {
    cy.tenantLogin(account.email, account.password);
    cy.rejectCookies();
    cy.visit(Cypress.env("tenantUrl") + "/partages");
    cy.contains("Vos partages").should("exist");
    cy.get("h2").contains("Vos partages");
    cy.testAccessibility();
  });
});
