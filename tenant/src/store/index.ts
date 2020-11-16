import Vue from "vue";
import Vuex from "vuex";
import { AuthService } from "df-shared/src/services/AuthService";
import { ProfileService } from "@/services/ProfileService";

Vue.use(Vuex);

const localUser = localStorage.getItem("user");
const initialUser = localUser !== null ? JSON.parse(localUser) : null;
const initialLoggedIn = !!initialUser;

export default new Vuex.Store({
  state: {
    currentStep: 0,
    user: initialUser,
    status: { loggedIn: initialLoggedIn }
  },
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
      state.currentStep++;
    }
  },
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(
        user => {
          commit("loginSuccess", user);
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
    setNames({ commit }, user) {
      return ProfileService.saveNames(user).then(
        () => {
          commit("setNamesSuccess", user);
          localStorage.setItem("user", JSON.stringify(user));
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    setRoommates({ commit }, data) {
      return ProfileService.saveRoommates(data).then(
        () => {
          commit("setRommatesSuccess");
          // localStorage.setItem("user", JSON.stringify(user));
        },
        error => {
          return Promise.reject(error);
        }
      );
    }
  },
  modules: {}
});
