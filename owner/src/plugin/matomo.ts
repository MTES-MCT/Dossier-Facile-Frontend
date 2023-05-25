import VueMatomo from 'vue-matomo';
import router from '../router';

export default {
  install(app: any) {
    if (!import.meta.env.VITE_MATOMO_ENABLE) {
      return;
    }
    const options = {
      host: import.meta.env.VITE_MATOMO_URL,
      siteId: import.meta.env.VITE_MATOMO_SITE_ID,
      trackerFileName: 'matomo',
      router,
      domains: '*.dossierfacile.fr',
      cookieDomain: '*.dossierfacile.fr',
      userId: undefined,
    };

    app.use(VueMatomo, options);
    window._paq.push(['trackPageView']);
  },
};
