import Vue from "vue";
import Keycloak from "keycloak-js";
import { VueConstructor } from "vue/types/umd";

const options = {
  url: process.env.VUE_APP_SSO_ENDPOINT,
  realm: "dossier-facile",
  clientId: process.env.VUE_APP_SSO_CLIENT_ID || ""
};

const _keycloak = Keycloak(options);

const Plugin = {
  install(Vue: VueConstructor) {
    (Vue as any).$keycloak = _keycloak;
  }
};

Plugin.install = Vue => {
  (Vue as any).$keycloak = _keycloak;
  Object.defineProperties(Vue.prototype, {
    $keycloak: {
      get() {
        return _keycloak;
      }
    }
  });
};

Vue.use(Plugin);

export default Plugin;
