describe("flatmate tenant flow", () => {
  const user = {
    username: "test_ALAIN",
    firstname: "Alain",
    lastname: "BUREAU"
  };

  before("reset account", () => {
    cy.tenantLogin(user.username);
    cy.deleteAccount();
    cy.clearCookies();
    cy.clearAllLocalStorage();
  });

  it("validate file", () => {
    cy.tenantLogin(user.username);
    cy.acceptCookies();

    cy.expectPath("/nom-locataire");
    cy.get("#lastname").should("have.value", user.lastname);
    cy.get("#firstname").should("have.value", user.firstname.toUpperCase());
    cy.clickOnNext();

    cy.expectPath("/type-locataire");
    cy.contains("En colocation").click();
    cy.get('input[name="email"]').type("coloc-6829374@yopmail.fr");
    cy.contains("Inviter ce colocataire").click();
    cy.get("#authorize").click();
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/1");
    cy.simpleUploadDocumentStep("Titre de séjour français");

    cy.expectPath("/documents-locataire/2");
    cy.simpleUploadDocumentStep("Hébergé·e à titre gratuit");

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
    cy.get("button")
      .contains("Un garant moral")
      .click()
      .clickOnNext();

    cy.expectPath("/info-garant/0");
    cy.get("#organismName")
      .type("Organisme")
      .uploadDocument()
      .clickOnNext();
    cy.get("#firstName").type("Personne");
    cy.get("#selectID")
      .select("Autre")
      .uploadDocument()
      .clickOnNext();

    cy.expectPath("/liste-garants");
    cy.clickOnNext();

    cy.validationStep();

    cy.get("h1").should(
      "contain",
      `Bonjour ${user.firstname}, votre dossier est incomplet !`
    );
  });
});
