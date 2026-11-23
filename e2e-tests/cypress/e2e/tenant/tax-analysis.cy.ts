import { testAccount } from "../../support/testAccounts";
import { mockDocumentAnalysis } from "../../support/documentAnalysisMock";

describe("tax document analysis", () => {
  const account = testAccount("e2e-tax");

  beforeEach(() => {
    cy.createTestAccount(account);
    // Registered first so it catches any upload that escapes the mock, without
    // allowing the regression test to enqueue a real Document IA analysis.
    cy.intercept("POST", "**/api/register/documentTax", () => {
      throw new Error("A tax upload escaped the document analysis mock");
    });
    mockDocumentAnalysis("tax", (fileCount) =>
      fileCount === 1
        ? [
            {
              rule: "R_TAX_BAD_CLASSIFICATION",
              message: "",
              level: "CRITICAL",
              ruleData: {
                type: "R_TAX_CLASSIFICATION",
                isDeclarativeSituation: false,
              },
            },
          ]
        : [
            {
              rule: "R_TAX_NAMES",
              level: "CRITICAL",
              message: "",
              ruleData: {
                type: "R_TAX_NAMES",
                expectedName: {
                  firstNames: "Jean",
                  lastName: "Dupont",
                  preferredName: null,
                },
                extractedIdentities: ["MARTIN Camille"],
              },
            },
          ],
    );
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

    cy.wait("@mockAnalysisInProgress");
    cy.wait("@mockDocumentAnalysis");
    cy.get(".analysis-error-block").should("be.visible");
    cy.get(".confirm-tax-btn, .continue-without-btn").should("not.exist");
    cy.get("#explainText").should("have.value", "");
    cy.get(".tax-analysis-guidance").should("be.visible");
    cy.get(".analysis-error-header-title").should("have.prop", "tagName", "H2");
    cy.testAccessibility();
    cy.intercept("POST", "**/api/document/commentAnalysis").as(
      "saveExplanation",
    );
    cy.assertAnalysisErrorBlockAndExplain("avec-avis/francais");
    cy.wait("@saveExplanation").then(({ request, response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(request.body.comment).to.eq("explication e2e");
    });

    cy.go("back");
    cy.expectPath("/documents-locataire/5/avec-avis/francais");
    cy.reload();
    cy.get("#explainText").should("have.value", "explication e2e");
    cy.get(".analysis-error-block").should("not.have.focus");
    cy.contains('[data-cy="uploaded-files"] button', "Supprimer").click();
    cy.contains("dialog[open] button", "Valider").click();
    cy.wait("@mockFileDelete").its("response.statusCode").should("eq", 200);
    cy.reload();
    cy.get(".input-file").should("exist");
    cy.get('[data-cy="uploaded-files"], .analysis-error-block').should(
      "not.exist",
    );
  });

  it("saves on immediate navigation and does not auto-focus existing errors on return", () => {
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

    cy.wait("@mockAnalysisInProgress");
    cy.wait("@mockDocumentAnalysis");
    cy.get(".analysis-error-block").should("exist");
    cy.get(".analysis-error-header-title").should("be.visible");

    // Freeze the debounce so the menu click must flush the explanation on blur.
    cy.intercept("POST", "**/api/document/commentAnalysis").as("saveOnBlur");
    cy.clock(undefined, ["setTimeout", "clearTimeout"]);
    cy.get("#explainText").type("Explication sauvegardée avant de quitter", {
      delay: 0,
    });
    cy.get("#funnel-menu").contains("Pièce d'identité").click();
    cy.expectPath("/documents-locataire/1");
    cy.clock().invoke("restore");
    cy.wait("@saveOnBlur").its("response.statusCode").should("eq", 200);

    // Navigate back to the tax page with existing errors
    cy.get("#funnel-menu").contains("Avis d'imposition").click();
    cy.expectPath("/documents-locataire/5/avec-avis/francais");

    // The error block should still be visible but NOT auto-focused
    cy.get(".analysis-error-block").should("exist");
    cy.get(".analysis-error-block").should("not.have.focus");
    cy.reload();
    cy.get("#explainText").should(
      "have.value",
      "Explication sauvegardée avant de quitter",
    );
  });

  it("shows the new report after a second upload and preserves the saved explanation", () => {
    cy.gotoTenantDocumentsPage(account);
    cy.get("#funnel-menu").contains("Avis d'imposition").click();
    cy.get('a[href*="avec-avis"]').click();
    cy.get('a[href*="avec-avis/francais"]').click();

    cy.get(".input-file").selectFile("assets/qr-code.png");
    cy.wait("@mockDocumentUpload").its("response.statusCode").should("eq", 200);
    cy.wait("@mockAnalysisInProgress");
    cy.wait("@mockDocumentAnalysis");
    cy.contains(
      ".analysis-error-header-title",
      "Ce document n'est pas un avis d'impôt",
    ).should("be.visible");
    cy.get('[data-cy="uploaded-files"] > li').should("have.length", 1);
    const comment = "Explication enregistrée avant le second dépôt";
    cy.get("#explainText").type(comment).blur();
    cy.wait("@mockAnalysisComment")
      .its("request.body.comment")
      .should("eq", comment);

    cy.get(".input-file").selectFile("assets/test-document.png");
    cy.wait("@mockDocumentUpload").its("response.statusCode").should("eq", 200);
    cy.wait("@mockAnalysisInProgress")
      .its("response.body.totalFiles")
      .should("eq", 2);
    cy.wait("@mockDocumentAnalysis");
    cy.get("@mockDocumentUpload.all").should("have.length", 2);
    cy.get('[data-cy="uploaded-files"] > li').should("have.length", 2);
    cy.contains(".analysis-error-header-title", "MARTIN Camille").should(
      "be.visible",
    );

    cy.reload();
    cy.get('[data-cy="uploaded-files"] > li').should("have.length", 2);
    cy.get("#explainText").should("have.value", comment);

    // A pasted URL can include a trailing slash. Confirming deletion must still reach the parents form.
    cy.visit(
      `${Cypress.expose("tenantUrl")}/documents-locataire/5/avec-avis/francais/`,
    );
    cy.contains(
      "button",
      "Je suis rattaché au foyer fiscal de mes parents",
    ).click();
    cy.contains("dialog[open] button", "Supprimer mes documents").click();
    cy.wait("@mockDocumentDelete").its("response.statusCode").should("eq", 200);
    cy.expectPath("/documents-locataire/5/sans-avis/parents");
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
      .and("contain", "L'avis de situation déclarative n'est pas accepté");

    // The rejected file must not remain in the upload list
    cy.get('[data-cy="uploaded-files"]').should("not.exist");
  });
});
