/* eslint-disable @typescript-eslint/camelcase */
import Vue from "vue";
import Vuex from "vuex";
import { AuthService } from "df-shared/src/services/AuthService";
import { MessageService } from "@/services/MessageService";
import { ProfileService } from "@/services/ProfileService";
import router from "../router";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { User } from "df-shared/src/models/User";
import i18n from "@/i18n";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { DfMessage } from "df-shared/src/models/DfMessage";
import { AnalyticsService } from "@/services/AnalyticsService";

Vue.use(Vuex);

export class DfState {
  tenantStep = 0;
  tenantSubStep = 1;
  guarantorStep = 0;
  guarantorSubStep = 1;
  user: User | null = null;
  selectedGuarantor = new Guarantor();
  status = { loggedIn: false };
  messages: DfMessage[] = [];
  newMessage = 0;
  spouseAuthorize = false;
  coTenantAuthorize = false;
}

const localStore = localStorage.getItem("store");
const initialStore =
  localStore !== null ? JSON.parse(localStore) : new DfState();
if (initialStore.lang) {
  i18n.locale = initialStore.lang;
}

const store = new Vuex.Store({
  state: initialStore,
  mutations: {
    initState(state) {
      Object.assign(state, new DfState());
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
      localStorage.setItem("token", "");
      AnalyticsService.loginFail();
    },
    logout(state) {
      state.status.loggedIn = false;
      localStorage.setItem("token", "");
      state.user = null;
    },
    setLang(state, lang) {
      state.lang = lang;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
      state.user = null;
      localStorage.setItem("token", "");
      AnalyticsService.registerSuccess();
    },
    registerFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
      localStorage.setItem("token", "");
      AnalyticsService.registerFail();
    },
    setNamesSuccess(state, user) {
      state.user = user;
      state.tenantStep++;
    },
    setRoommatesSuccess(state) {
      state.tenantStep++;
    },
    setStep(state, n: number) {
      state.tenantStep = n;
    },
    setGuarantorStep(state, n: number) {
      state.guarantorStep = n;
    },
    loadUser(state, user) {
      state.user = user;
      state.status.loggedIn = true;
      state.user.applicationType = state.user?.apartmentSharing.applicationType;

      if (state.user?.guarantors && state.user.guarantors.length > 0) {
        if (state.selectedGuarantor?.id) {
          const guarantor = user.guarantors.find((g: any) => {
            return g.id === state.selectedGuarantor.id;
          });
          if (guarantor !== undefined) {
            state.selectedGuarantor = guarantor;
          } else {
            state.selectedGuarantor =
              user.guarantors[user.guarantors.length - 1];
          }
        } else {
          state.selectedGuarantor = user.guarantors[user.guarantors.length - 1];
        }
      } else {
        if (state.guarantorStep > 1) {
          state.guarantorStep = 0;
        }
        state.guarantorSubStep = 1;
        state.selectedGuarantor = new Guarantor();
      }
      if (state.user?.apartmentSharing?.applicationType === "COUPLE") {
        state.spouseAuthorize = true;
      }
      if (state.user?.apartmentSharing?.applicationType === "GROUP") {
        state.coTenantAuthorize = true;
      }
    },
    setSelectedGuarantor(state, guarantor: Guarantor) {
      state.selectedGuarantor = guarantor;
    },
    createCouple(state, email) {
      const u = new User();
      u.email = email;
      state.user.apartmentSharing.tenants.push(u);
    },
    createRoommates(state, email) {
      const u = new User();
      u.email = email;
      state.user.apartmentSharing.tenants.push(u);
    },
    setTenantSubstep(state, subStep: number) {
      state.tenantSubStep = subStep;
    },
    setGuarantorSubstep(state, subStep: number) {
      state.guarantorSubStep = subStep;
    },
    selectGuarantor(state, position) {
      if (
        state.user?.guarantors !== undefined &&
        state.user?.guarantors.length > position
      ) {
        state.selectedGuarantor = state.user?.guarantors[position];
      }
    },
    updateMessages(state, messageList: DfMessage[]) {
      state.messageList = messageList;
    },
    deleteRoommates(state, email) {
      const tenants = state.user.apartmentSharing.tenants.filter((t: User) => {
        return t.email !== email;
      });
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
    }
  },
  actions: {
    login({ commit }, { source, internalPartnerId }) {
      window.location.replace(`/account`);
    },
    logout({ commit }, redirect = true) {
      commit("logout");
      commit("initState");
      AuthService.logout(redirect);
    },
    deleteAccount({ commit }, password) {
      return AuthService.deleteAccount(password).then(
        response => {
          this.dispatch("logout");
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
    loadUser({ commit }) {
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
    setNames({ commit }, user) {
      return ProfileService.saveNames(user).then(
        () => {
          commit("setNamesSuccess", user);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    setRoommates({ commit }, data) {
      return ProfileService.saveRoommates(data).then(
        () => {
          commit("setRoommatesSuccess");
          this.dispatch("loadUser");
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    setLang({ commit }, lang) {
      i18n.locale = lang;
      commit("setLang", lang);
    },
    validateFile(
      { commit },
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
      return ProfileService.setGuarantorType("NATURAL_PERSON").then(
        response => {
          commit("loadUser", response.data);
          commit("selectGuarantor", this.state.user.guarantors.length - 1);
          commit("setGuarantorStep", 2);
          commit("setGuarantorSubstep", 1);
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    async deleteAllGuarantors({ commit }) {
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
    deleteGuarantor({ commit }, k) {
      return ProfileService.deleteGuarantor(this.state.user.guarantors[k]).then(
        response => {
          this.dispatch("loadUser");
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    setGuarantorType({ commit }, guarantorType: string) {
      return ProfileService.setGuarantorType(guarantorType).then(
        response => {
          this.dispatch("loadUser");
          this.commit("setGuarantorStep", 2);
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
    deleteDocument({ commit }, docId: number) {
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
          commit("updateMessages", data.data);
        });
      }
    },
    sendMessage({ commit }, message: string) {
      return MessageService.postMessage({ messageBody: message }).then(() => {
        this.dispatch("updateMessages");
      });
    },
    deleteCoTenant(_, tenant: any) {
      if (tenant.id && tenant.id > 0) {
        ProfileService.deleteCoTenant(tenant.id);
      }
      this.commit("deleteRoommates", tenant.email);
    }
  },
  getters: {
    getDocuments(state): DfDocument[] {
      if (state.tenantStep === 3) {
        return state.selectedGuarantor.documents || [];
      }
      return state.user?.documents || [];
    },
    isGuarantor(state): boolean {
      return state.tenantStep === 3;
    },
    guarantor(state): Guarantor {
      return state.selectedGuarantor;
    },
    isLoggedIn(state): boolean {
      return state.status.loggedIn;
    },
    userToEdit(state): User | Guarantor | null {
      if (state.tenantStep === 3) {
        return state.selectedGuarantor;
      }
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
    }
  },
  modules: {}
});

export default store;

store.subscribe((mutation, state) => {
  localStorage.setItem("store", JSON.stringify(state));
});
