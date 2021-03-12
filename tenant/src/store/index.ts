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
  hasNewMessage = false;
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
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    setLang(state, lang) {
      state.lang = lang;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
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
      state.user.applicationType = state.user?.apartmentSharing.applicationType;

      if (state.user?.guarantors && state.user.guarantors.length > 0) {
        if (state.selectedGuarantor?.id) {
          const guarantor = user.guarantors.find((g: any) => {
            return g.id === state.selectedGuarantor.id;
          });
          state.selectedGuarantor = guarantor;
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
    },
    setSelectedGuarantor(state, guarantor: Guarantor) {
      state.selectedGuarantor = guarantor;
    },
    createRoommates(state) {
      state.user.apartmentSharing.tenants.push(new User());
    },
    setTenantSubstep(state, subStep: number) {
      state.tenantSubStep = subStep;
    },
    setGuarantorSubstep(state, subStep: number) {
      state.guarantorSubStep = subStep;
    },
    addGuarantor(state) {
      if (state.user?.guarantors !== undefined) {
        const g = new Guarantor();
        state.user?.guarantors.push(g);
        state.selectedGuarantor = g;
      }
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
    deleteRoommates(state, pos) {
      state.user.apartmentSharing?.tenants.splice(pos, 1);
    },
    updateRoommates(state, roommates: User[]) {
      const u = state.user.apartmentSharing.tenants.find((t: User) => {
        return (t.email = state.user.email);
      });
      state.user.apartmentSharing.tenants = roommates;
      state.user.apartmentSharing.tenants.push(u);
    }
  },
  actions: {
    login({ commit }, { user, source, internalPartnerId }) {
      commit("initState");
      return AuthService.login(user, source, internalPartnerId).then(
        user => {
          commit("loginSuccess", user);
          return this.dispatch("loadUser");
        },
        error => {
          commit("loginFailure");
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit("logout");
      commit("initState");
      router.push("/").then();
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
    resetPassword({ commit }, user) {
      return AuthService.resetPassword(user).then(
        user => {
          commit("setNamesSuccess", user);
          return Promise.resolve(user);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    loadUser({ commit }) {
      if (this.state.user !== null) {
        return AuthService.loadUser().then(
          response => {
            commit("loadUser", response.data);
            return Promise.resolve(response.data);
          },
          error => {
            return Promise.reject(error);
          }
        );
      }
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
    validateFile({ commit }, honorDeclaration: boolean) {
      return ProfileService.validateFile(honorDeclaration).then(
        () => {
          this.dispatch("loadUser").then(() => {
            router.push("/account");
          });
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    addGuarantor({ commit }) {
      commit("addGuarantor");
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
      MessageService.updateMessages().then(data => {
        this.commit("updateMessages", data.data);
      });
    },
    sendMessage({ commit }, message: string) {
      return MessageService.postMessage({ messageBody: message }).then(() => {
        this.dispatch("updateMessages");
      });
    },
    updateRoommates({ commit }, roommates: User[]) {
      commit("updateRoommates", roommates);
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
    }
  },
  modules: {}
});

export default store;

store.subscribe((mutation, state) => {
  localStorage.setItem("store", JSON.stringify(state));
});
