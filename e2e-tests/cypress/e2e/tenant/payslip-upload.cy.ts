import { testAccount } from "../../support/testAccounts";

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
  });

  it("shows analysis errors and allows explanation", () => {
    cy.gotoTenantDocumentsPage(account);
    navigateToSalaryUpload();

    cy.get('[data-cy="monthlySum"]').type("2000");

    cy.intercept("POST", "/api/register/documentFinancial").as("uploadPayslip");
    cy.get(".input-file").selectFile([
      "assets/qr-code.png",
      "assets/qr-code.png",
      "assets/qr-code.png",
    ]);
    cy.wait("@uploadPayslip").its("response.statusCode").should("eq", 200);
    cy.waitUntilLoaderIsGone();

    cy.assertAnalysisErrorAndExplain("plus-3-mois");
  });
});
