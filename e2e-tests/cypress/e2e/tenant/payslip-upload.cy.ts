import { testAccount } from "../../support/testAccounts";

function formatMonth(offset: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  const month = d.toLocaleDateString("fr-FR", { month: "long" });
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${d.getFullYear()}`;
}

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

  it("uploads 3 valid payslip PDFs without analysis errors", () => {
    const months = [-2, -3, -4];
    const filePaths: string[] = [];

    months.forEach((offset, i) => {
      const date = formatMonth(offset);
      cy.task("generatePayslipPdf", {
        name: account.lastname,
        firstName: account.firstname,
        date,
        amount: "1 950,00",
        outputPath: `assets/generated/bulletin-${i + 1}.pdf`,
      }).then((path) => {
        filePaths.push(path as string);
      });
    });

    cy.then(() => {
      cy.gotoTenantDocumentsPage(account);
      navigateToSalaryUpload();

      cy.get('[data-cy="monthlySum"]').type("1500");

      cy.intercept("POST", "/api/register/documentFinancial").as(
        "uploadPayslip",
      );
      cy.get(".input-file").selectFile(filePaths);
      cy.wait("@uploadPayslip").its("response.statusCode").should("eq", 200);
      cy.waitUntilLoaderIsGone();

      cy.get(".analysis-banners", { timeout: 20000 }).should("not.exist");
      cy.clickOnNext();
      cy.expectPath("/documents-locataire/4");
    });
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
