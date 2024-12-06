import { getOwnerUser, UserType } from "../../support/users";

describe("basic owner scenario", () => {
  const user = getOwnerUser();
  const propertyName = "Appartement 123";

  beforeEach("reset account", () => {
    cy.deleteAccount(user.username, UserType.OWNER);
  });

  it("create a property", () => {
    cy.ownerLogin(user.username);
    cy.rejectCookies();

    cy.get("button").contains("Ajouter une propriété").click();

    cy.get('input[name="name"]').type(propertyName).clickOnNext();

    cy.contains("Un appartement").click().clickOnNext();

    cy.get('input[name="address"]').type("42 rue de la paix").clickOnNext();

    cy.contains("Vide").click().clickOnNext();

    cy.get('input[name="living-space"]').type("30").clickOnNext();

    cy.get('input[name="rent"]').type("600");
    cy.get('input[name="charges"]').type("50").clickOnNext();

    cy.get('input[name="dpe"]').type("2386E2170938A");
    cy.contains("Rechercher").click();
    cy.contains("Mon DPE en détail").should("be.visible");

    cy.clickOnNext();

    cy.get('label[for="authorize"]').click().clickOnNext();

    cy.get("h2").contains("Mes propriétés").should("be.visible");

    cy.contains(propertyName).should("be.visible").click();
    cy.expectPath("/consulte-propriete");

    cy.contains("Partager ma propriété").click();
    cy.contains("Copier").click();
    cy.get("#share-modal").find(".fr-btn--close").click();

    cy.intercept("DELETE", "**/property/*").as("deleteProperty");
    cy.contains("Supprimer ma propriété").click();
    cy.get(".modal").contains("Valider").click();
    cy.wait("@deleteProperty").its("response.statusCode").should("eq", 200);
  });
});
