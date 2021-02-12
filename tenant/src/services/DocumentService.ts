import { DfDocument } from "df-shared/src/models/DfDocument";
import { User } from "df-shared/src/models/User";
import store from "../store";

export const DocumentService = {
  hasDocument() {
    return store.state.user.documents !== undefined && store.state.user.documents?.length > 0;
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
  guarantorHasDoc(docType: string) {
    return store.state.selectedGuarantor.documents?.find((d: DfDocument) => {
      return d.documentCategory === docType;
    });
  },
  guarantorHasFile(docType: string) {
    const document = this.guarantorHasDoc(docType);
    return (document?.files?.length || 0) > 0;
  },
  hasGuarantor(guarantorType: string) {
    const g = store.state.selectedGuarantor
    return g !== undefined && g.documents !== undefined && g.typeGuarantor === guarantorType
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
  getGuarantorFiles(documentCategory: string) {
    const docs = store.state.selectedGuarantor.documents?.filter((d: DfDocument) => {
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
  }
};
