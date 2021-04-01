import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import VueCookies from "vue-cookies";
import VueGtag from "vue-gtag";

require("../../node_modules/@gouvfr/all/dist/css/all.min.css");

Vue.config.productionTip = false;

Vue.use(VueCookies);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");

const cookieHidden = Vue.$cookies.isKey("accept-cookie")
  ? Vue.$cookies.get("accept-cookie")
  : false;
if (cookieHidden) {
  Vue.use(
    VueGtag,
    {
      config: { id: "UA-50823626-2" }
    },
    router
  );
}
