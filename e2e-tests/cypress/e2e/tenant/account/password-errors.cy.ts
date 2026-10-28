import { fillActionPassword } from "../../../support/auth";

describe("Tenant invitation password errors", () => {
  for (const route of ["ajout-groupe", "ajout-couple"]) {
    it(`rejects an invalid ${route} token and returns focus to the password`, () => {
      cy.visit(`${Cypress.env("tenantUrl")}/${route}/bad_token`);
      fillActionPassword("password1!");
      cy.contains("Valider").click();
      cy.verifyErrorToastMessage(
        "Vous avez déjà utilisé ce lien pour créer un mot de passe.",
      );
      cy.get("#password").should("be.focused");
    });
  }
});
