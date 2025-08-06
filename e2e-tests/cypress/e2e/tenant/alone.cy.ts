import { getTenantUser, UserType } from "../../support/users";

describe("alone tenant scenario", () => {
  const user = getTenantUser();

  beforeEach("reset account", () => {
    cy.deleteAccount(user.username, UserType.TENANT);
  });

  it("validate file", () => {
    cy.tenantLogin(user.username);
    cy.rejectCookies();

    cy.contains("Pour vous").click();

    cy.get("#lastname").should("have.value", user.lastname);
    cy.get("#firstname").should("have.value", user.firstname.toUpperCase());
    cy.clickOnNext();

    cy.expectPath("/type-locataire");
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/1");
    cy.simpleUploadDocumentStep("Autre");

    cy.expectPath("/documents-locataire/2");
    cy.contains("Autres situations").click();
    cy.contains("En situation précaire").click();
    cy.contains("Vous êtes dans une situation précaire").click();
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/3");
    cy.selectProfessionalStatusStep("CDI");

    cy.expectPath("/documents-locataire/4");

    cy.addFinancialResource(
      ["Revenus du travail", "salarié", "Depuis plus de 3 mois"],
      "2000"
    );
    cy.contains("Nombre de justificatifs insuffisant").should("exist");
    cy.contains("Passer à l’étape suivante").click();

    // Check that updating the monthly income is persisted
    cy.contains("Modifier").click();
    cy.get('[data-cy="monthlySum"]').clear().type("2500{enter}");
    cy.contains("Passer à l’étape suivante").click();
    cy.location("pathname").should("equal", "/documents-locataire/4");
    cy.reload();
    cy.contains("2500€ net mensuel").should("exist");

    cy.addFinancialResource(
      ["Rente", "des revenus locatifs", "Vous avez une quittance"],
      "500"
    );

    cy.contains("Rentes");
    cy.contains("Revenus professionnels");
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/5");
    cy.simpleUploadDocumentStep("Vous avez un avis d’imposition à votre nom");

    cy.expectPath("/choix-garant");
    cy.contains("Une personne").click().clickOnNext();

    createGuarantor("Jean", "Dupont");
    cy.get(".add-guarantor-btn").click();
    createGuarantor("Jeanne", "Dupont");
    cy.clickOnNext();

    cy.validationStep();

    cy.contains("Votre dossier est actuellement en cours de traitement").should(
      "be.visible"
    );
  });
});

function createGuarantor(firstname: string, lastname: string) {
  cy.expectPath("/info-garant/0");
  cy.get("#lastname").clear().type(lastname);
  cy.get("#firstname").clear().type(firstname);
  cy.clickOnNext();

  cy.expectPath("/info-garant/1");
  cy.simpleUploadDocumentStep("Passeport");

  cy.expectPath("/info-garant/2");
  cy.selectResidencyStep("Propriétaire");

  cy.expectPath("/info-garant/3");
  cy.selectProfessionalStatusStep("Retraite");

  cy.expectPath("/info-garant/4");
  cy.addFinancialResource(
    [
      "Retraite ou autre pension",
      "une retraite",
      "Votre garant a un bulletin de pension",
    ],
    "2000"
  );

  cy.clickOnNext();

  cy.expectPath("/info-garant/5");
  cy.simpleUploadDocumentStep("Votre garant a un avis d'imposition à son nom");

  cy.expectPath("/liste-garants");
  cy.get("#step-content")
    .contains([firstname, lastname].join(" "))
    .should("be.visible");
}
