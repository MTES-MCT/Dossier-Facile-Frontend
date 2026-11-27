import type { DocumentAnalysisReport } from "df-shared-next/src/models/DocumentAnalysisReport";
import type { DfDocument } from "df-shared-next/src/models/DfDocument";
import type { DocumentRule } from "df-shared-next/src/models/DocumentRule";
import type { User } from "df-shared-next/src/models/User";

type CommentRequest = { documentId: number; tenantId: number; comment: string };
type MockRule = DocumentRule & { level: "INFO" | "WARN" | "CRITICAL" };

function parseMultipart(body: unknown, contentType: string): Promise<FormData> {
  if (
    typeof body !== "string" &&
    !Cypress._.isArrayBuffer(body) &&
    !Cypress.Buffer.isBuffer(body)
  ) {
    throw new Error("Expected a multipart document upload");
  }
  return new Response(typeof body === "string" ? body : new Uint8Array(body), {
    headers: { "Content-Type": contentType },
  }).formData();
}

function findOrganismGuarantor(profile: User, id: string | null) {
  return profile.guarantors?.find(
    (guarantor) =>
      guarantor.typeGuarantor === "ORGANISM" && guarantor.id?.toString() === id,
  );
}

/**
 * Install before login. The account and other funnel steps use the real backend.
 * Upload, analysis, comment and deletion of this document are simulated together:
 * no upload reaches the backend, so it cannot enqueue a real Document IA call.
 * State survives page reloads, but is recreated for each test.
 */
