import Vue from "vue";
import Vuex from "vuex";
import { AuthService } from "df-shared/src/services/AuthService";
import { ProfileService } from "@/services/ProfileService";
import router from "../router";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { User } from "df-shared/src/models/User";
import i18n from "@/i18n";
import { DfDocument } from "df-shared/src/models/DfDocument";

Vue.use(Vuex);

const localUser = localStorage.getItem("user");
const initialUser = localUser !== null ? JSON.parse(localUser) : null;
const initialLoggedIn = !!initialUser;

export class DfState {
  tenantStep = 0;
  tenantSubStep = 1;
  guarantorStep = 0;
  guarantorSubStep = 1;
  user: User | null = initialUser;
  roommates: User[] = [];
  selectedGuarantor = new Guarantor();
  status = { loggedIn: initialLoggedIn };
}

export default new Vuex.Store({
  state: new DfState(),
  mutations: {
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
      if (state.user) {
        state.user.applicationType = "ALONE";
      }
      if (
        state.user?.apartmentSharing &&
        state.user.apartmentSharing.tenants.length > 1
      ) {
        state.user.applicationType = "COUPLE";
        state.roommates = state.user.apartmentSharing.tenants;
        if (state.user.apartmentSharing.tenants.length > 2) {
          state.user.applicationType = "GROUP";
        }
      }
      if (state.user?.guarantors && state.user.guarantors.length > 0) {
        if (state.selectedGuarantor.id) {
          const guarantor = user.guarantors.find( (g: any) => {return g.id === state.selectedGuarantor.id})
          state.selectedGuarantor = guarantor;
        } else {
          state.selectedGuarantor = user.guarantors[user.guarantors.length-1];
        }
        if (state.selectedGuarantor) {
          state.guarantorStep = 2;
        }
      }
    },
    setSelectedGuarantor(state, guarantor: Guarantor) {
      state.selectedGuarantor = guarantor;
    },
    createRoommates(state) {
      state.roommates.push(new User());
    },
    setTenantSubstep(state, subStep: number) {
      state.tenantSubStep = subStep;
    },
    setGuarantorSubstep(state, subStep: number) {
      state.guarantorSubStep = subStep;
    },
    addGuarantor(state) {
      if (state.user?.guarantors !== undefined) {
        const g = new Guarantor()
        state.user?.guarantors.push(g)
        state.selectedGuarantor = g;
      }
    },
    selectGuarantor(state, position) {
      if (state.user?.guarantors !== undefined && state.user?.guarantors.length > position) {
        state.selectedGuarantor = state.user?.guarantors[position];
      }
    }
  },
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(
        user => {
          commit("loginSuccess", user);
          this.dispatch("loadUser");
          return Promise.resolve(user);
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
      router.push("/").then();
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
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
    },
    validateFile({ commit }, honorDeclaration: boolean) {
      return ProfileService.validateFile(honorDeclaration).then(
        () => {
          router.push("/status");
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    addGuarantor({commit}) {
      commit("addGuarantor");
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
    }
  },
  modules: {}
});
