import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import { createI18n } from "vue-i18n";

import en from './locales/en.json'
import fr from './locales/fr.json'

const i18n = createI18n({
  locale: "fr",
  fallbackLocale: "en",
  messages: {
    en,
    fr
  }
});

const app = createApp(App);
app.use(store);
app.use(router);
app.use(i18n);
app.mount("#app");
