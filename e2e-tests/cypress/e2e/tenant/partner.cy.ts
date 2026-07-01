import { testAccount } from "../../support/testAccounts";

const DEMO_URL = Cypress.env("dfConnectDemoUrl");

describe("partner sharing scenario (DFConnect)", () => {
  const account = testAccount("e2e-partner");

  before(function () {
    // Preprod-only: requires the deployed demo app + dfconnect-demo Keycloak client
    if (!DEMO_URL) this.skip();
  });

  it("grants then revokes partner access", () => {
    // Logged-in tenant: establishes the Keycloak SSO session reused by the partner flow
    cy.createFreshTenant(account);

    // Drive the partner demo through the OIDC consent flow. The demo exchanges the
    // code for a token and calls /dfc/tenant/profile, which actually creates the
    // PARTNER link
    cy.visit(DEMO_URL);
    cy.contains("a", "Se connecter avec DFC").click();
    cy.get("button.btn-dossierfacile").click(); // redirects to Keycloak authorize

    // consent button
    cy.get("#kc-login").click();

    cy.contains("/dfc/tenant/profile").should("exist");

    // Back on the tenant app: the PARTNER link is now listed
    cy.visit(Cypress.env("tenantUrl") + "/partages");
    cy.contains(".share-item", "Partage avec", { timeout: 5000 }).should(
      "exist",
    );

    // Revoke the partner share
    cy.contains(".share-item", "Partage avec").within(() => {
      cy.contains("button", "Actions").click();
      cy.contains("button", "Supprimer le partage").click();
    });
    cy.get("dialog[open]").contains("button", "Supprimer").click();

    // The partner link is gone
    cy.contains("Partage avec").should("not.exist");

    // Confirm via the demo that the partner can no longer access the tenant's data
    cy.visit(DEMO_URL);
    cy.contains("a", "Se connecter avec DFC").click();
    cy.get("button.btn-dossierfacile").click();
    cy.get("#kc-login").should("be.visible"); // consent required again -> access revoked
  });
});
