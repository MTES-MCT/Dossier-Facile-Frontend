import router from "../router";
import VueMatomo from "vue-matomo";
import { VueConstructor } from "vue";

export default {
  install(Vue: VueConstructor) {
    const options = {
      host: process.env.VUE_APP_MATOMO_URL,
      siteId: process.env.VUE_APP_MATOMO_SITE_ID,
      trackerFileName: "matomo",
      router: router,
      requireConsent: true,
      domains: "*.dossierfacile.fr",
      cookieDomain: "*.dossierfacile.fr",
      requireCookieConsent: true,
      userId: undefined
    };

    Vue.use(VueMatomo, options);

    // Cookie and tracking already accepted
    if (Vue.$cookies.get("accept-cookie") === "true") {
      window._paq.push(["setConsentGiven"]);
      window._paq.push(["setCookieConsentGiven"]);
      window._paq.push(["trackPageView"]);
    }
  }
};
