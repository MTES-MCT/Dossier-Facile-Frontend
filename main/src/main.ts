import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import VueCookies from "vue-cookies";
import VueGtag from "vue-gtag";

declare global {
  interface Window {
    __insp: any;
    __inspld: any;
    Beacon: any;
  }
}

const inspectlet = function() {
  window.__insp = window.__insp || [];
  window.__insp.push(["wid", 1921433466]);
  const ldinsp = function() {
    if (typeof window.__inspld != "undefined") return;
    window.__inspld = 1;
    const insp = document.createElement("script");
    insp.type = "text/javascript";
    insp.async = true;
    insp.id = "inspsync";
    insp.src =
      "https://cdn.inspectlet.com/inspectlet.js?wid=1921433466&r=" +
      Math.floor(new Date().getTime() / 3600000);
    const x = document.getElementsByTagName("script")[0];
    x.parentNode?.insertBefore(insp, x);
  };
  setTimeout(ldinsp, 0);
};

Vue.prototype.inspectlet = inspectlet;

Vue.config.productionTip = false;

Vue.use(VueCookies);

new Vue({
  created() {
    const html = document.documentElement;
    html.setAttribute("lang", i18n.locale);
  },
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");

if (Vue.$cookies.get("accept-cookie") === "true") {
  inspectlet();
  Vue.use(
    VueGtag,
    {
      config: {
        id: "UA-50823626-2",
        params: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          send_page_view: true
        },
        linker: {
          domains: [
            "dossierfacile.fr",
            "www.dossierfacile.fr",
            "locataire.dossierfacile.fr",
            "proprietaire.dossierfacile.fr",
            "sso.dossierfacile.fr"
          ]
        }
      }
    },
    router
  );
}
