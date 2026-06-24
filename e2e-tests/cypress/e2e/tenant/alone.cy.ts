import { getInputByLabel } from "../../support/commands/global";
import { testAccount } from "../../support/testAccounts";

describe("alone tenant scenario", () => {
  const account = testAccount("e2e-alone");

  it("validate file", () => {
    cy.createFreshTenant(account);

    cy.fillTenantIdentity(account.firstname, account.lastname);

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
      "2000",
    );
    cy.contains("Nombre de justificatifs insuffisant").should("exist");
    cy.contains("Passer à l'étape suivante").click();
    // Check that updating the monthly income is persisted
    cy.contains("Modifier").click();
    cy.get('[data-cy="monthlySum"]').clear().type("2500");
    cy.clickOnNext();
    cy.contains("Passer à l'étape suivante").click();
    cy.location("pathname").should("equal", "/documents-locataire/4");
    cy.reload();
    cy.contains("2500€ net mensuel", { timeout: 10000 }).should("exist");

    cy.addFinancialResource(
      ["Rente", "des revenus locatifs", "Vous avez une quittance"],
      "500",
    );

    cy.contains("Rentes");
    cy.contains("Revenus professionnels");
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/5");
    cy.contains("Vous avez un avis d’impôt").click();
    cy.simpleUploadDocumentStep("un avis d’impôt français");

    cy.expectPath("/choix-garant");
    cy.contains("Une personne").click().clickOnNext();

    createGuarantor("Jean", "Dupont");
    cy.get(".add-guarantor-btn").click();
    createGuarantor("Jeanne", "Dupont");

    // Edit the first guarantor's details
    cy.get('button[title="Modifier"]').first().click();
    cy.expectPath("/info-garant/0");
    cy.get("#lastname").clear().type("Durand");
    cy.get("#firstname").clear().type("Jacques");
    cy.clickOnNext();

    cy.visit(Cypress.env("tenantUrl") + "/liste-garants");
    cy.contains("Durand").should("be.visible");

    // Delete the second guarantor; the renamed first one must remain
    cy.get('button[title="Supprimer"]').last().click();
    cy.get("dialog[open]").last().contains("button", "Valider").click();
    cy.get('button[title="Supprimer"]').should("have.length", 1);
    cy.contains("Durand").should("be.visible");

    cy.clickOnNext();

    cy.validationStep();

    cy.contains("Votre dossier est actuellement en cours de traitement").should(
      "be.visible",
    );
  });

  it("share links", () => {
    cy.tenantLogin(account.email, account.password);
    cy.rejectCookies();

    cy.ValidateAloneFile(account.email);

    cy.visit(Cypress.env("tenantUrl") + "/partages");
    cy.contains("Dossier validé", { timeout: 10000 }).should("exist");
    cy.testAccessibility();

    // Generate a full share link (the full file view is protected by a trigram)
    cy.get("#link-title").type("E2E partage");
    getInputByLabel("Contenu du lien partagé").select("full");
    cy.get(".generate-link-btn").click();

    // Open the generated link: it lands on the trigram authentication page
    cy.contains("p", "/file/")
      .invoke("text")
      .then((link) => {
        cy.visit(link.trim());

        // The trigram is the first 3 letters of a tenant's last name
        cy.get("#input-trigram").type(account.lastname.slice(0, 3));
        cy.contains("button", "Vérifier").click();

        // The shared file is now consultable
        cy.get("#input-trigram").should("not.exist");
        cy.contains("Pièces du candidat", { timeout: 10000 }).should(
          "be.visible",
        );
      });
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
    "2000",
  );

  cy.clickOnNext();

  cy.expectPath("/info-garant/5");
  cy.contains("Votre garant a un avis d’impôt").click();
  cy.simpleUploadDocumentStep("un avis d’impôt français");

  cy.expectPath("/liste-garants");
  cy.get("#step-content")
    .contains([firstname, lastname].join(" "))
    .should("be.visible");
}
