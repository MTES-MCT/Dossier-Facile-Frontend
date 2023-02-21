describe("couple tenant flow", () => {
  const user = {
    username: "test_FABIEN",
    firstname: "Fabien"
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
    cy.clickOnNext();

    cy.expectPath("/type-locataire");
    cy.get("button")
      .contains("En couple")
      .click();
    cy.get('input[name="coTenantLastName"]').type("Martin");
    cy.get('input[name="firstName"]').type("Louise");
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/1");
    cy.contains("Passeport français")
      .click()
      .uploadDocument()
      .clickOnNext();

    cy.expectPath("/documents-locataire/2");
    cy.contains("Vous habitez chez vos parents")
      .click()
      .uploadDocument()
      .clickOnNext();

    cy.expectPath("/documents-locataire/3");
    cy.get("#select")
      .select("CDD")
      .uploadDocument()
      .clickOnNext();

    cy.expectPath("/documents-locataire/4");
    cy.contains("Revenus professionnels").click();
    cy.get("#monthlySum")
      .type("1000")
      .uploadDocument()
      .clickOnNext();

    cy.clickOnNext();

    cy.expectPath("/documents-locataire/5");
    cy.contains("Vous êtes rattaché fiscalement à vos parents")
      .click()
      .clickOnNext();

    cy.expectPath("/choix-garant");
    cy.get("button")
      .contains("Un organisme garant")
      .click()
      .clickOnNext();

    cy.expectPath("/info-garant/0");
    cy.uploadDocument().clickOnNext();

    cy.expectPath("/liste-garants");
    cy.clickOnNext();

    cy.expectPath("/4/0");
    cy.clickOnNext();

    cy.expectPath("/4/1");
    cy.contains("Autre")
      .click()
      .uploadDocument()
      .clickOnNext();

    cy.expectPath("/4/2");
    cy.contains("Locataire")
      .click()
      .uploadDocument()
      .clickOnNext();

    cy.expectPath("/4/3");
    cy.get("#select")
      .select("Études")
      .uploadDocument()
      .clickOnNext();

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
    cy.contains("Mon conjoint n'a pas de garant").click();
    cy.clickOnNext();

    cy.disableTaxVerification();

    cy.get('label[for="declaration"]').click();

    cy.get("#precision").type("Test");
    cy.contains("Valider mon dossier").click();

    cy.get("h1").should(
      "contain",
      `Bonjour ${user.firstname}, votre dossier de couple est en cours de traitement !`
    );
  });
});
