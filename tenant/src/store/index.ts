/* eslint-disable @typescript-eslint/camelcase */
import Vue from "vue";
import Vuex from "vuex";
import { AuthService } from "df-shared/src/services/AuthService";
import { MessageService } from "../services/MessageService";
import { ProfileService } from "../services/ProfileService";
import router from "../router";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { User } from "df-shared/src/models/User";
import i18n from "../i18n";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { AnalyticsService } from "../services/AnalyticsService";
import { RegisterService } from "../services/RegisterService";
import { UtilsService } from "../services/UtilsService";
import { FinancialDocument } from "df-shared/src/models/FinancialDocument";
import { DocumentType } from "df-shared/src/models/Document";
import { DocumentTypeConstants } from "../components/documents/share/DocumentTypeConstants";
import {DfMessage} from "df-shared/src/models/DfMessage";

Vue.use(Vuex);

export class DfState {
  user: User | null = null;
  selectedGuarantor = new Guarantor();
  status = { loggedIn: false };
  isFunnel = false;
  spouseAuthorize = false;
  coTenantAuthorize = false;
  coTenants: User[] | null = [];
  financialDocumentSelected?: FinancialDocument = new FinancialDocument();
  editFinancialDocument = false;
  newMessage = 0;
  messageList: DfMessage[][] = [];
}

const MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
const FC_LOGOUT_URL = process.env.VUE_APP_FC_LOGOUT_URL || "";

const initialStore = new DfState() as any; // TODO fix typing errors and remove cast to any

