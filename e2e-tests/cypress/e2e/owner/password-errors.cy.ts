import { fillActionPassword } from "../../support/auth";

describe("Owner password recovery errors", () => {
  it("rejects an invalid action link", () => {
    cy.visit(`${Cypress.env("ownerUrl")}/modifier-mot-de-passe/bad_token`);
    fillActionPassword("password1!");
    cy.contains("Valider").click();
    cy.contains(
      "Le lien a expiré, veuillez lancer la procédure de mot de passe oublié",
    ).should("be.visible");
  });
});
