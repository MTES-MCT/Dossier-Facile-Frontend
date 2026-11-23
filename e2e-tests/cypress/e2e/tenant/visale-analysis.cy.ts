import { testAccount } from "../../support/testAccounts";
import { mockDocumentAnalysis } from "../../support/documentAnalysisMock";

describe("visale certificate analysis", () => {
  const account = testAccount("e2e-visale");

  beforeEach(() => {
    cy.createTestAccount(account);
    mockDocumentAnalysis("visale", [
      {
        rule: "R_DOCUMENT_IA_CLASSIFICATION",
        message: "",
        level: "CRITICAL",
        ruleData: null,
      },
    ]);
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
    cy.wait("@mockAnalysisInProgress");
    cy.wait("@mockDocumentAnalysis");
    cy.get(".analysis-error-block").should("be.visible");
    cy.intercept("POST", "**/api/document/commentAnalysis").as(
      "saveVisaleExplanation",
    );

    cy.assertAnalysisErrorBlockAndExplain("info-garant");
    cy.wait("@saveVisaleExplanation").then(({ request, response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(request.body.comment).to.eq("explication e2e");
    });
  });
});
