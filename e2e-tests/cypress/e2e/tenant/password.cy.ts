import { getTenantUser, UserType } from "../../support/users";

describe("change password scenario", () => {
  it("Join group - should error on invalid password token", () => {
    cy.visit(Cypress.env("tenantUrl") + "/ajout-groupe/bad_token");
    cy.rejectCookies();
    const password = "password1!";
    cy.get("#password").type(password);
    cy.get("#confirm-password").type(password);
    cy.contains("Valider").click();

    cy.verifyErrorToastMessage(
      "Vous avez déjà utilisé ce lien pour créer un mot de passe."
    );

    // Vérifier que l'input password a le focus
    cy.get("#password").should("be.focused");
  });

  it("Join couple - should error on invalid password token", () => {
    cy.visit(Cypress.env("tenantUrl") + "/ajout-couple/bad_token");
    cy.rejectCookies();
    const password = "password1!";
    cy.get("#password").type(password);
    cy.get("#confirm-password").type(password);
    cy.contains("Valider").click();

    cy.verifyErrorToastMessage(
      "Vous avez déjà utilisé ce lien pour créer un mot de passe."
    );

    // Vérifier que l'input password a le focus
    cy.get("#password").should("be.focused");
  });
});