const store = new Vuex.Store({
  state: initialStore,
  mutations: {
    initState(state) {
      Object.assign(state, new DfState());
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
      AnalyticsService.loginFail();
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
      state.user = null;
      AnalyticsService.registerSuccess();
    },
    registerFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
      AnalyticsService.registerFail();
    },
    unlinkFCSuccess(state) {
      state.user.franceConnect = false;
      AnalyticsService.unlinkFCSuccess();
    },
    loadUser(state, user) {
      Vue.set(state, "user", user);
      Vue.set(state.status, "loggedIn", true);

      const applicationType = user?.apartmentSharing.applicationType;
      Vue.set(state.user, "applicationType", applicationType);

      if (applicationType === "COUPLE") {
        Vue.set(state, "spouseAuthorize", true);
      }
      if (applicationType === "GROUP") {
        Vue.set(state, "coTenantAuthorize", true);
      }
      // load CoTenants - basic information inside tenant
      if (applicationType === "COUPLE") {
        Vue.set(
          state,
          "coTenants",
          state.user?.apartmentSharing?.tenants.filter(
            (t: User) => t.id != state.user?.id
          )
        );
      }
      if (state.selectedGuarantor?.id) {
        let guarantor = user.guarantors.find((g: Guarantor) => {
          return g.id === state.selectedGuarantor.id;
        });

        if (!guarantor) {
          state.coTenants.forEach((t: User) => {
            const tmpGuarantor = t.guarantors?.find((g: Guarantor) => {
              return g.id === state.selectedGuarantor.id;
            });
            if (tmpGuarantor !== undefined) {
              guarantor = tmpGuarantor;
              return;
            }
          });
        }
        if (guarantor !== undefined) {
          Vue.set(state, "selectedGuarantor", guarantor);
          return;
        }
      }
      Vue.set(state, "selectedGuarantor", new Guarantor());
    },
    setSelectedGuarantor(state, guarantor: Guarantor) {
      Vue.set(state, "selectedGuarantor", guarantor);
    },
    createCoTenant(state, coTenant: User) {
      const u = new User();
      u.firstName = coTenant.email;
      u.firstName = coTenant.firstName;
      u.firstName = coTenant.lastName;
      state.user.apartmentSharing.tenants.push(u);
    },
    updateMessages(state, { tenantId, messageList }) {
      if (state.messageList.length < messageList.length) {
        state.newMessage = messageList.length - state.messageList.length;
      }
      state.messageList[tenantId] = messageList;
    },
    deleteRoommates(state, email) {
      const tenants = state.user.apartmentSharing.tenants.filter((t: User) => {
        return t.email !== email;
      });
      state.user.applicationType = "ALONE";
      state.user.apartmentSharing.tenants = tenants;
    },
    readMessage(state) {
      state.newMessage = 0;
    },
    updateCoupleAuthorize(state, authorize) {
      state.spouseAuthorize = authorize;
    },
    updateCoTenantAuthorize(state, authorize) {
      state.coTenantAuthorize = authorize;
    },
    isFunnel(state, isFunnel) {
      state.isFunnel = isFunnel;
    },
    updateSkipLinks(state, skipLinks) {
      state.skipLinks = skipLinks;
    },
    updateUserFirstname(state, firstname) {
      state.user.firstName = firstname;
    },
    updateUserLastname(state, lastname) {
      state.user.lastName = lastname;
    },
    updateUserPreferredname(state, preferredname) {
      state.user.preferredName = preferredname;
    },
    updateUserZipcode(state, zipcode) {
      state.user.zipCode = zipcode;
    },
    selectDocumentFinancial(state, d: FinancialDocument) {
      state.financialDocumentSelected = Object.assign({}, d);
      state.editFinancialDocument = d !== undefined;
    },
    createDocumentFinancial(state) {
      state.financialDocumentSelected = Object.assign(
        {},
        new FinancialDocument()
      );
      state.editFinancialDocument = true;
    },
    selectGuarantorDocumentFinancial(state, d: FinancialDocument) {
      Vue.set(state, "guarantorFinancialDocumentSelected", d);
      Vue.set(state, "editGuarantorFinancialDocument", d !== undefined);
    },
    createGuarantorDocumentFinancial(state) {
      Vue.set(
        state,
        "guarantorFinancialDocumentSelected",
        new FinancialDocument()
      );
      Vue.set(state, "editGuarantorFinancialDocument", true);
    }
  },
  actions: {
    logout({ commit }, redirect = true) {
      const isFC = this.state.user.franceConnect;
      return AuthService.logout()
        .then(async () => {
          await commit("logout");
          await commit("initState");
          if (isFC) {
            window.location.replace(FC_LOGOUT_URL);
            return;
          } else if (redirect) {
            window.location.replace(MAIN_URL);
            return;
          }
          location.reload();
        })
        .catch(() => {
          location.reload();
        });
    },
    deleteAccount({ commit }) {
      const isFC = this.state.user.franceConnect;
      return AuthService.deleteAccount().then(
        response => {
          commit("logout");
          commit("initState");
          if (isFC) {
            window.location.replace(
              "https://fcp.integ01.dev-franceconnect.fr/api/v1/logout"
            );
            return;
          } else {
            window.location.replace(MAIN_URL);
          }
          return Promise.resolve(response);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    register({ commit }, { user, source, internalPartnerId }) {
      return AuthService.register(user, source, internalPartnerId).then(
        response => {
          commit("registerSuccess");
          return Promise.resolve(response.data);
        },
        error => {
          commit("registerFailure");
          return Promise.reject(error);
        }
      );
    },
    resetPassword(_, user) {
      return AuthService.resetPassword(user).then(
        user => {
          return Promise.resolve(user);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    unlinkFranceConnect({ commit }, user: User) {
      if (!user.franceConnect) {
        return Promise.reject("Account is not a FranceConnect Account");
      }
      return ProfileService.unlinkFranceConnect().then(
        () => {
          // Force reload because some backend's GET endpoints retrieve and save user data by using JWT's information.
          (Vue as any).$keycloak.updateToken(-1).catch((err: any) => {
            console.error("Unlink FC Error" + err);
          });
          return commit("unlinkFCSuccess");
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    loadUser({ commit }) {
      const userAlreadyLoaded = this.state.user !== null;
      if (userAlreadyLoaded) {
        return Promise.resolve();
      }
      return AuthService.loadUser().then(
        response => {
          commit("loadUser", response.data);
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    loadCoTenant({ commit }, coTenant: User) {
      return ProfileService.getCoTenant(coTenant.id).then(
        response => {
          commit("loadCoTenant", response.data);
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    setNames({ commit }, user: User) {
      if (user.firstName && !user.franceConnect) {
        user.firstName = UtilsService.capitalize(user.firstName);
      }
      if (user.lastName && !user.franceConnect) {
        user.lastName = UtilsService.capitalize(user.lastName);
      }
      if (user.preferredName && !user.franceConnect) {
        user.preferredName = UtilsService.capitalize(user.preferredName);
      }
      return ProfileService.saveNames(user).then(
        response => {
          return commit("loadUser", response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    setRoommates({ commit }, data) {
      return ProfileService.saveRoommates(data).then(
        response => {
          return commit("loadUser", response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    setCoTenants({ commit }, data) {
      return ProfileService.saveCoTenants(data).then(
        response => {
          return commit("loadUser", response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    setLang(_, lang) {
      i18n.locale = lang;
      const html = document.documentElement;
      html.setAttribute("lang", i18n.locale);
      const aYearFromNow = new Date();
      aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
      Vue.$cookies.set(
        "lang",
        lang,
        aYearFromNow,
        "",
        MAIN_URL.endsWith("dossierfacile.fr") ? "dossierfacile.fr" : "localhost"
      );
    },
    validateFile(
      _,
      data: { honorDeclaration: boolean; clarification: string }
    ) {
      return ProfileService.validateFile(
        data.honorDeclaration,
        data.clarification
      ).then(
        () => {
          AnalyticsService.validateFile();
          this.dispatch("loadUser").then(() => {
            router.push("/account");
          });
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    addNaturalGuarantor({ commit }) {
      return ProfileService.setGuarantorType({
        typeGuarantor: "NATURAL_PERSON"
      }).then(
        response => {
          commit("loadUser", response.data);
          this.dispatch("setGuarantorPage", {
            guarantor: this.state.user.guarantors[
              this.state.user.guarantors.length - 1
            ],
            substep: "0"
          });
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    async deleteAllGuarantors() {
      const promises = this.state.user.guarantors.map(async (g: Guarantor) => {
        await ProfileService.deleteGuarantor(g);
      });
      return Promise.all(promises).then(
        () => {
          return this.dispatch("loadUser");
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    deleteGuarantor(_, g: Guarantor) {
      return ProfileService.deleteGuarantor(g).then(
        async response => {
          await this.dispatch("loadUser");
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    setGuarantorType({ commit }, guarantorType: Guarantor) {
      return ProfileService.setGuarantorType(guarantorType).then(
        async response => {
          commit("loadUser", response.data);
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    changePassword({ commit }, user: User) {
      return AuthService.changePassword(user).then(
        response => {
          commit("loadUser", response.data);
          return Promise.resolve(user);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    createPasswordCouple({ commit }, user: User) {
      return AuthService.createPasswordCouple(user).then(
        response => {
          commit("loadUser", response.data);
          return Promise.resolve(user);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    createPasswordGroup({ commit }, user: User) {
      return AuthService.createPasswordGroup(user).then(
        response => {
          commit("loadUser", response.data);
          return Promise.resolve(user);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    deleteDocument(_, docId: number) {
      return ProfileService.deleteDocument(docId).then(
        () => {
          return this.dispatch("loadUser");
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    updateMessages({ commit }) {
      if (this.getters.isLoggedIn) {
        MessageService.updateMessages().then(data => {
          commit("updateMessages", {
            tenantId: this.state.user.id,
            messageList: data.data
          });
        });
        const spouse = UtilsService.getSpouse();
        if (spouse) {
          MessageService.updateMessages(spouse.id).then(data => {
            commit("updateMessages", {
              tenantId: spouse.id,
              messageList: data.data
            });
          });
        }
      }
    },
    sendMessage(_, { message, tenantId }) {
      return MessageService.postMessage({
        tenantId: tenantId,
        messageBody: message
      }).then(() => {
        this.dispatch("updateMessages");
      });
    },
    deleteCoTenant(_, tenant: User) {
      if (tenant.id && tenant.id > 0) {
        ProfileService.deleteCoTenant(tenant.id);
      }
      this.commit("deleteRoommates", tenant.email);
    },
    async setTenantPage(_, { substep }) {
      router.push({
        name: "TenantDocuments",
        params: { substep }
      });
    },
    async setGuarantorPage({ commit }, { guarantor, substep, tenantId }) {
      await commit("setSelectedGuarantor", guarantor);
      if (tenantId && tenantId != this.state.user.id) {
        router.push({
          name: "TenantGuarantorDocuments",
          params: {
            step: "5",
            substep: substep,
            tenantId: tenantId,
            guarantorId: guarantor.id
          }
        });
      } else {
        router.push({
          name: "GuarantorDocuments",
          params: { substep }
        });
      }
    },
    saveTenantIdentification({ commit }, formData) {
      return RegisterService.saveTenantIdentification(formData).then(
        response => {
          commit("loadUser", response.data);
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    saveTaxAuth({ commit }, { allowTax, fcToken, tenantId }) {
      return RegisterService.saveTaxAuth(allowTax, fcToken, tenantId).then(
        response => {
          commit("loadUser", response.data);
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    saveCoTenantIdentification({ commit }, formData) {
      return RegisterService.saveCoTenantIdentification(formData).then(
        response => {
          commit("loadUser", response.data);
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    saveGuarantorName({ commit }, formData) {
      return RegisterService.saveGuarantorName(formData).then(
        response => {
          commit("loadUser", response.data);
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    saveGuarantorIdentification({ commit }, formData) {
      return RegisterService.saveGuarantorIdentification(formData).then(
        response => {
          commit("loadUser", response.data);
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    saveTenantResidency({ commit }, formData) {
      return RegisterService.saveTenantResidency(formData).then(
        response => {
          commit("loadUser", response.data);
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    saveGuarantorResidency({ commit }, formData) {
      return RegisterService.saveGuarantorResidency(formData).then(
        response => {
          commit("loadUser", response.data);
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    saveTenantProfessional({ commit }, formData) {
      return RegisterService.saveTenantProfessional(formData).then(
        response => {
          commit("loadUser", response.data);
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    saveGuarantorProfessional({ commit }, formData) {
      return RegisterService.saveGuarantorProfessional(formData).then(
        response => {
          commit("loadUser", response.data);
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    saveTenantFinancial({ commit }, formData) {
      return RegisterService.saveTenantFinancial(formData).then(
        async response => {
          await commit("loadUser", response.data);
          const fd = await this.getters.tenantFinancialDocuments;
          if (fd === undefined) {
            return Promise.resolve(response.data);
          }
          if (formData.has("id")) {
            const s = fd.find((f: any) => {
              return f.id.toString() === formData.get("id");
            });
            if (s !== undefined) {
              await commit("selectDocumentFinancial", s);
            } else {
              await commit("selectDocumentFinancial", fd[fd.length - 1]);
            }
          } else {
            await commit("selectDocumentFinancial", fd[fd.length - 1]);
          }
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    saveGuarantorFinancial({ commit }, formData) {
      return RegisterService.saveGuarantorFinancial(formData)
        .then(async response => {
          await commit("loadUser", response.data);
          const fd = this.getters.guarantorFinancialDocuments;
          if (fd === undefined) {
            return Promise.resolve(response.data);
          }
          if (formData.has("id")) {
            const s = fd.find((f: any) => {
              return f.id.toString() === formData.get("id");
            });
            await commit("selectGuarantorDocumentFinancial", s);
          } else {
            await commit("selectGuarantorDocumentFinancial", fd[fd.length - 1]);
          }
          return Promise.resolve(response.data);
        })
        .catch(error => {
          return Promise.reject(error);
        });
    },
    saveTenantTax({ commit }, formData) {
      return RegisterService.saveTenantTax(formData).then(
        response => {
          commit("loadUser", response.data);
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    saveGuarantorTax({ commit }, formData) {
      return RegisterService.saveGuarantorTax(formData).then(
        response => {
          commit("loadUser", response.data);
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    firstProfilePage() {
      if (
        !this.state.user.firstName ||
        !this.state.user.lastName ||
        (!this.state.user.zipCode && this.state.user.documents.length == 0)
      ) {
        router.push({ name: "TenantName" });
        return;
      }
      if (!this.state.user.applicationType) {
        router.push({ name: "TenantType" });
        return;
      }
      if (!UtilsService.hasDoc("IDENTIFICATION")) {
        router.push({ name: "TenantDocuments", params: { substep: "1" } });
        return;
      }
      if (!UtilsService.hasDoc("RESIDENCY")) {
        router.push({ name: "TenantDocuments", params: { substep: "2" } });
        return;
      }
      if (!UtilsService.hasDoc("PROFESSIONAL")) {
        router.push({ name: "TenantDocuments", params: { substep: "3" } });
        return;
      }
      if (!UtilsService.isFinancialValid()) {
        router.push({ name: "TenantDocuments", params: { substep: "4" } });
        return;
      }
      if (!UtilsService.isTaxValid()) {
        router.push({ name: "TenantDocuments", params: { substep: "5" } });
        return;
      }
      if (this.state.user.guarantors) {
        for (const g of this.state.user.guarantors) {
          if (!UtilsService.guarantorHasDoc("IDENTIFICATION", g)) {
            this.dispatch("setGuarantorPage", { guarantor: g, substep: 1 });
            return;
          }
          if (!UtilsService.guarantorHasDoc("RESIDENCY", g)) {
            this.dispatch("setGuarantorPage", { guarantor: g, substep: 2 });
            return;
          }
          if (!UtilsService.guarantorHasDoc("PROFESSIONAL", g)) {
            this.dispatch("setGuarantorPage", { guarantor: g, substep: 3 });
            return;
          }
          if (!UtilsService.isGuarantorFinancialValid(g)) {
            this.dispatch("setGuarantorPage", { guarantor: g, substep: 4 });
            return;
          }
          if (!UtilsService.isGuarantorTaxValid(g)) {
            this.dispatch("setGuarantorPage", { guarantor: g, substep: 5 });
            return;
          }
        }
      }

      if (!this.state.user.honorDeclaration) {
        router.push({ name: "ValidateFile" });
        return;
      }

      router.push({ name: "TenantName" });
    },
    updateSelectedGuarantor({ commit }, tenantId: number) {
      let guarantors;
      if (this.state.user.id === tenantId) {
        guarantors = this.state.user.guarantors;
      } else {
        const coTenant = this.state.coTenants.find((r: User) => {
          return r.id === tenantId;
        });
        guarantors = coTenant?.guarantors;
      }

      if (guarantors && guarantors.length > 0) {
        commit("setSelectedGuarantor", guarantors[guarantors.length - 1]);
        return;
      }
      commit("setSelectedGuarantor", new Guarantor());
    }
  },
  getters: {
    getTenantDocuments(state): DfDocument[] {
      return state.user?.documents || [];
    },
    getTenantIdentificationDocument(state): DfDocument | undefined {
      return state.user?.documents?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
      });
    },
    getTenantResidencyDocument(state): DfDocument | undefined {
      return state.user?.documents?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
      });
    },
    getTenantProfessionalDocument(state): DfDocument | undefined {
      return state.user?.documents?.find((d: DfDocument) => {
        return d.documentCategory === "PROFESSIONAL";
      });
    },
    getTenantTaxDocument(state): DfDocument | undefined {
      return state.user?.documents?.find((d: DfDocument) => {
        return d.documentCategory === "TAX";
      });
    },
    getGuarantorIdentificationLegalPersonDocument(
      state
    ): DfDocument | undefined {
      return state.selectedGuarantor?.documents?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION_LEGAL_PERSON";
      });
    },
    getGuarantorIdentificationDocument(state): DfDocument | undefined {
      return state.selectedGuarantor?.documents?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
      });
    },
    getGuarantorResidencyDocument(state): DfDocument | undefined {
      return state.selectedGuarantor?.documents?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
      });
    },
    getGuarantorProfessionalDocument(state): DfDocument | undefined {
      return state.selectedGuarantor?.documents?.find((d: DfDocument) => {
        return d.documentCategory === "PROFESSIONAL";
      });
    },
    getGuarantorTaxDocument(state): DfDocument | undefined {
      return state.selectedGuarantor?.documents?.find((d: DfDocument) => {
        return d.documentCategory === "TAX";
      });
    },

    getGuarantorDocuments(state): DfDocument[] {
      return state.selectedGuarantor.documents || [];
    },
    guarantor(state): Guarantor {
      return state.selectedGuarantor;
    },
    isLoggedIn(): boolean {
      return (Vue as any).$keycloak.authenticated;
    },
    userToEdit(state): User | null {
      return state.user;
    },
    getRoommates(state): User[] {
      return state.user.apartmentSharing.tenants
        .filter((r: User) => {
          return r.email != state.user.email;
        })
        .map((u: User) => ({ ...u }));
    },
    newMessage(state): boolean {
      return state.newMessage;
    },
    spouseAuthorize(state): boolean {
      return state.spouseAuthorize;
    },
    coTenantAuthorize(state): boolean {
      return state.coTenantAuthorize;
    },
    guarantors(state): Guarantor[] {
      return state.user.guarantors;
    },
    tenantFinancialDocuments(state): FinancialDocument[] {
      const financialDocuments: FinancialDocument[] = [];
      if (state.user.documents !== null) {
        const docs = state.user.documents?.filter((d: DfDocument) => {
          return d.documentCategory === "FINANCIAL";
        });
        if (docs !== undefined && docs.length > 0) {
          docs
            .sort((a: DfDocument, b: DfDocument) => {
              return (a?.id || 0) - (b?.id || 0);
            })
            .forEach((d: DfDocument) => {
              const f = new FinancialDocument();
              f.noDocument = d.noDocument || false;
              f.customText = d.customText || "";
              if (f.customText === "-") {
                f.customText = "";
              }
              f.monthlySum = d.monthlySum || 0;
              f.id = d.id;

              const localDoc = DocumentTypeConstants.FINANCIAL_DOCS.find(
                (d2: DocumentType) => {
                  return d2.value === d.documentSubCategory;
                }
              );
              if (localDoc !== undefined) {
                f.documentType = localDoc;
              }
              financialDocuments.push(f);
            });
        }
      }
      return financialDocuments;
    },
    guarantorFinancialDocuments(state): FinancialDocument[] {
      const financialdocuments: FinancialDocument[] = [];
      const g: Guarantor = state.selectedGuarantor;
      const dfDocs: DfDocument[] = g.documents || [];
      if (dfDocs !== null) {
        const docs = dfDocs?.filter((d: DfDocument) => {
          return d.documentCategory === "FINANCIAL";
        });
        if (docs !== undefined && docs.length > 0) {
          docs
            .sort((a: DfDocument, b: DfDocument) => {
              return (a?.id || 0) - (b?.id || 0);
            })
            .forEach((d: DfDocument) => {
              const f = new FinancialDocument();
              f.noDocument = d.noDocument || false;
              f.customText = d.customText || "";
              f.monthlySum = d.monthlySum || 0;
              f.id = d.id;

              const localDoc = DocumentTypeConstants.GUARANTOR_FINANCIAL_DOCS.find(
                (d2: DocumentType) => {
                  return d2.value === d.documentSubCategory;
                }
              );
              if (localDoc !== undefined) {
                f.documentType = localDoc;
              }
              financialdocuments.push(f);
            });
        }
      }
      return financialdocuments;
    },
    financialDocumentSelected(state): FinancialDocument {
      return state.financialDocumentSelected;
    },
    editFinancialDocument(state): FinancialDocument {
      return state.editFinancialDocument;
    },
    guarantorFinancialDocumentSelected(state): FinancialDocument {
      return state.guarantorFinancialDocumentSelected;
    },
    editGuarantorFinancialDocument(state): FinancialDocument {
      return state.editGuarantorFinancialDocument;
    },
    coTenants(state): User[] {
      return state.coTenants;
    }
  },
  modules: {}
});

export default store;

store.subscribe((mutation, state) => {
  localStorage.setItem("store", JSON.stringify(state));
});
