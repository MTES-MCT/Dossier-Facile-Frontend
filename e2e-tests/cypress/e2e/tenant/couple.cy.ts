import { getTenantUser, UserType } from "../../support/users";

describe("couple tenant scenario", () => {
  const user = getTenantUser();

  beforeEach("reset account", () => {
    cy.deleteAccount(user.username, UserType.TENANT);
  });

  it("validate file", () => {
    cy.tenantLogin(user.username);

    cy.expectPath("/profile");
    cy.clickOnNext();

    cy.expectPath("/type-locataire");
    cy.contains("En couple").click();
    cy.get('input[name="coTenantLastName"]').type("Martin");
    cy.get('input[name="firstName"]').type("Louise");
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/1");
    cy.simpleUploadDocumentStep("Passeport");

    cy.expectPath("/documents-locataire/2");
    cy.selectResidencyStep("Hébergé par ses parents", 3);

    cy.expectPath("/documents-locataire/3");
    cy.selectProfessionalStatusStep("CDD");

    cy.expectPath("/documents-locataire/4");
    cy.addFinancialResource("Revenus professionnels", "1000");
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/5");
    cy.contains("Vous êtes rattaché fiscalement à vos parents")
      .click()
      .clickOnNext();

    cy.expectPath("/choix-garant");
    cy.contains("Un organisme").click().clickOnNext();

    cy.expectPath("/info-garant/0");
    cy.uploadDocument().clickOnNext();

    cy.expectPath("/liste-garants");
    cy.contains("Mon organisme garant").should("be.visible");
    cy.clickOnNext();

    cy.expectPath("/4/0");
    cy.clickOnNext();

    cy.expectPath("/4/1");
    cy.simpleUploadDocumentStep("Autre");

    cy.expectPath("/4/2");
    cy.selectResidencyStep("Locataire");

    cy.expectPath("/4/3");
    cy.selectProfessionalStatusStep("Études");

    cy.expectPath("/4/4");
    cy.contains("Bourses").click();
    cy.get("#monthlySum").type("2000");
    cy.get("#noDocument").click({ force: true });
    cy.clickOnNext();

    cy.clickOnNext();

    cy.expectPath("/4/5");
    cy.contains("Autre").click();
    cy.get("#customText").type("...");
    cy.clickOnNext();

    cy.expectPath("/garants-locataire");
    cy.contains("Votre conjoint n'a pas de garant").click();
    cy.contains("Continuer").click();

    cy.get('label[for="declaration"]').click();
    cy.get("#precision").type("Test");
    cy.contains("Valider mon dossier").click();

    cy.get("h1")
      .should("contain", `Bonjour ${user.firstname},`)
      .should("contain", "votre dossier de couple est en cours de traitement !");
  });
});
