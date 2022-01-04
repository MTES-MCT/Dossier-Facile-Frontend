import { DfDocument } from "../../../df-shared/src/models/DfDocument";
import { Guarantor } from "../../../df-shared/src/models/Guarantor";
import store from "../store";

export const UtilsService = {
  getMainUser() {
    return store.state.user.apartmentSharing.tenants.find((t: any) => {
      return t.tenantType === "CREATE";
    });
  },

  allDocumentsFilled() {
    return (
      this.documentsFilled() &&
      store.state.user.guarantors?.find((g: Guarantor) => {
        return !this.guarantorDocumentsFilled(g);
      }) === undefined
    );
  },
  documentsFilled() {
    return (
      this.hasDoc("IDENTIFICATION") &&
      this.hasDoc("PROFESSIONAL") &&
      this.hasDoc("RESIDENCY") &&
      this.isFinancialValid() &&
      this.isTaxValid()
    );
  },
  guarantorDocumentsFilled(g: Guarantor) {
    return (
      (g.typeGuarantor === "NATURAL_PERSON" &&
        this.guarantorHasDoc("IDENTIFICATION", g) &&
        this.guarantorHasDoc("PROFESSIONAL", g) &&
        this.guarantorHasDoc("RESIDENCY", g) &&
        this.isGuarantorFinancialValid(g) &&
        this.isGuarantorTaxValid(g)) ||
      (g.typeGuarantor === "LEGAL_PERSON" &&
        this.guarantorHasDoc("IDENTIFICATION", g) &&
        this.guarantorHasDoc("IDENTIFICATION_LEGAL_PERSON", g)) ||
      (g.typeGuarantor === "ORGANISM" &&
        this.guarantorHasDoc("IDENTIFICATION", g))
    );
  },
  hasDoc(docType: string) {
    const f = store.state.user.documents?.find((d: DfDocument) => {
      return (
        d.documentCategory === docType &&
        (d.documentStatus === "TO_PROCESS" || d.documentStatus === "VALIDATED")
      );
    })?.files;
    return f && f.length > 0;
  },
  isFinancialValid() {
    const docs = store.state.user.documents?.filter((d: DfDocument) => {
      return d.documentCategory === "FINANCIAL";
    });
    if (!docs || docs.length === 0) {
      return false;
    }

    for (const doc of docs) {
      if (!doc.noDocument && (doc.files?.length || 0) <= 0) {
        return false;
      }
    }

    return true;
  },

  isTaxValid() {
    const doc = store.state.user.documents?.find((d: DfDocument) => {
      return d.documentCategory === "TAX";
    });
    if (!doc) {
      return false;
    }
    if (doc.files) {
      return true;
    }
    if (doc.documentSubCategory !== "my-name") {
      return true;
    }

    return false;
  },
  guarantorHasDoc(docType: string, g: Guarantor) {
    const f = g.documents?.find((d: DfDocument) => {
      return (
        d.documentCategory === docType &&
        (d.documentStatus === "TO_PROCESS" || d.documentStatus === "VALIDATED")
      );
    })?.files;
    return f && f.length > 0;
  },
  isGuarantorFinancialValid(g: Guarantor) {
    const docs = g.documents?.filter((d: DfDocument) => {
      return d.documentCategory === "FINANCIAL";
    });
    if (!docs || docs.length === 0) {
      return false;
    }

    for (const doc of docs) {
      if (!doc.noDocument && (doc.files?.length || 0) <= 0) {
        return false;
      }
    }

    return true;
  },
  isGuarantorTaxValid(g: Guarantor) {
    const doc = g.documents?.find((d: DfDocument) => {
      return d.documentCategory === "TAX";
    });
    if (!doc) {
      return false;
    }
    if (doc.files) {
      return true;
    }
    if (doc.documentSubCategory !== "my-name") {
      return true;
    }

    return false;
  },
  isMobile() {
    return window.innerWidth < 768;
  },
  capitalize(word: string) {
    word = word[0].toUpperCase() + word.slice(1).toLowerCase();
    return word.replace(/([' -][A-Za-zÀ-ÖØ-öø-ÿ])/g, s => s.toUpperCase());
  }
};
