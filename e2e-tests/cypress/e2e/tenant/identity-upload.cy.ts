import { getTenantUser, UserType } from "../../support/users";

describe("identity document upload", () => {
  const user = getTenantUser();

  before(() => {
    cy.loginWithFCAndDeleteAccount(
      user.username,
      user.password,
      UserType.TENANT
    );
  });

  it("should allow uploading 2 different files sequentially", () => {
    cy.tenantLoginWithFC(user.username, user.password);
    cy.rejectCookies();

    cy.contains("Pour vous").click();

    cy.verifyTenantIdentity(user.firstname, user.lastname);
    cy.clickOnNext();

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