export function mockDocumentAnalysis(
  kind: "tax" | "visale" | "payslip",
  failedRules: MockRule[] | ((fileCount: number) => MockRule[]),
): void {
  const documentId = 900000001;
  const uploadPath = {
    tax: "/api/register/documentTax",
    visale: "/api/register/guarantorOrganism/documentCertificate",
    payslip: "/api/register/documentFinancial",
  }[kind];
  const categories: Record<
    typeof kind,
    Pick<
      DfDocument,
      "documentCategory" | "documentSubCategory" | "documentCategoryStep"
    >
  > = {
    tax: {
      documentCategory: "TAX",
      documentSubCategory: "MY_NAME",
      documentCategoryStep: "TAX_FRENCH_NOTICE",
    },
    visale: {
      documentCategory: "GUARANTEE_PROVIDER_CERTIFICATE",
      documentSubCategory: "VISALE",
    },
    payslip: {
      documentCategory: "FINANCIAL",
      documentSubCategory: "SALARY",
      documentCategoryStep: "SALARY_EMPLOYED_MORE_3_MONTHS",
    },
  };
  let user: User | undefined;
  let document: DfDocument | undefined;
  let visaleGuarantorId: string | null = null;
  let report: DocumentAnalysisReport | undefined;
  let analysisRevision = 0;
  let showProgress = false;
  let nextFileId = 900000003;

  function scheduleAnalysis(fileCount: number) {
    showProgress = true;
    analysisRevision += 1;
    report = {
      id: 900000002,
      analysisStatus: "DENIED",
      failedRules:
        typeof failedRules === "function"
          ? failedRules(fileCount)
          : failedRules,
      comment: report?.comment,
      passedRules: [],
      inconclusiveRules: [],
      createdAt: new Date(
        Date.UTC(2026, 10, 17, 12, 0, analysisRevision),
      ).toISOString(),
    };
  }

  function withDocument(source: User): User {
    const result = Cypress._.cloneDeep(source);
    const holder =
      kind !== "visale"
        ? result
        : findOrganismGuarantor(result, visaleGuarantorId);
    if (holder) {
      holder.documents = (holder.documents ?? []).filter(
        (doc) => doc.id !== documentId,
      );
      if (document) holder.documents.push(Cypress._.cloneDeep(document));
    } else if (document) {
      throw new Error("The Visale mock requires an organism guarantor");
    }
    return result;
  }

  // Track real profile changes, including creation of the organism guarantor.
  // Overlay the mock document when the app reloads the profile after navigation.
  cy.intercept<unknown, User>(
    {
      pathname: /^\/api\/(tenant\/profile|register\/.+)$/,
      middleware: true,
    },
    async (request) => {
      const path = new URL(request.url).pathname;
      const contentType = String(request.headers["content-type"] ?? "");
      if (
        request.method === "POST" &&
        path.startsWith("/api/register/") &&
        path !== uploadPath &&
        /^multipart\/form-data\b/i.test(contentType)
      ) {
        const form = await parseMultipart(request.body, contentType);
        if (
          Array.from(form.values()).some((value) => typeof value !== "string")
        ) {
          request.reply({
            statusCode: 400,
            body: { message: `Unexpected document upload to ${path}` },
          });
          return;
        }
      }
      request.on("before:response", (response) => {
        if (
          response.statusCode === 200 &&
          typeof response.body.id === "number"
        ) {
          user = withDocument(response.body);
          response.body = user;
        }
      });
    },
  );

  cy.intercept("GET", "**/api/e2e/document-preview/qr-code.png", {
    fixture: "qr-code.png",
    headers: { "content-type": "image/png" },
  });

  // Keep every upload inside the mock, including additional pages and reuploads.
  // Reject unsupported payloads rather than silently reaching the real backend.
  cy.intercept<unknown>(
    { method: "POST", pathname: uploadPath },
    async (request) => {
      if (!user)
        throw new Error(
          "Load the tenant profile before uploading a mock document",
        );
      const form = await parseMultipart(
        request.body,
        String(request.headers["content-type"]),
      );
      const fileNames: string[] = [];
      form.forEach((value, field) => {
        if (/^documents\[\d+\]$/.test(field) && typeof value !== "string")
          fileNames.push(value.name);
      });
      const categoryField = {
        tax: "typeDocumentTax",
        payslip: "typeDocumentFinancial",
        visale: "typeDocumentCertificate",
      }[kind];
      expect(form.get(categoryField), categoryField).to.eq(
        categories[kind].documentSubCategory,
      );
      expect(form.get("categoryStep"), "categoryStep").to.eq(
        categories[kind].documentCategoryStep ?? null,
      );
      expect(form.get("noDocument"), "noDocument").to.eq("false");
      const monthlySum = Number(form.get("monthlySum"));
      if (
        kind === "payslip" &&
        (!Number.isInteger(monthlySum) || monthlySum <= 0)
      ) {
        throw new Error("The payslip mock expects a positive monthly income");
      }
      if (fileNames.length === 0) {
        // The salary form saves income separately when continuing. Keep its
        // files and analysis report intact, without scheduling another analysis.
        const id = form.get("id");
        if (kind === "payslip" && document && id === String(documentId)) {
          document.monthlySum = monthlySum;
          request.reply({ statusCode: 200, body: withDocument(user) });
          return;
        }
        throw new Error(
          "The document analysis mock expects a multipart file upload",
        );
      }
      if (kind === "visale") {
        const id = form.get("guarantorId");
        if (typeof id !== "string" || !findOrganismGuarantor(user, id)) {
          request.reply({
            statusCode: 400,
            body: {
              message: "Expected an organism guarantor from this profile",
            },
          });
          return;
        }
        if (document && id !== visaleGuarantorId) {
          throw new Error(
            "A second guarantor requires a separate mock document",
          );
        }
        visaleGuarantorId = id;
      }
      scheduleAnalysis((document?.files?.length ?? 0) + fileNames.length);
      document = {
        id: documentId,
        ...categories[kind],
        ...(kind === "payslip" ? { monthlySum } : {}),
        documentStatus: "TO_PROCESS",
        noDocument: false,
        files: [
          ...(document?.files ?? []),
          ...fileNames.map((name) => ({
            id: nextFileId++,
            name,
            originalName: name,
            size: 1024,
            numberOfPages: 1,
            path: `${Cypress.expose("tenantUrl")}/api/e2e/document-preview/qr-code.png`,
            preview: `${Cypress.expose("tenantUrl")}/api/e2e/document-preview/qr-code.png`,
          })),
        ],
      };
      request.reply({ statusCode: 200, body: withDocument(user) });
    },
  ).as("mockDocumentUpload");

  cy.intercept(
    "GET",
    `**/api/document/${documentId}/analysis-status`,
    (request) => {
      if (!document || !report)
        throw new Error("Cannot analyse a missing mock document");
      if (showProgress) {
        showProgress = false;
        request.alias = "mockAnalysisInProgress";
        request.reply({
          body: {
            documentId,
            status: "IN_PROGRESS",
            analyzedFiles: 0,
            totalFiles: document.files?.length,
          },
        });
        return;
      }
      request.alias = "mockDocumentAnalysis";
      document.documentAnalysisReport = report;
      request.reply({
        statusCode: 200,
        body: {
          documentId,
          status: "COMPLETED",
          analysisReport: report,
        },
      });
    },
  );

  cy.intercept<CommentRequest>(
    "POST",
    "**/api/document/commentAnalysis",
    (request) => {
      if (request.body.documentId !== documentId) return;
      if (!user || !report || !document?.documentAnalysisReport) {
        throw new Error("Cannot comment before the mock analysis is completed");
      }
      expect(request.body.tenantId).to.eq(user.id);
      expect(request.body.comment.trim().length).to.be.at.least(10);
      report.comment = request.body.comment;
      request.reply({ statusCode: 200, body: withDocument(user) });
    },
  ).as("mockAnalysisComment");

  cy.intercept("DELETE", `**/api/document/${documentId}`, (request) => {
    document = undefined;
    report = undefined;
    request.reply({ statusCode: 200 });
  }).as("mockDocumentDelete");

  cy.intercept("DELETE", "**/api/file/*", (request) => {
    const id = Number(new URL(request.url).pathname.split("/").pop());
    if (id < 900000003 || id >= nextFileId) return;
    const files = document?.files?.filter((file) => file.id !== id);
    if (!document || !files || files.length === document.files?.length) {
      request.reply({ statusCode: 404 });
      return;
    }
    if (files.length) {
      document.files = files;
      document.documentAnalysisReport = undefined;
      scheduleAnalysis(files.length);
    } else {
      document = undefined;
      report = undefined;
    }
    request.reply({ statusCode: 200 });
  }).as("mockFileDelete");
}
