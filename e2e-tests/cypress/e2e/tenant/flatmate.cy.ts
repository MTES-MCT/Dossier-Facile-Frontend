import { getTenantUser, UserType } from "../../support/users";

describe("flatmate tenant scenario", () => {
  const user = getTenantUser();
  const flatmateEmail = `coloc-${Math.floor(Math.random() * 10000)}@yopmail.fr`;

  beforeEach("reset account", () => {
    cy.deleteAccount(user.username, UserType.TENANT);
  });

  it("validate file", () => {
    cy.tenantLogin(user.username);
    cy.rejectCookies();
    cy.wait(1000);

    cy.get("#lastname").should("have.value", user.lastname);
    cy.get("#firstname").should("have.value", user.firstname.toUpperCase());
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
    cy.simpleUploadDocumentStep("Titre de séjour français");

    cy.expectPath("/documents-locataire/2");
    cy.selectResidencyStep(
      "Hébergé par vos parents, par un ami, par un proche",
      3
    );

    cy.expectPath("/documents-locataire/3");
    cy.selectProfessionalStatusStep("Stage");

    cy.expectPath("/documents-locataire/4");
    cy.addFinancialResource("Pensions", "500");
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/5");
    cy.contains("Vous êtes rattaché fiscalement à vos parents")
      .click()
      .clickOnNext();

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
      "be.visible"
    );
  });
});
