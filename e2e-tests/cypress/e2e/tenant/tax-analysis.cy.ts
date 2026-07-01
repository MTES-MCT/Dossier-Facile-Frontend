import { testAccount } from "../../support/testAccounts";

describe("tax document analysis", () => {
  const account = testAccount("e2e-tax");

  beforeEach(() => {
    cy.createTestAccount(account);
  });

  it("shows analysis errors and allows explanation", () => {
    cy.gotoTenantDocumentsPage(account);

    cy.get("#funnel-menu").contains("Avis d'imposition").click();
    cy.expectPath("/documents-locataire/5");
    cy.get('a[href*="avec-avis"]').click();
    cy.get('a[href*="avec-avis/francais"]').click();

    cy.intercept("POST", "/api/register/documentTax").as("uploadTax");
    cy.get(".input-file").selectFile("assets/qr-code.png");
    cy.wait("@uploadTax").its("response.statusCode").should("eq", 200);
    cy.waitUntilLoaderIsGone();

    cy.assertAnalysisErrorAndExplain("avec-avis/francais");
  });

  it("does not auto-focus banners when returning to page with existing errors", () => {
    cy.gotoTenantDocumentsPage(account);

    cy.get("#funnel-menu").contains("Avis d'imposition").click();
    cy.expectPath("/documents-locataire/5");
    cy.get('a[href*="avec-avis"]').click();
    cy.get('a[href*="avec-avis/francais"]').click();

    // Upload a file that triggers analysis errors
    cy.intercept("POST", "/api/register/documentTax").as("uploadTax");
    cy.get(".input-file").selectFile("assets/qr-code.png");
    cy.wait("@uploadTax").its("response.statusCode").should("eq", 200);
    cy.waitUntilLoaderIsGone();

    cy.get(".analysis-banners", { timeout: 15000 }).should("exist");
    cy.get(".analysis-banner").should("have.length.at.least", 1);

    // Navigate away
    cy.get("#funnel-menu").contains("Pièce d'identité").click();
    cy.expectPath("/documents-locataire/1");

    // Navigate back to the tax page with existing errors
    cy.get("#funnel-menu").contains("Avis d'imposition").click();
    cy.expectPath("/documents-locataire/5/avec-avis/francais");

    // Banners should still be visible but NOT auto-focused
    cy.get(".analysis-banners").should("exist");
    cy.get(".analysis-banners").should("not.have.focus");
  });

  it("shows error toast when uploading an avis de situation déclarative", () => {
    cy.gotoTenantDocumentsPage(account);

    cy.get("#funnel-menu").contains("Avis d'imposition").click();
    cy.expectPath("/documents-locataire/5");
    cy.get('a[href*="avec-avis"]').click();
    cy.get('a[href*="avec-avis/francais"]').click();

    cy.get(".input-file").selectFile(
      "assets/Avis_situation_declarative_titres_seuls.pdf",
    );

    cy.get(".fr-alert--error")
      .should("be.visible")
      .and(
        "contain",
        "L'avis de situation déclarative n'est pas accepté",
      );

    // The rejected file must not remain in the upload list
    cy.get('ul[role="list"]').should("not.exist");
  });
});
