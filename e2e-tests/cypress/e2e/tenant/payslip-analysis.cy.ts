import { getTenantUser, UserType } from "../../support/users";

describe("payslip document analysis", () => {
  const user = getTenantUser();

  beforeEach(() => {
    cy.loginWithFCAndDeleteAccount(
      user.username,
      user.password,
      UserType.TENANT,
    );
  });

  it("shows analysis errors and allows explanation", () => {
    cy.gotoTenantDocumentsPage(user);

    cy.get("#funnel-menu").contains("Justificatif de ressources").click();
    cy.expectPath("/documents-locataire/4");
    cy.contains(/Déclarer ses ressources|Ajouter une autre ressource/).click();
    cy.contains("Revenus du travail").click();
    cy.contains("salarié").click();
    cy.contains("Depuis plus de 3 mois").click();

    cy.get('[data-cy="monthlySum"]').type("2000");

    // Upload 3 payslips to satisfy minFiles=3
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
