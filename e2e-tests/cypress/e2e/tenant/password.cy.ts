import { getTenantUser, UserType } from "../../support/users";

describe("change password scenario", () => {
  it("Join group - should error on invalid password token", () => {
    cy.visit(Cypress.env("tenantUrl") + "/ajout-groupe/bad_token");
    cy.rejectCookies();
    const password = "password1!";
    cy.get("#password").type(password);
    cy.get("#confirm-password").type(password);
    cy.contains("Valider").click();
    cy.contains("Le lien est expiré ou incorrect");
  });

  it("Join couple - should error on invalid password token", () => {
    cy.visit(Cypress.env("tenantUrl") + "/ajout-couple/bad_token");
    cy.rejectCookies();
    const password = "password1!";
    cy.get("#password").type(password);
    cy.get("#confirm-password").type(password);
    cy.contains("Valider").click();
    cy.contains("Le lien est expiré ou incorrect");
  });
});
