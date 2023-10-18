import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import VueCookies from "vue-cookies";
import "df-shared/src/validation-rules";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
import Toasted from "vue-toasted";
import MatomoPlugin from "./plugins/matomo";

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

Vue.config.productionTip = false;

Vue.use(VueCookies);
Vue.use(Toasted);
Vue.use(MatomoPlugin);

const ENVIRONMENT = process.env.VUE_APP_ENVIRONMENT || "dev";

Sentry.init({
  Vue,
  dsn: "https://6705728c765748949f37aead7a739c40@sentry.incubateur.net/97",
  environment: ENVIRONMENT,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: [
        "localhost",
        "www-preprod.dossierfacile.fr",
        "dossierfacile.logement.gouv.fr",
        /^\//,
      ],
    }),
  ],
  tracesSampleRate: 1.0,
});

new Vue({
  created() {
    const html = document.documentElement;
    html.setAttribute("lang", i18n.locale);
  },
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app", true);
