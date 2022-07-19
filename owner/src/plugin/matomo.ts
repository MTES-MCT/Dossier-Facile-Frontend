import VueMatomo from 'vue-matomo';
import { VueConstructor } from 'vue';
import router from '../router';

export default {
  install(Vue: VueConstructor) {
    const options = {
      host: import.meta.env.VITE_MATOMO_URL,
      siteId: import.meta.env.VITE_MATOMO_SITE_ID,
      trackerFileName: 'matomo',
      router,
      domains: '*.dossierfacile.fr',
      cookieDomain: '*.dossierfacile.fr',
      userId: undefined,
    };

    Vue.use(VueMatomo, options);
    window._paq.push(['trackPageView']);
  },
};
