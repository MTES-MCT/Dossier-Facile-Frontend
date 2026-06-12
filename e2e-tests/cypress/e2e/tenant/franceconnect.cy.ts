import { getTenantUser, UserType } from "../../support/users";

// Minimal FranceConnect coverage, run in a separate non-blocking CI job:
// FC preprod is a third-party service that is regularly down, so the main
// e2e suite must not depend on it
describe("FranceConnect test", () => {
  const user = getTenantUser();

  it("logs in with FC and prefills a certified identity", () => {
    cy.loginWithFCAndDeleteAccount(
      user.username,
      user.password,
      UserType.TENANT,
    );

    cy.tenantLoginWithFC(user.username, user.password);
    cy.rejectCookies();

    cy.contains("Pour vous").click();
    cy.verifyTenantIdentity(user.firstname, user.lastname);
  });
});
