import { getTenantUser, UserType } from "../../support/users";

describe("change password scenario", () => {
  it("Join group - should error on invalid password token", () => {
    cy.visit(Cypress.env("tenantUrl") + "/ajout-groupe/bad_token");
    cy.rejectCookies();
    const password = "password1!";
    cy.get("#password").type(password);
    cy.get("#confirm-password").type(password);
    cy.contains("Valider").click();
    cy.contains("Le token dans l'url fourni semble incorrect");
  });

  it("Join couple - should error on invalid password token", () => {
    cy.visit(Cypress.env("tenantUrl") + "/ajout-couple/bad_token");
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
