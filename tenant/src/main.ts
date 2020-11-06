import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";

Vue.config.productionTip = false;

require("../../node_modules/@gouvfr/design-system/dist/js/dsfr.js");
require("../../node_modules/@gouvfr/design-system/dist/css/dsfr.css");

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
