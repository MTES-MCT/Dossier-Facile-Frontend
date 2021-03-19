import Vue from "vue";
import Vuex from "vuex";
import i18n from "@/i18n";

Vue.use(Vuex);

const localStore = localStorage.getItem("store");
const initialStore = localStore !== null ? JSON.parse(localStore) : {};
if (initialStore.lang) {
  i18n.locale = initialStore.lang;
}

const store = new Vuex.Store({
  state: initialStore,
  mutations: {
    setLang(state, lang) {
      state.lang = lang;
    }
  },
  actions: {
    setLang({ commit }, lang) {
      commit("setLang", lang);
      i18n.locale = lang;
    }
  },
  modules: {}
});

export default store;

store.subscribe((mutation, state) => {
  localStorage.setItem("store", JSON.stringify(state));
});
