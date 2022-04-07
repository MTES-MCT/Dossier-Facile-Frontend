import { createApp } from 'vue';
import axios from 'axios';
import { globalCookiesConfig } from 'vue3-cookies';
import Toast from 'vue-toastification';
import App from './App.vue';
import store from './store';
import router from './router';
import i18n from './i18n';
import 'vue-toastification/dist/index.css';
import keycloak from './plugin/keycloak';

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`;


keycloak.init({ onLoad: 'check-sso', checkLoginIframe: true }).then((auth) => {
  const aYearFromNow = new Date();
  aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
  globalCookiesConfig({
    expireTimes: aYearFromNow.toUTCString(),
    path: '/',
    domain: MAIN_URL.endsWith('dossierfacile.fr') ? 'dossierfacile.fr' : 'localhost',
    secure: true,
    sameSite: 'None',
  });

  const app = createApp(App);
  app.use(store);
  app.use(router);
  app.use(i18n);
  app.use(Toast);
  app.mount('#app');

  if (!auth) {
    return;
  }
  axios.interceptors.request.use(
    (config) => {
      if (keycloak.authenticated && config?.headers) {
        const localToken = keycloak.token;
        config.headers.Authorization = `Bearer ${localToken}`;
      }
      return config;
    },

    (error) => Promise.reject(error),
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response
        && (error.response.status === 401 || error.response.status === 403)
      ) {
        console.log('err');
      }
      return Promise.reject(error);
    },
  );

  // Token Refresh
  setInterval(() => {
    keycloak.updateToken(70).then().catch(() => {
      console.log('Failed to refresh token');
    });
  }, 6000);
}).catch(() => {
  console.log('Authenticated Failed');
});
