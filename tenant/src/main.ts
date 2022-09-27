import { UtilsService } from "./services/UtilsService";
import "./router/componentHooks"; // <-- Needs to be first
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import axios from "axios";
import Loading from "vue-loading-overlay";
import Toasted from "vue-toasted";
import JQuery from "jquery";

import VueCookies from "vue-cookies";
import authentication from "./plugins/authentication";

const MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;

Vue.use(authentication);

Vue.config.productionTip = false;

import "@gouvfr/dsfr/dist/dsfr/dsfr.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.min.css";

import "vue-loading-overlay/dist/vue-loading.css";
import VueGtag from "vue-gtag";
import VueAuthImage from "vue-auth-image";
import { User } from "df-shared/src/models/User";

declare global {
  interface Window {
    __insp: any;
    __inspld: any;
    Beacon: any;
    _paq: any;
  }
}
import MatomoPlugin from "./plugins/matomo";

Vue.config.productionTip = false;

Vue.use(VueCookies);
Vue.use(MatomoPlugin);
Vue.use(VueAuthImage);

(Vue as any).$keycloak
  .init({ onLoad: "check-sso", checkLoginIframe: true })
  .then(() => {
    axios.interceptors.request.use(
      config => {
        if ((Vue as any).$keycloak.authenticated) {
          const localToken = (Vue as any).$keycloak.token;
          config.headers["Authorization"] = `Bearer ${localToken}`;
        }
        return config;
      },

      error => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      function(response) {
        return response;
      },
      function(error) {
        if (
          error.response &&
          (401 === error.response.status || 403 === error.response.status) &&
          !error.response.request.responseURL.endsWith(
            "/api/register/account"
          ) &&
          !error.response.request.responseURL.endsWith(
            "/api/user/forgotPassword"
          ) &&
          !error.response.request.responseURL.endsWith("/api/user/logout")
        ) {
          store.dispatch("logout", MAIN_URL).then(null, error => {
            console.dir(error);
          });
        } else {
          return Promise.reject(error);
        }
      }
    );

    const app = new Vue({
      created() {
        const html = document.documentElement;
        html.setAttribute("lang", i18n.locale);
      },
      router,
      store,
      i18n,
      render: h => h(App)
    });
    app.$mount("#app");

    Vue.filter("fullName", function(user: User) {
      const firstName = UtilsService.capitalize(user.firstName || "");
      const lastName = UtilsService.capitalize(user.lastName || "");
      const preferredName = UtilsService.capitalize(user.preferredName || "");
      return user.preferredName == null || user.preferredName.length == 0
        ? firstName + " " + lastName
        : firstName + " " + preferredName;
    });

    Vue.use(Loading);
    Vue.use(Toasted);

    Vue.toasted.register("error", i18n.t("error").toString(), {
      type: "error",
      duration: 5000
    });
    Vue.toasted.register("delete_failed", i18n.t("delete-failed").toString(), {
      type: "error",
      duration: 5000
    });
    Vue.toasted.register(
      "delete_success",
      i18n.t("delete-success").toString(),
      {
        type: "success",
        duration: 5000
      }
    );
    Vue.toasted.register("save_failed", i18n.t("save-failed").toString(), {
      type: "error",
      duration: 7000
    });
    Vue.toasted.register(
      "save_failed_num_pages",
      i18n.t("save-failed-num-pages").toString(),
      {
        type: "error",
        duration: 7000
      }
    );
    Vue.toasted.register("save_success", i18n.t("save-success").toString(), {
      type: "success",
      duration: 5000
    });
    Vue.toasted.register(
      "max_file",
      payload => {
        if (!payload.message) {
          return i18n.t("max-file-default").toString();
        }
        return payload.message;
      },
      {
        type: "error",
        duration: 7000
      }
    );

    setInterval(() => {
      app.$store.dispatch("updateMessages");
    }, 60000);

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

    const iphub = function() {
      JQuery(document).ready(function() {
        JQuery(document.body).prepend(
          "<script src='/iphubb2.js'></script>" +
            "<script src='/iphubb.js'></script>" +
            '<noscript> <iframe src="https://3689183.fls.doubleclick.net/activityi;src=3689183;type=dossi0;cat=lpbis;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;gdpr=${GDPR};gdpr_consent=${GDPR_CONSENT_755};ord=1;num=1?" width="1" height="1" frameborder="0" style="display:none"></iframe> </noscript>' +
            "<script src='/pixel.js'></script>" +
            '<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=244308452813031&ev=PageView&noscript=1" /></noscript>' +
            "<script src='/pixelBtn.js'></script>"
        );
      });
    };
    Vue.prototype.iphub = iphub;

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
  });
