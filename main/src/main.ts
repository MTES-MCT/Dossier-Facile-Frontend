import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import VueCookies from "vue-cookies";
import VueGtag from "vue-gtag";
import JQuery from "jquery";

declare global {
  interface Window {
    __insp: any;
    __inspld: any;
    Beacon: any;
    _paq: any;
    $: any;
  }
}

import "@gouvfr/dsfr/dist/dsfr/dsfr.min.css";
import MatomoPlugin from "./plugins/matomo";

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

const iphub = function() {
  JQuery(document).ready(function() {
    JQuery(document.body).prepend(
      "<script src='/iphubb.js'></script>" +
        '<noscript> <iframe src="https://3689183.fls.doubleclick.net/activityi;src=3689183;type=dossi0;cat=landingp;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;gdpr=${GDPR};gdpr_consent=${GDPR_CONSENT_755};ord=1;num=1?" width="1" height="1" frameborder="0" style="display:none"></iframe> </noscript>'
    );
  });
};

Vue.prototype.inspectlet = inspectlet;
Vue.prototype.iphub = iphub;

Vue.config.productionTip = false;

Vue.use(VueCookies);
Vue.use(MatomoPlugin);

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
  iphub();
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
