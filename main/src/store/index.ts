import Vue from "vue";
import Vuex from "vuex";
import i18n from "@/i18n";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    setLang({ commit }, lang) {
      i18n.locale = lang;
    }
  },
  modules: {}
});
