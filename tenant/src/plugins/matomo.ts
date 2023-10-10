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
      domains: process.env.VUE_APP_MATOMO_DOMAIN,
      cookieDomain: process.env.VUE_APP_MATOMO_DOMAIN,
      userId: undefined,
      enableLinkTracking: true,
      trackInitialView: true,
    };

    Vue.use(VueMatomo, options);
  },
};
