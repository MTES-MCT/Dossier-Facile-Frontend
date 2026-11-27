import type { User } from "df-shared-next/src/models/User";
import { mockDocumentAnalysis } from "../support/documentAnalysisMock";

const page = "/__document-analysis-mock";
const certificate = "/api/register/guarantorOrganism/documentCertificate";

function post(path: string, body: FormData) {
  return cy.window().then((win) => win.fetch(path, { method: "POST", body }));
}

function certificateForm(guarantorId?: string) {
  const form = new FormData();
  form.set("typeDocumentCertificate", "VISALE");
  form.set("noDocument", "false");
  form.set("documents[0]", new Blob(["test"]), "certificate.pdf");
  if (guarantorId !== undefined) form.set("guarantorId", guarantorId);
  return form;
}

describe("document analysis mock", () => {
  beforeEach(() => {
    cy.intercept("GET", page, {
      headers: { "content-type": "text/html" },
      body: "<!doctype html><title>Document analysis mock</title>",
    });
    cy.visit(Cypress.expose("tenantUrl") + page);
  });

  it("blocks files on unexpected registration routes and allows ordinary fields through", () => {
    const path = "/api/register/documentFinancial";
    // Stand in for the server so a broken guard cannot send the test file anywhere.
    cy.intercept({ method: "POST", pathname: path }, { statusCode: 204 }).as(
      "server",
    );
    mockDocumentAnalysis("tax", []);

    const fields = new FormData();
    fields.set("monthlySum", "2000");
    post(path, fields).its("status").should("eq", 204);
    cy.wait("@server");

    const upload = new FormData();
    upload.set("documents[0]", new Blob(["test"]), "wrong-route.pdf");
    post(path + "?test=1", upload).then(async (response) => {
      expect(response.status).to.eq(400);
      expect((await response.json()).message).to.include(path);
    });
    cy.get("@server.all").should("have.length", 1);
  });

  it("requires the submitted Visale guarantor to belong to the profile and attaches the document to that guarantor", () => {
    const profile = {
      id: 1,
      guarantors: [
        { id: 11, typeGuarantor: "ORGANISM", documents: [] },
        { id: 12, typeGuarantor: "NATURAL_PERSON", documents: [] },
        { id: 13, typeGuarantor: "ORGANISM", documents: [] },
      ],
    } satisfies Pick<User, "id" | "guarantors">;
    cy.intercept("GET", "/api/tenant/profile", { body: profile });
    cy.intercept("POST", certificate, { statusCode: 500 }).as("server");
    mockDocumentAnalysis("visale", []);
    cy.window().then((win) => win.fetch("/api/tenant/profile"));

    for (const invalid of [undefined, "12", "99"]) {
      post(certificate, certificateForm(invalid))
        .its("status")
        .should("eq", 400);
    }
    async function checkGuarantors(response: Response) {
      expect(response.status).to.eq(200);
      const result: User = await response.json();
      expect(result.guarantors[0].documents).to.be.empty;
      expect(result.guarantors[1].documents).to.be.empty;
      expect(result.guarantors[2].documents).to.have.length(1);
      expect(result.guarantors[2].documents?.[0].documentSubCategory).to.eq(
        "VISALE",
      );
    }
    post(certificate, certificateForm("13")).then(checkGuarantors);
    cy.window()
      .then((win) => win.fetch("/api/tenant/profile"))
      .then(checkGuarantors);
    cy.get("@server.all").should("have.length", 0);
  });
});
