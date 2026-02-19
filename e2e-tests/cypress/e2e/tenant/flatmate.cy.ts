import { getTenantUser, UserType } from "../../support/users";

describe("flatmate tenant scenario", () => {
  const user = getTenantUser();
  const flatmateEmail = `coloc-${Math.floor(Math.random() * 10000)}@yopmail.fr`;

  beforeEach("reset account", () => {
    cy.loginWithFCAndDeleteAccount(
      user.username,
      user.password,
      UserType.TENANT,
    );
  });

  it("validate file", () => {
    cy.tenantLoginWithFC(user.username, user.password);
    cy.rejectCookies();
    cy.contains("Pour vous").click();

    cy.verifyTenantIdentity(user.firstname, user.lastname);

    cy.clickOnNext();

    cy.wait(200);
    cy.expectPath("/type-locataire");
    cy.wait(200);
    cy.contains("En colocation").click();
    cy.get('input[name="email"]').type(flatmateEmail);
    cy.contains("Inviter ce colocataire").click();
    cy.get('label[for="authorize"').click();
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/1");
    cy.simpleUploadDocumentStep("Carte ou titre de séjour");

    cy.expectPath("/documents-locataire/2");
    cy.selectResidencyStep(
      "Hébergé chez quelqu'un",
      "Vous avez une attestation d'hébergement de moins de 3 mois",
    );

    cy.expectPath("/documents-locataire/3");
    cy.contains("Autres activités…").click();
    cy.selectProfessionalStatusStep("Stage");

    cy.expectPath("/documents-locataire/4");
    cy.addFinancialResource(
      [
        "Retraite ou autre pension",
        "une retraite",
        "Vous n’avez pas de bulletin de pension",
      ],
      "500",
    );
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/5");
    cy.contains("Vous n’avez pas d’avis d’impôt").click();
    cy.contains(
      "Vous êtes inscrit sur la déclaration d’impôt de vos parents",
    ).click();
    cy.contains("J’atteste sur l’honneur ne pas pouvoir").click().clickOnNext();

    cy.expectPath("/choix-garant");
    cy.contains("Une personne morale").click({ force: true }).clickOnNext();

    cy.expectPath("/info-garant/0");
    cy.get("#organismName").type("Organisme").uploadDocument().clickOnNext();

    const name = "Personne morale 123";
    cy.get("#firstName").type(name);
    cy.get("#selectID").select("Autre").uploadDocument().clickOnNext();

    cy.expectPath("/liste-garants");
    cy.contains(name).should("be.visible");
    cy.clickOnNext();

    cy.validationStep();

    cy.contains("Votre dossier est actuellement en cours de traitement").should(
      "be.visible",
    );
  });
});
