import { testAccount } from "../../support/testAccounts";
import { mockDocumentAnalysis } from "../../support/documentAnalysisMock";

function navigateToSalaryUpload() {
  cy.get("#funnel-menu").contains("Justificatif de ressources").click();
  cy.expectPath("/documents-locataire/4");
  cy.contains(/Déclarer ses ressources|Ajouter une autre ressource/).click();
  cy.contains("Revenus du travail").click();
  cy.contains("salarié").click();
  cy.contains("Depuis plus de 3 mois").click();
}

describe("payslip document upload and analysis", () => {
  const account = testAccount("e2e-payslip");

  beforeEach(() => {
    cy.createTestAccount(account);
    cy.intercept("POST", "**/api/register/documentFinancial", () => {
      throw new Error("A payslip upload escaped the document analysis mock");
    });
    mockDocumentAnalysis("payslip", [
      {
        rule: "R_DOCUMENT_IA_CLASSIFICATION",
        message: "",
        level: "CRITICAL",
        ruleData: {
          type: "R_PAYSLIP_CLASSIFICATION",
          entriesInError: [0, 1, 2].map((index) => ({
            fileId: 900000003 + index,
            fileName: "qr-code.png",
          })),
          expectedMonths: ["2026-08", "2026-09", "2026-10"],
        },
      },
    ]);
  });

  it("shows analysis errors and allows explanation", () => {
    cy.gotoTenantDocumentsPage(account);
    navigateToSalaryUpload();

    cy.get('[data-cy="monthlySum"]').type("2000");

    cy.get(".input-file").selectFile([
      "assets/qr-code.png",
      "assets/qr-code.png",
      "assets/qr-code.png",
    ]);
    cy.wait("@mockDocumentUpload").its("response.statusCode").should("eq", 200);
    cy.waitUntilLoaderIsGone();
    cy.wait("@mockAnalysisInProgress")
      .its("response.body.totalFiles")
      .should("eq", 3);
    cy.wait("@mockDocumentAnalysis");
    cy.get('[data-cy="uploaded-files"] > li').should("have.length", 3);
    cy.location("pathname").as("documentStep", { type: "static" });
    cy.get(".analysis-banners").should("have.focus");
    // Upload already saved the initial amount. Change it explicitly to exercise
    // the income-only save, regardless of whether routing remounted the form.
    cy.get('[data-cy="monthlySum"]').clear().type("2100");
    cy.get(".analysis-banners").focus();
    cy.assertAnalysisErrorAndExplain("plus-3-mois");
    cy.wait("@mockAnalysisComment")
      .its("request.body.comment")
      .should("eq", "explication e2e");
    // Continuing also saves the monthly income without uploading files again.
    cy.wait("@mockDocumentUpload").its("response.statusCode").should("eq", 200);
    cy.go("back");
    cy.get<string>("@documentStep").then((path) => {
      cy.location("pathname").should("eq", path);
    });
    cy.reload();
    cy.get('[data-cy="monthlySum"]').should("have.value", "2100");
    cy.get('[data-cy="uploaded-files"] > li').should("have.length", 3);
    cy.get("#explainText").should("have.value", "explication e2e");
  });
});
