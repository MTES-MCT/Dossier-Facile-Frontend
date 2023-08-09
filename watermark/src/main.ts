import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import i18n from "./i18n";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
import router from "./router";

const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT;

const app = createApp(App);

Sentry.init({
  app,
  dsn: "https://1e0bc34f71b74ed3b70019949edf107c@sentry.incubateur.net/113",
  environment: ENVIRONMENT,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: [
        "localhost",
        "filigrane-dev.dossierfacile.fr",
        "filigrane.beta.gouv.fr",
        /^\//,
      ],
    }),
  ],
  tracesSampleRate: 1.0,
});

app.use(i18n);
app.use(Toast as any);
app.use(router);
app.mount("#app");
