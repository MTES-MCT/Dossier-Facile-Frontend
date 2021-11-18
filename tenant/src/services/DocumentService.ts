import { DfDocument } from "df-shared/src/models/DfDocument";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { User } from "df-shared/src/models/User";
import store from "../store";

export const DocumentService = {
  hasDocument() {
    return (
      store.state.user.documents !== undefined &&
      store.state.user.documents?.length > 0
    );
  },
  hasDoc(docType: string) {
    return store.state.user.documents?.find((d: DfDocument) => {
      return d.documentCategory === docType;
    });
  },
  hasFile(docType: string) {
    const document = this.hasDoc(docType);
    return (document?.files?.length || 0) > 0;
  },
  guarantorHasDoc(g: Guarantor, docType: string) {
    if (!g) {
      return;
    }
    return g.documents?.find((d: DfDocument) => {
      return d.documentCategory === docType;
    });
  },
  guarantorHasFile(g: Guarantor, docType: string) {
    const document = this.guarantorHasDoc(g, docType);
    return (document?.files?.length || 0) > 0;
  },
  hasGuarantor(guarantorType: string) {
    const g = store.state.selectedGuarantor;
    return (
      g !== undefined &&
      g.documents !== undefined &&
      g.typeGuarantor === guarantorType
    );
  },
  getFiles(documentCategory: string) {
    const docs = store.state.user.documents?.filter((d: DfDocument) => {
      return d.documentCategory === documentCategory;
    });
    let files: any[] = [];
    if (docs === undefined) {
      return [];
    }
    for (let i = 0; i < docs.length; i++) {
      files = files.concat(docs[i].files || []);
    }

    return files;
  },
  getGuarantorFiles(g: Guarantor, documentCategory: string) {
    const docs = g.documents?.filter((d: DfDocument) => {
      return d.documentCategory === documentCategory;
    });
    let files: any[] = [];
    if (docs === undefined) {
      return files;
    }
    for (let i = 0; i < docs.length; i++) {
      files = files.concat(docs[i].files || []);
    }
    return files;
  },
  getTenantIdentityStatus(): string {
    const doc = this.hasDoc("IDENTIFICATION");
    return doc?.documentStatus || "";
  },
  getTenantResidencyStatus(): string {
    const doc = this.hasDoc("RESIDENCY");
    return doc?.documentStatus || "";
  },
  getTenantProfessionalStatus(): string {
    const doc = this.hasDoc("PROFESSIONAL");
    return doc?.documentStatus || "";
  },
  getTenantFinancialStatus(): string {
    const doc = this.hasDoc("FINANCIAL");
    return doc?.documentStatus || "";
  },
  getTenantTaxStatus(): string {
    const doc = this.hasDoc("TAX");
    return doc?.documentStatus || "";
  },
  getGuarantorIdentityStatus(): string {
    const doc = this.guarantorHasDoc(
      store.state.selectedGuarantor,
      "IDENTIFICATION"
    );
    return doc?.documentStatus || "";
  },
  getGuarantorResidencyStatus(): string {
    const doc = this.guarantorHasDoc(
      store.state.selectedGuarantor,
      "RESIDENCY"
    );
    return doc?.documentStatus || "";
  },
  getGuarantorProfessionalStatus(): string {
    const doc = this.guarantorHasDoc(
      store.state.selectedGuarantor,
      "PROFESSIONAL"
    );
    return doc?.documentStatus || "";
  },
  getGuarantorFinancialStatus(): string {
    const doc = this.guarantorHasDoc(
      store.state.selectedGuarantor,
      "FINANCIAL"
    );
    return doc?.documentStatus || "";
  },
  getGuarantorTaxStatus(): string {
    const doc = this.guarantorHasDoc(store.state.selectedGuarantor, "TAX");
    return doc?.documentStatus || "";
  },
  getGuarantorLegalPersonIdentityStatus(): string {
    const doc = this.guarantorHasDoc(
      store.state.selectedGuarantor,
      "IDENTIFICATION_LEGAL_PERSON"
    );
    return doc?.documentStatus || "";
  },
  getGuarantorLegalPersonRepresentantStatus(): string {
    const doc = this.guarantorHasDoc(
      store.state.selectedGuarantor,
      "IDENTIFICATION"
    );
    return doc?.documentStatus || "";
  },
  getOrganismStatus(): string {
    const doc = this.guarantorHasDoc(
      store.state.selectedGuarantor,
      "IDENTIFICATION"
    );
    return doc?.documentStatus || "";
  },
  tenantStatus(documentType: string) {
    let status;
    switch (documentType) {
      case "IDENTITY":
        status = DocumentService.getTenantIdentityStatus() || "EMPTY";
        break;
      case "RESIDENCY":
        status = DocumentService.getTenantResidencyStatus() || "EMPTY";
        break;
      case "PROFESSIONAL":
        status = DocumentService.getTenantProfessionalStatus() || "EMPTY";
        break;
      case "FINANCIAL":
        status = DocumentService.getTenantFinancialStatus() || "EMPTY";
        break;
      case "TAX":
        status = DocumentService.getTenantTaxStatus() || "EMPTY";
        break;
    }
    if (status === "TO_PROCESS" && store.state.user.status !== "TO_PROCESS") {
      return "FILLED";
    }
    return status;
  },
  guarantorStatus(documentType: string) {
    let status;
    switch (documentType) {
      case "IDENTITY":
        status = DocumentService.getGuarantorIdentityStatus() || "EMPTY";
        break;
      case "RESIDENCY":
        status = DocumentService.getGuarantorResidencyStatus() || "EMPTY";
        break;
      case "PROFESSIONAL":
        status = DocumentService.getGuarantorProfessionalStatus() || "EMPTY";
        break;
      case "FINANCIAL":
        status = DocumentService.getGuarantorFinancialStatus() || "EMPTY";
        break;
      case "TAX":
        status = DocumentService.getGuarantorTaxStatus() || "EMPTY";
        break;
      case "IDENTIFICATION_LEGAL_PERSON":
        status =
          DocumentService.getGuarantorLegalPersonIdentityStatus() || "EMPTY";
        break;
      case "IDENTIFICATION":
        status =
          DocumentService.getGuarantorLegalPersonRepresentantStatus() ||
          "EMPTY";
    }
    if (
      status === "TO_PROCESS" &&
      store.state.selectedGuarantor.status !== "TO_PROCESS"
    ) {
      return "FILLED";
    }
    return status;
  }
};
