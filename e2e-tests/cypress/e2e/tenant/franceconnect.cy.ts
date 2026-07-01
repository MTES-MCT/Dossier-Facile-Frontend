import { getTenantUser, UserType } from "../../support/users";

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
