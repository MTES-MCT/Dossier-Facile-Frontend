import { User } from "df-shared-next/src/models/User";
import { DfDocument } from "../../../df-shared-next/src/models/DfDocument";
import { Guarantor } from "../../../df-shared-next/src/models/Guarantor";
import moment from "moment";
import { ToastService } from "./ToastService";

export const UtilsService = {
  getLastAddedGuarantor(user: User) {
    if (user.guarantors?.length && user.guarantors?.length > 0) {
      return user.guarantors[user.guarantors.length - 1];
    }
    throw Error("guarantor is not found");
  },
  guarantorHasDoc(docType: string, g: Guarantor | User) {
    const f = g.documents?.find((d: DfDocument) => {
      return (
        d.documentCategory === docType &&
        (d.documentStatus === "TO_PROCESS" || d.documentStatus === "VALIDATED")
      );
    })?.files;
    return f && f.length > 0;
  },
  isGuarantorDocumentValid(docType: string, g: Guarantor) {
    const document = g.documents?.find((d: DfDocument) => {
      return d.documentCategory === docType;
    });
    return this.isDocumentValid(document);
  },
  isDocumentValid(document?: DfDocument) {
    if (document === undefined) {
      return false;
    }
    if (!document.noDocument && (document.files?.length || 0) <= 0) {
      return false;
    }
    if (document.documentStatus === "DECLINED") {
      return false;
    }
    return true;
  },
  isMobile() {
    return window.innerWidth < 768;
  },
  capitalize(word: string) {
    if (word.length == 0) {
      return "";
    }
    word = word[0].toUpperCase() + word.slice(1).toLowerCase();
    return word.replace(/([' -][A-Za-zÀ-ÖØ-öø-ÿ])/g, (s) => s.toUpperCase());
  },
  canShareFile(user: User) {
    return (
      user.status === "VALIDATED" &&
      user.apartmentSharing?.tokenPublic !== undefined &&
      user.apartmentSharing?.tokenPublic !== ""
    );
  },
  useNewOtherResidencyCategory(): boolean {
    // TODO remove all code related to this method after 2024-01-29
    const activationDate = import.meta.env.VITE_OTHER_RESIDENCY_ACTIVATION_DATE;
    if (activationDate === undefined) {
      return true;
    }
    return moment().isAfter(activationDate);
  },
  handleCommonSaveError(err: any) {
    if (err?.response?.data?.message === null) {
      return;
    }
    if (err.response.data.message.includes("NumberOfPages")) {
      ToastService.saveFailedNumPages();
    } else {
      ToastService.saveFailed();
    }
  },
  tenantFullName(user: User) {
    const firstName = this.capitalize(user.firstName || "");
    const lastName = this.capitalize(user.lastName || "");
    const preferredName = this.capitalize(user.preferredName || "");
    return user.preferredName == null || user.preferredName.length == 0
      ? firstName + "\xa0" + lastName
      : firstName + "\xa0" + preferredName;
  },
  guarantorFullName(user: Guarantor) {
    const firstName = this.capitalize(user.firstName || "");
    const lastName = this.capitalize(user.lastName || "");
    return firstName + "\xa0" + lastName;
  },
};
