import { getTenantUser, UserType } from "../../support/users";

describe("alone tenant scenario", () => {
  const user = getTenantUser();

  beforeEach("reset account", () => {
    cy.deleteAccount(user.username, UserType.TENANT);
  });

  it("validate file", () => {
    cy.tenantLogin(user.username);
    cy.acceptCookies();

    cy.expectPath("/profile");
    cy.get("#lastname").should("have.value", user.lastname);
    cy.get("#firstname").should("have.value", user.firstname.toUpperCase());
    cy.clickOnNext();

    cy.expectPath("/type-locataire");
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/1");
    cy.simpleUploadDocumentStep("Autre");

    cy.expectPath("/documents-locataire/2");
    cy.simpleUploadDocumentStep("Locataire");

    cy.expectPath("/documents-locataire/3");
    cy.selectProfessionalStatusStep("CDI");

    cy.expectPath("/documents-locataire/4");
    cy.addFinancialResource("Revenus professionnels", "2000");
    cy.get(".add-income-btn").click();
    cy.addFinancialResource("Rentes", "500");
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/5");
    cy.simpleUploadDocumentStep("Vous avez un avis d’imposition à votre nom");

    cy.expectPath("/choix-garant");
    cy.get("button")
      .contains("Un garant physique")
      .click()
      .clickOnNext();

    cy.expectPath("/info-garant/0");
    cy.get("#lastname").type("Dupont");
    cy.get("#firstname").type("Jean");
    cy.clickOnNext();

    cy.expectPath("/info-garant/1");
    cy.simpleUploadDocumentStep("Passeport");

    cy.expectPath("/info-garant/2");
    cy.simpleUploadDocumentStep("Propriétaire");

    cy.expectPath("/info-garant/3");
    cy.selectProfessionalStatusStep("Retraite");

    cy.expectPath("/info-garant/4");
    cy.addFinancialResource("Pension", "2000");
    cy.clickOnNext();

    cy.expectPath("/info-garant/5");
    cy.simpleUploadDocumentStep("Vous avez un avis d’imposition à votre nom");

    cy.expectPath("/liste-garants");
    cy.contains("Jean Dupont").should("be.visible");
    cy.clickOnNext();

    cy.validationStep();

    cy.get("h1")
      .should("contain", `Bonjour ${user.firstname},`)
      .should("contain", "votre dossier est en cours de traitement !");
  });
});
