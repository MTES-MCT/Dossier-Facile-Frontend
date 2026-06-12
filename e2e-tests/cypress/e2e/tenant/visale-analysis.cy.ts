import { testAccount } from "../../support/testAccounts";

describe("visale certificate analysis", () => {
  const account = testAccount("e2e-visale");

  beforeEach(() => {
    cy.createTestAccount(account);
  });

  it("shows analysis errors and allows explanation", () => {
    cy.gotoTenantDocumentsPage(account);

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

    cy.assertAnalysisErrorAndExplain("info-garant");
  });
});
