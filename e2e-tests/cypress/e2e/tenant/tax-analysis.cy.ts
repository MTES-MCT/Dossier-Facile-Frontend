import { getTenantUser, UserType } from "../../support/users";

describe("tax document analysis", () => {
  const user = getTenantUser();

  beforeEach(() => {
    cy.loginWithFCAndDeleteAccount(
      user.username,
      user.password,
      UserType.TENANT,
    );
  });

  it("shows analysis errors and allows explanation", () => {
    cy.tenantLoginWithFC(user.username, user.password);
    cy.rejectCookies();

    cy.contains("Pour vous").click();
    cy.verifyTenantIdentity(user.firstname, user.lastname);
    cy.clickOnNext();

    cy.expectPath("/type-locataire");
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/1");
    cy.get("#funnel-menu").contains("Avis d'imposition").click();
    cy.expectPath("/documents-locataire/5");
    cy.get('a[href*="avec-avis"]').click();
    cy.get('a[href*="avec-avis/francais"]').click();

    cy.intercept(
      "POST",
      "/api/register/documentTax",
    ).as("uploadTax");
    cy.get(".input-file").selectFile("assets/qr-code.png");
    cy.wait("@uploadTax").its("response.statusCode").should("eq", 200);
    cy.waitUntilLoaderIsGone();

    cy.get(".analysis-banners", { timeout: 15000 }).should("exist");
    cy.get(".analysis-banners").should("have.focus");
    cy.get(".analysis-banner").should("have.length.at.least", 1);

    cy.get('[data-cy="next-btn"]').should("not.be.disabled");
    cy.get('[data-cy="next-btn"]').click();
    cy.get(".analysis-banners").should("have.focus");
    cy.url().should("include", "avec-avis/francais");

    cy.get(".explain-link").first().click();
    cy.get("#explainText").should("exist").and("have.focus");

    cy.get(".explain-form-actions").contains("Enregistrer").should("not.be.disabled");
    cy.get(".explain-form-actions").contains("Enregistrer").click();
    cy.get(".fr-error-text").should("be.visible");
    cy.get("#explainText").should("have.focus");

    cy.get("#explainText").type("test");
    cy.get(".fr-error-text").should("be.visible");

    cy.get(".explain-form-actions").contains("Enregistrer").click();
    cy.get(".fr-error-text").should("not.exist");
    cy.contains("Votre explication a bien été enregistrée").should("be.visible");

    cy.get('[data-cy="next-btn"]').click();
    cy.url().should("not.include", "avec-avis/francais");
  });
});
