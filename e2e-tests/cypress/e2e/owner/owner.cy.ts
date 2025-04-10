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
    cy.contains("Mon DPE en détail", { timeout: 10_000 }).should("be.visible");

    cy.clickOnNext();

    cy.get('label[for="authorize"]').click().clickOnNext();

    cy.get("h2").contains("Mes propriétés").should("be.visible");

    cy.contains(propertyName).should("be.visible").click();
    cy.expectPath("/consulte-propriete");

    cy.contains("Partager ma propriété").click();
    cy.contains("Copier").click();
    cy.get('[data-cy="share-property-modal"]').contains("Fermer").click();

    cy.intercept("DELETE", "**/property/*").as("deleteProperty");
    cy.contains("Supprimer ma propriété").click();
    cy.get(".modal").contains("Valider").click();
    cy.wait("@deleteProperty").its("response.statusCode").should("eq", 200);
  });

  it("should error on invalid password token", () => {
    cy.visit(Cypress.env("ownerUrl") + "/modifier-mot-de-passe/bad_token");
    cy.rejectCookies();
    const password = "password1!";
    cy.get("#password").type(password);
    cy.get("#confirm-password").type(password);
    cy.contains("Valider").click();
    cy.contains(
      "Le lien a expiré, veuillez lancer la procédure de mot de passe oublié"
    );
  });
});
