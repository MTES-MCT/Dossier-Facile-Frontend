describe("basic owner scenario", () => {
  const user = {
    username: "test_ALAIN",
    firstname: "Alain",
    lastname: "BUREAU"
  };

  before("reset account", () => {
    cy.ownerLogin(user.username);
    cy.deleteAccount();
  });

  beforeEach("login", () => {
    cy.ownerLogin(user.username);
    cy.acceptCookies();
  });

  it("add a new property", () => {
    cy.get("button")
      .contains("Ajouter une propriété")
      .click();

    const propertyName = "Appartement 1";
    cy.get('input[name="name"]')
      .type(propertyName)
      .clickOnNext();

    cy.contains("Un appartement")
      .click()
      .clickOnNext();

    cy.get('input[name="address"]')
      .type("42 rue de la paix")
      .clickOnNext();

    cy.contains("Vide")
      .click()
      .clickOnNext();

    cy.get('input[name="living-space"]')
      .type("30")
      .clickOnNext();

    cy.get('input[name="rent"]').type("600");
    cy.get('input[name="charges"]')
      .type("50")
      .clickOnNext();

    cy.get('label[for="authorize"]')
      .click()
      .clickOnNext();

    cy.get("h1")
      .contains("Mes propriétés")
      .should("be.visible");
    cy.contains(propertyName).click();
    cy.expectPath("/consulte-propriete");

    cy.contains("Supprimer ma propriété").click();
    cy.get(".modal")
      .contains("Valider")
      .click();
  });

  it("edit personal informations", () => {
    cy.get(".fr-nav__btn").click();
    cy.contains("Mes informations personnelles").click();

    cy.get('input[name="email"]')
      .clear()
      .type("test@test.fr")
      .clickOnNext();
  });
});
