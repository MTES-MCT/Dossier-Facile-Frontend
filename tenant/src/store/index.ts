import Vue from "vue";
import Vuex from "vuex";
import {AuthService} from 'df-shared/src/services/AuthService';

Vue.use(Vuex);

const localUser = localStorage.getItem("user");
const user = localUser !== null ? JSON.parse(localUser) : null;
const initialState = user
    ? { status: { loggedIn: true }, user }
    : { status: { loggedIn: false }, user: null };


export default new Vuex.Store({
    state: initialState,
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
        },
        registerFailure(state) {
            state.status.loggedIn = false;
        }

    },
    actions: {
        login({commit}, user) {
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
        logout({commit}) {
            AuthService.logout();
            commit("logout");
        },
        register({commit}, user) {
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
        }

    },
    modules: {}
});
