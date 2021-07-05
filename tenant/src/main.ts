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

const MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;

Vue.use(authentication);

Vue.config.productionTip = false;

require("../../node_modules/@gouvfr/dsfr/dist/css/dsfr.min.css");
import "vue-loading-overlay/dist/vue-loading.css";
import VueGtag from "vue-gtag";
import VueAuthImage from "vue-auth-image";

declare global {
  interface Window {
    __insp: any;
    __inspld: any;
    Beacon: any;
  }
}

Vue.config.productionTip = false;

Vue.use(VueCookies);
Vue.use(VueAuthImage);

(Vue as any).$keycloak.init({ checkLoginIframe: false }).then(() => {
  axios.interceptors.request.use(
    config => {
      const localToken = localStorage.getItem("token");
      if (localToken) {
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
        !error.response.request.responseURL.endsWith("/api/register/account") &&
        !error.response.request.responseURL.endsWith("/api/user/forgotPassword")
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
    router,
    store,
    i18n,
    render: h => h(App)
  });
  app.$mount("#app");

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
  Vue.toasted.register("delete_success", i18n.t("delete-success").toString(), {
    type: "success",
    duration: 5000
  });
  Vue.toasted.register("save_failed", i18n.t("save-failed").toString(), {
    type: "error",
    duration: 5000
  });
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

  app.$store.dispatch("updateMessages");

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

  if (Vue.$cookies.get("accept-cookie") === "true") {
    inspectlet();
    Vue.use(
      VueGtag,
      {
        config: { id: "UA-50823626-2" }
      },
      router
    );
  }
});
