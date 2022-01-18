import { DfDocument } from "df-shared/src/models/DfDocument";
import { Guarantor } from "df-shared/src/models/Guarantor";
import store from "../store";

export const DocumentService = {
  hasDocument() {
    return (
      store.state.user.documents !== undefined &&
      store.state.user.documents.length > 0
    );
  },
  hasDoc(docType: string) {
    if (store.state.user.documents === undefined) {
      return false;
    }
    return store.state.user.documents.find((d: DfDocument) => {
      return d.documentCategory === docType;
    });
  },
  hasFile(docType: string) {
    const document = this.hasDoc(docType);
    if (document === undefined || document.files === undefined) {
      return false;
    }
    return document.files.length > 0;
  },
  guarantorHasDoc(g: Guarantor, docType: string) {
    if (!g || !g.documents) {
      return undefined;
    }
    return g.documents.find((d: DfDocument) => {
      return d.documentCategory === docType;
    });
  },
  guarantorHasFile(g: Guarantor, docType: string) {
    const document = this.guarantorHasDoc(g, docType);
    if (!document || !document.files) {
      return false;
    }
    return document.files.length > 0;
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
    if (!store.state.user.documents) {
      return [];
    }
    const docs = store.state.user.documents.filter((d: DfDocument) => {
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
    if (!g.documents) {
      return [];
    }
    const docs = g.documents.filter((d: DfDocument) => {
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
    if (!doc) {
      return "";
    }
    return doc.documentStatus || "";
  },
  getTenantResidencyStatus(): string {
    const doc = this.hasDoc("RESIDENCY");
    if (!doc) {
      return "";
    }
    return doc.documentStatus || "";
  },
  getTenantProfessionalStatus(): string {
    const doc = this.hasDoc("PROFESSIONAL");
    if (!doc) {
      return "";
    }
    return doc.documentStatus || "";
  },
  getTenantFinancialStatus(): string {
    const doc = this.hasDoc("FINANCIAL");
    if (!doc) {
      return "";
    }
    return doc.documentStatus || "";
  },
  getTenantTaxStatus(): string {
    const doc = this.hasDoc("TAX");
    if (!doc) {
      return "";
    }
    return doc.documentStatus || "";
  },
  getGuarantorIdentityStatus(g: Guarantor): string {
    const doc = this.guarantorHasDoc(
      g || store.state.selectedGuarantor,
      "IDENTIFICATION"
    );
    if (!doc) {
      return "";
    }
    return doc.documentStatus || "";
  },
  getGuarantorResidencyStatus(g: Guarantor): string {
    const doc = this.guarantorHasDoc(
      g || store.state.selectedGuarantor,
      "RESIDENCY"
    );
    if (!doc) {
      return "";
    }
    return doc.documentStatus || "";
  },
  getGuarantorProfessionalStatus(g: Guarantor): string {
    const doc = this.guarantorHasDoc(
      g || store.state.selectedGuarantor,
      "PROFESSIONAL"
    );
    if (!doc) {
      return "";
    }
    return doc.documentStatus || "";
  },
  getGuarantorFinancialStatus(g: Guarantor): string {
    // TODO : if status is financial, we should aggregate all the status
    const doc = this.guarantorHasDoc(
      g || store.state.selectedGuarantor,
      "FINANCIAL"
    );
    if (!doc) {
      return "";
    }
    return doc.documentStatus || "";
  },
  getGuarantorTaxStatus(g: Guarantor): string {
    const doc = this.guarantorHasDoc(g || store.state.selectedGuarantor, "TAX");
    return doc?.documentStatus || "";
  },
  getGuarantorLegalPersonIdentityStatus(): string {
    const doc = this.guarantorHasDoc(
      store.state.selectedGuarantor,
      "IDENTIFICATION_LEGAL_PERSON"
    );
    if (!doc) {
      return "";
    }
    return doc.documentStatus || "";
  },
  getGuarantorLegalPersonRepresentantStatus(): string {
    const doc = this.guarantorHasDoc(
      store.state.selectedGuarantor,
      "IDENTIFICATION"
    );
    if (!doc) {
      return "";
    }
    return doc.documentStatus || "";
  },
  getOrganismStatus(): string {
    const doc = this.guarantorHasDoc(
      store.state.selectedGuarantor,
      "IDENTIFICATION"
    );
    if (!doc) {
      return "";
    }
    return doc.documentStatus || "";
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
  guarantorStatus(documentType: string, guarantor: Guarantor) {
    let status;
    switch (documentType) {
      case "IDENTITY":
        status =
          DocumentService.getGuarantorIdentityStatus(guarantor) || "EMPTY";
        break;
      case "RESIDENCY":
        status =
          DocumentService.getGuarantorResidencyStatus(guarantor) || "EMPTY";
        break;
      case "PROFESSIONAL":
        status =
          DocumentService.getGuarantorProfessionalStatus(guarantor) || "EMPTY";
        break;
      case "FINANCIAL":
        status =
          DocumentService.getGuarantorFinancialStatus(guarantor) || "EMPTY";
        break;
      case "TAX":
        status = DocumentService.getGuarantorTaxStatus(guarantor) || "EMPTY";
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
