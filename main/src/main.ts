import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import VueCookies from "vue-cookies";


require("../../node_modules/@gouvfr/all/dist/css/all.min.css");

Vue.config.productionTip = false;

Vue.use(VueCookies);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
