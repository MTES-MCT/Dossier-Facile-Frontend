import { User } from "df-shared/src/models/User";
import { DfDocument } from "../../../df-shared/src/models/DfDocument";
import { Guarantor } from "../../../df-shared/src/models/Guarantor";
import store from "../store";
import moment from "moment";
import { Vue } from "vue-property-decorator";

export const UtilsService = {
  getMainUser() {
    return store.state.user.apartmentSharing.tenants.find((t: any) => {
      return t.tenantType === "CREATE";
    });
  },
  getSpouse() {
    if (store.state.user.apartmentSharing.applicationType === "COUPLE") {
      return store.state.user.apartmentSharing.tenants.find((t: any) => {
        return t.id != store.state.user.id;
      });
    }
    return null;
  },
  getTenant(id: number) {
    if (id === store.state.user.id) {
      return store.state.user;
    }
    return store.state.user.apartmentSharing.tenants.find((r: User) => {
      return r.id === id;
    }) as User;
  },
  getLastAddedGuarantor(user: User) {
    if (user.guarantors?.length && user.guarantors?.length > 0) {
      return user.guarantors[user.guarantors.length - 1];
    }
    throw Error("guarantor is not found");
  },
  allDocumentsFilled(): boolean {
    const user = store.state.user;
    const tenantDocumentsFilled = (tenant: User) =>
      this.documentsFilled(tenant) &&
      tenant.guarantors?.every((g) => !!this.guarantorDocumentsFilled(g));

    if (user.applicationType === "COUPLE") {
      const cotenants = user.apartmentSharing?.tenants.filter(
        (cotenant: User) => user.id !== cotenant.id
      );
      return (
        (tenantDocumentsFilled(user) &&
          cotenants.every(tenantDocumentsFilled)) ||
        false
      );
    }
    return tenantDocumentsFilled(user) || false;
  },
  allNamesFilled(): boolean {
    const userNamesFilled = (u: User) => u.firstName && u.lastName;
    const guarantorNamesFilled = (g: Guarantor) =>
      !g ||
      (g.typeGuarantor === "NATURAL_PERSON" && g.firstName && g.lastName) ||
      (g.typeGuarantor === "LEGAL_PERSON" && g.legalPersonName) ||
      g.typeGuarantor === "ORGANISM";

    const user = store.state.user;
    if (user.applicationType === "COUPLE") {
      const couple = user.apartmentSharing?.tenants.find(
        (cotenant: User) => user.id !== cotenant.id
      ) as User;

      if (
        !userNamesFilled(couple) ||
        !couple.guarantors.every(guarantorNamesFilled)
      ) {
        return false;
      }
    }
    return (userNamesFilled(user) &&
      user.guarantors.every(guarantorNamesFilled)) as boolean;
  },
  documentsFilled(user?: User) {
    return (
      this.hasDoc("IDENTIFICATION", user) &&
      this.hasDoc("PROFESSIONAL", user) &&
      this.hasDoc("RESIDENCY", user) &&
      this.isFinancialValid(user) &&
      this.isTaxValid(user)
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
  hasDoc(docType: string, user?: User) {
    const u = user ? user : store.state.user;
    const f = u.documents?.find((d: DfDocument) => {
      return (
        d.documentCategory === docType &&
        (d.documentStatus === "TO_PROCESS" || d.documentStatus === "VALIDATED")
      );
    })?.files;
    return f && f.length > 0;
  },
  isFinancialValid(user?: User) {
    const u = user ? user : store.state.user;
    const docs = u.documents?.filter((d: DfDocument) => {
      return d.documentCategory === "FINANCIAL";
    });
    if (!docs || docs.length === 0) {
      return false;
    }

    for (const doc of docs) {
      if (
        (!doc.noDocument && (doc.files?.length || 0) <= 0) ||
        doc.documentStatus === "DECLINED"
      ) {
        return false;
      }
    }

    return true;
  },

  isTaxValid(user?: User) {
    const u = user ? user : store.state.user;
    const doc = u.documents?.find((d: DfDocument) => {
      return d.documentCategory === "TAX";
    });
    if (!doc) {
      return false;
    }
    if (doc.files) {
      return true;
    }
    if (doc.subCategory !== "my-name") {
      return true;
    }

    return false;
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
  isGuarantorFinancialValid(g: Guarantor) {
    const docs = g.documents?.filter((d: DfDocument) => {
      return d.documentCategory === "FINANCIAL";
    });
    if (!docs || docs.length === 0) {
      return false;
    }

    for (const doc of docs) {
      if (
        (!doc.noDocument && (doc.files?.length || 0) <= 0) ||
        doc.documentStatus === "DECLINED"
      ) {
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
    if (doc.subCategory !== "my-name") {
      return true;
    }

    return false;
  },
  isMobile() {
    return window.innerWidth < 768;
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
    const activationDate = process.env.VUE_APP_OTHER_RESIDENCY_ACTIVATION_DATE;
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
      Vue.toasted.global.save_failed_num_pages();
    } else {
      Vue.toasted.global.save_failed();
    }
  },
};
