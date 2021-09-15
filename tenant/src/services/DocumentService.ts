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
  }
};
