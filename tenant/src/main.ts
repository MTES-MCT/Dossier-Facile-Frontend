import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import axios from "axios";
// import "./unicon";

Vue.config.productionTip = false;

require("../../node_modules/@gouvfr/all/dist/js/all.min.js");
require("../../node_modules/@gouvfr/all/dist/css/all.min.css");

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");

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
