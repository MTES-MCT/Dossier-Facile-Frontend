import Vue from "vue";
import Vuex from "vuex";
import i18n from "../i18n";
import { CookiesService } from "df-shared/src/services/CookiesService";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    setLang(_, lang) {
      i18n.locale = lang;
      i18n.fallbackLocale = "fr";
      const html = document.documentElement;
      html.setAttribute("lang", i18n.locale);
      CookiesService.setCookie(
        "lang",
        lang,
        CookiesService.datePlusDaysFromNow(365)
      );
    },
  },
  modules: {},
});

export default store;
