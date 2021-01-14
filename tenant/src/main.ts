import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import axios from "axios";
import Loading from 'vue-loading-overlay';

Vue.config.productionTip = false;

require("../../node_modules/@gouvfr/all/dist/css/all.min.css");
import "vue-loading-overlay/dist/vue-loading.css";

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
      (401 === error.response.status || 403 === error.response.status)
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