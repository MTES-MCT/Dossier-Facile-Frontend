import { getTenantUser, UserType } from "../../support/users";

describe("visale certificate analysis", () => {
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
    cy.contains("J'ajoute mes éventuels garants").click();

    cy.expectPath("/choix-garant");
    cy.contains("Un organisme").click();
    cy.clickOnNext();

    cy.expectPath("/info-garant/0");
    cy.contains("Visale").click();

    cy.intercept(
      "POST",
      "/api/register/guarantorOrganism/documentCertificate",
    ).as("uploadVisale");
    cy.get(".input-file").selectFile("assets/qr-code.png");
    cy.wait("@uploadVisale").its("response.statusCode").should("eq", 200);
    cy.waitUntilLoaderIsGone();

    cy.get(".analysis-banners", { timeout: 20000 }).should("exist");
    cy.get(".analysis-banners").should("have.focus");
    cy.get(".analysis-banner").should("have.length.at.least", 1);

    cy.get('[data-cy="next-btn"]').should("not.be.disabled");
    cy.get('[data-cy="next-btn"]').click();
    cy.get(".analysis-banners").should("have.focus");
    cy.url().should("include", "info-garant");

    cy.get(".explain-link").first().click();
    cy.get("#explainText").should("exist").and("have.focus");

    cy.get(".explain-form-actions")
      .contains("Enregistrer")
      .should("not.be.disabled");
    cy.get(".explain-form-actions").contains("Enregistrer").click();
    cy.get(".fr-error-text").should("be.visible");
    cy.get("#explainText").should("have.focus");

    cy.get("#explainText").type("test");
    cy.get(".fr-error-text").should("be.visible");

    cy.get(".explain-form-actions").contains("Enregistrer").click();
    cy.get(".fr-error-text").should("not.exist");
    cy.contains("Votre explication a bien été enregistrée").should(
      "be.visible",
    );

    cy.get('[data-cy="next-btn"]').click();
    cy.url().should("not.include", "info-garant");
  });
});
