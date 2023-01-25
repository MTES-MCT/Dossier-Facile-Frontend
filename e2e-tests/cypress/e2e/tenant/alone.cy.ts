describe("alone tenant flow", () => {
  const user = {
    username: "test_THIBAULT",
    firstname: "Thibault",
    lastname: "TABLE"
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
    cy.get("#preferredname").type("Chaise");
    cy.get("#firstname").should("have.value", user.firstname.toUpperCase());
    cy.clickOnNext();

    cy.expectPath("/type-locataire");
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/1");
    cy.contains("Carte d’identité française")
      .click()
      .uploadDocument()
      .clickOnNext();

    cy.expectPath("/documents-locataire/2");
    cy.contains("Propriétaire")
      .click()
      .uploadDocument()
      .clickOnNext();

    cy.expectPath("/documents-locataire/3");
    cy.get("#select")
      .select("CDI")
      .uploadDocument()
      .clickOnNext();

    cy.expectPath("/documents-locataire/4");
    cy.contains("Revenus professionnels").click();
    cy.get("#monthlySum")
      .type("2000")
      .uploadDocument()
      .clickOnNext();

    cy.clickOnNext();

    cy.expectPath("/documents-locataire/5");
    cy.contains("Vous avez un avis d’imposition à votre nom")
      .click()
      .uploadDocument()
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

    cy.disableTaxVerification();

    cy.get('label[for="declaration"]').click();
    cy.get('label[for="declaration2"]').click();

    cy.get("#precision").type("Test");
    cy.contains("Valider mon dossier").click();

    cy.get("h1").should(
      "contain",
      `Bonjour ${user.firstname}, votre dossier est en cours de traitement !`
    );
  });
});
