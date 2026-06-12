import { testAccount } from "../../support/testAccounts";

describe("identity document upload", () => {
  const account = testAccount("e2e-identity");

  it("should allow uploading 2 different files sequentially", () => {
    cy.createFreshTenant(account);

    cy.fillTenantIdentity(account.firstname, account.lastname);

    cy.expectPath("/type-locataire");
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/1");

    cy.contains("Passeport").click();
    cy.uploadDocument(1);
    cy.get(".fr-card").should("have.length", 1);

    // Check that uploading a second file works without 500 error
    cy.uploadDocument(1);
    cy.get(".fr-card").should("have.length", 2);
  });
});
