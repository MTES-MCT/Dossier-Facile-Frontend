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

import VueCookies from "vue-cookies";
import authentication from "./plugins/authentication";
import "df-shared/src/validation-rules";
import "@gouvfr/dsfr/dist/dsfr/dsfr.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-design/icons-design.min.css";

import "vue-loading-overlay/dist/vue-loading.css";
import VueGtag from "vue-gtag";
import VueAuthImage from "vue-auth-image";
import { User } from "df-shared/src/models/User";
import MatomoPlugin from "./plugins/matomo";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

const MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
const ENVIRONMENT = process.env.VUE_APP_ENVIRONMENT || "dev";

Vue.use(authentication);

Vue.config.productionTip = false;

declare global {
  interface Window {
    __insp: any;
    __inspld: any;
    Beacon: any;
    _paq: any;
  }
}

Vue.config.productionTip = false;

Vue.use(VueCookies);
Vue.use(MatomoPlugin);
Vue.use(VueAuthImage);

(Vue as any).$keycloak
  .init({ onLoad: "check-sso", checkLoginIframe: true })
  .then(() => {
    axios.interceptors.request.use(
      (config) => {
        if ((Vue as any).$keycloak.authenticated) {
          const localToken = (Vue as any).$keycloak.token;
          config.headers = config.headers ?? {};
          config.headers["Authorization"] = `Bearer ${localToken}`;
        }
        return config;
      },

      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
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
          store.dispatch("logout", MAIN_URL).then(null, (error) => {
            console.dir(error);
          });
        } else {
          return Promise.reject(error);
        }
      }
    );

    Sentry.init({
      Vue,
      dsn: "https://7032afeb9b1740f68e01148573cff778@sentry.incubateur.net/98",
      environment: ENVIRONMENT,
      integrations: [
        new BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          tracingOrigins: [
            "localhost",
            "locataire-dev.dossierfacile.fr",
            "locataire.dossierfacile.fr",
            /^\//,
          ],
        }),
      ],
      tracesSampleRate: 1.0,
    });

    const app = new Vue({
      created() {
        const html = document.documentElement;
        html.setAttribute("lang", i18n.locale);
      },
      router,
      store,
      i18n,
      render: (h) => h(App),
    });
    app.$mount("#app");

    Vue.filter("fullName", function (user: User) {
      const firstName = UtilsService.capitalize(user.firstName || "");
      const lastName = UtilsService.capitalize(user.lastName || "");
      const preferredName = UtilsService.capitalize(user.preferredName || "");
      return user.preferredName == null || user.preferredName.length == 0
        ? firstName + "\xa0" + lastName
        : firstName + "\xa0" + preferredName;
    });

    Vue.use(Loading);
    Vue.use(Toasted);

    Vue.toasted.register("error", i18n.t("error").toString(), {
      type: "error",
      duration: 5000,
      className: ["error-toast"],
    });
    Vue.toasted.register("delete_failed", i18n.t("delete-failed").toString(), {
      type: "error",
      duration: 5000,
      className: ["error-toast"],
    });
    Vue.toasted.register(
      "delete_success",
      i18n.t("delete-success").toString(),
      {
        type: "success",
        duration: 5000,
        className: ["success-toast"],
      }
    );
    Vue.toasted.register("save_failed", i18n.t("save-failed").toString(), {
      type: "error",
      duration: 7000,
      className: ["error-toast"],
    });
    Vue.toasted.register(
      "save_failed_num_pages",
      i18n.t("save-failed-num-pages").toString(),
      {
        type: "error",
        duration: 7000,
        className: ["error-toast"],
      }
    );
    Vue.toasted.register("save_success", i18n.t("save-success").toString(), {
      type: "success",
      duration: 5000,
      className: ["success-toast"],
    });
    Vue.toasted.register(
      "max_file",
      (payload) => {
        if (!payload.message) {
          return i18n.t("max-file-default").toString();
        }
        return payload.message;
      },
      {
        type: "error",
        duration: 7000,
        className: ["error-toast"],
      }
    );
    Vue.toasted.register(
      "success_toast",
      (payload) => i18n.t(payload.message).toString(),
      {
        type: "success",
        duration: 5000,
        className: ["success-toast"],
      }
    );
    Vue.toasted.register(
      "error_toast",
      (payload) => i18n.t(payload.message).toString(),
      {
        type: "error",
        duration: 7000,
        className: ["error-toast"],
      }
    );
    Vue.toasted.register(
      "info_toast",
      (payload) => i18n.t(payload.message).toString(),
      {
        type: "show",
        duration: 7000,
      }
    );

    setInterval(() => {
      app.$store.dispatch("updateMessages");
    }, 60000);

    if (Vue.$cookies.get("accept-cookie") === "true") {
      Vue.use(
        VueGtag,
        {
          config: {
            id: "UA-50823626-2",
            params: {
              send_page_view: true,
            },
            linker: {
              domains: [
                "dossierfacile.fr",
                "www.dossierfacile.fr",
                "locataire.dossierfacile.fr",
                "proprietaire.dossierfacile.fr",
                "sso.dossierfacile.fr",
              ],
            },
          },
        },
        router
      );
    }
  });
