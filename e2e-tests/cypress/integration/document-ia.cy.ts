import { testAccount } from "../support/testAccounts";
import type { User } from "df-shared-next/src/models/User";

// No response stubs here: upload, Document IA analysis and comments use real APIs.
// Kept outside cypress/e2e so ordinary UI runs do not depend on Document IA.
describe("Document IA integration", () => {
  for (const kind of ["tax", "visale", "payslip"] as const) {
    it(`analyses a real ${kind} upload and persists its explanation`, () => {
      const account = testAccount(`e2e-document-ia-${kind}`);
      cy.createTestAccount(account);
      cy.gotoTenantDocumentsPage(account);

      if (kind === "tax") {
        cy.get("#funnel-menu").contains("Avis d'imposition").click();
        cy.get('a[href*="avec-avis"]').click();
        cy.get('a[href*="avec-avis/francais"]').click();
        cy.expectPath("/documents-locataire/5/avec-avis/francais");
      } else if (kind === "visale") {
        cy.contains("J'ajoute mes éventuels garants").click();
        cy.expectPath("/choix-garant");
        cy.contains("Un organisme").click();
        cy.clickOnNext();
        cy.expectPath("/info-garant/0");
        cy.contains("label", "Visale").click();
      } else {
        cy.get("#funnel-menu").contains("Justificatif de ressources").click();
        cy.contains(
          /Déclarer ses ressources|Ajouter une autre ressource/,
        ).click();
        cy.contains("Revenus du travail").click();
        cy.contains("salarié").click();
        cy.contains("Depuis plus de 3 mois").click();
        cy.get('[data-cy="monthlySum"]').type("2000");
      }

      cy.intercept(
        "POST",
        {
          tax: "**/api/register/documentTax",
          visale: "**/api/register/guarantorOrganism/documentCertificate",
          payslip: "**/api/register/documentFinancial",
        }[kind],
      ).as("realUpload");
      cy.get(".input-file").selectFile(
        Array(kind === "payslip" ? 3 : 1).fill("assets/qr-code.png"),
      );
      let payslipFileIds: number[] = [];
      cy.wait<unknown, User>("@realUpload").then(({ response }) => {
        expect(response?.statusCode).to.eq(200);
        if (kind === "payslip") {
          const payslip = response?.body.documents?.find(
            (doc) =>
              doc.documentCategoryStep === "SALARY_EMPLOYED_MORE_3_MONTHS",
          );
          payslipFileIds = (payslip?.files ?? []).map((file) =>
            Number(file.id),
          );
          expect(payslipFileIds).to.have.length(3);
          expect(payslipFileIds.every(Number.isSafeInteger)).to.eq(true);
          expect(new Set(payslipFileIds).size).to.eq(3);
        }
      });
      // Allow processing plus two local scheduler cycles (one minute each).
      cy.get(
        kind === "payslip" ? ".analysis-banners" : ".analysis-error-block",
        {
          timeout: 180000,
        },
      ).should("be.visible");
      // Financial uploads replace /ajouter/ with the new document ID.
      cy.location("pathname").as("documentStep", { type: "static" });
      cy.intercept("POST", "**/api/document/commentAnalysis").as("realComment");
      if (kind === "payslip") {
        cy.assertAnalysisBannersAndExplain("plus-3-mois");
      } else {
        cy.get(".analysis-error-header-title").should(
          "contain",
          kind === "tax"
            ? "Ce document n'est pas un avis d'impôt"
            : "Ce n’est pas le certificat attendu",
        );
        cy.assertAnalysisErrorBlockAndExplain(
          kind === "tax" ? "avec-avis/francais" : "info-garant",
        );
      }
      cy.wait<{ documentId: number; comment: string }, User>(
        "@realComment",
      ).then(({ request, response }) => {
        expect(response?.statusCode).to.eq(200);
        expect(request.body.comment).to.eq("explication e2e");
        if (kind === "payslip") {
          const document = response?.body.documents?.find(
            (doc) => doc.id === request.body.documentId,
          );
          const data = document?.documentAnalysisReport?.failedRules.find(
            (rule) => rule.rule === "R_DOCUMENT_IA_CLASSIFICATION",
          )?.ruleData;
          if (data?.type !== "R_PAYSLIP_CLASSIFICATION") {
            throw new Error(
              "Expected a payslip classification failure on the uploaded document",
            );
          }
          expect(
            data.entriesInError.map((entry) => entry.fileId),
          ).to.have.members(payslipFileIds);
        }
      });
      cy.go("back");
      cy.get<string>("@documentStep").then((path) => {
        cy.location("pathname").should("eq", path);
      });
      cy.reload();
      cy.get("#explainText").should("have.value", "explication e2e");
    });
  }
});
