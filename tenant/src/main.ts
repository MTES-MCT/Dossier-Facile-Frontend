import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import axios from "axios";
import Loading from "vue-loading-overlay";
import Toasted from "vue-toasted";

Vue.config.productionTip = false;

require("../../node_modules/@gouvfr/all/dist/css/all.min.css");
import "vue-loading-overlay/dist/vue-loading.css";
import VueGtag from "vue-gtag";

Vue.use(
  VueGtag,
  {
    config: { id: "UA-50823626-2" }
  },
  router
);

const app = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
});
app.$mount("#app");

axios.interceptors.request.use(
  config => {
    const localUserStr = localStorage.getItem("user");
    const localUser = localUserStr !== null ? JSON.parse(localUserStr) : null;
    if (localUser && localUser.token) {
      config.headers["Authorization"] = `Bearer ${localUser.token}`;
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
      !error.response.request.responseURL.endsWith("/api/auth")
    ) {
      store.dispatch("logout").then(null, error => {
        console.dir(error);
      });
    } else {
      return Promise.reject(error);
    }
  }
);

app.$store.dispatch("loadUser");

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

Vue.toasted.register("max_file", i18n.t("max-file").toString(), {
  type: "error",
  duration: 7000
});
