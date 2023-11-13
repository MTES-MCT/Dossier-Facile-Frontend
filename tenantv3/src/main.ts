import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import { globalCookiesConfig } from 'vue3-cookies';

import App from './App.vue'
import router from './router'
import i18n from './i18n';
import "@gouvfr/dsfr/dist/dsfr/dsfr.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-user/icons-user.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-design/icons-design.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-buildings/icons-buildings.min.css";
import keycloak from './plugin/keycloak';
import axios from 'axios';
import {LoadingPlugin} from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { defineRule } from 'vee-validate';
import MatomoPlugin from './plugin/matomo';

defineRule('onlyAlpha', (value: any) => {
  if (!value.match("^[a-zA-Z \\-'’àâäçéèêëîïôöùûüÿæœÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸÆŒ]*$")) {
    return 'only-alpha';
  }
  return true
})

defineRule('zipcode', (value: any) => {
  if (!value.match("^[0-9]{5}$")) {
    return "zipcode-not-valid"
  }
  return true
})

defineRule('validateEmail', (value: any) => {
  if (!value) {
    return 'email-not-valid';
  }
  return true;
});
defineRule('isTrue', (value: any) => {
  if (!value) {
    return 'field-required';
  }
  return true;
});
defineRule('hasValue', (value: any) => {
  if (!value) {
    return 'field-required';
  }
  return true;
});
defineRule('required', (value: any) => {
  if (typeof value === 'number') {
    if (!value && value !== 0) {
      return 'field-required';
    }
    return true;
  }
  if (!value || !value.length) {
    return 'field-required';
  }
  return true;
});
defineRule('email', (value: any) => {
  if (!value || !value.length) {
    return true;
  }
  if (!/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/.test(value)) {
    return 'email-not-valid';
  }
  return true;
});
defineRule('strength', (_value: any, [score]: number[]) => {
  if (score < 2) {
    return 'register.strength-not-valid';
  }
  return true;
});
defineRule('confirm', (_value: any, [password, confirm]: string[]) => {
  if (password !== confirm) {
    return 'register.confirm-not-valid';
  }
  return true;
});
defineRule('positive', (value: any) => {
  if (!value || !value.length) {
    return true;
  }
  if (value <= 0) {
    return 'number-not-positive';
  }
  return true;
});
defineRule('positiveOrNull', (value: any) => {
  if (!value || !value.length) {
    return true;
  }
  if (value < 0) {
    return 'number-not-positive-or-null';
  }
  return true;
});

const TENANT_API_URL = import.meta.env.VITE_API_URL;
const MAIN_URL = import.meta.env.VITE_MAIN_URL;

keycloak
  .init({ onLoad: 'check-sso', checkLoginIframe: false })
  .then((auth) => {
    const aYearFromNow = new Date();
    aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
          globalCookiesConfig({
            expireTimes: aYearFromNow.toUTCString(),
            path: '/',
            domain: MAIN_URL,
            secure: true,
            sameSite: 'None',
          });

    // Token Refresh
    setInterval(() => {
      keycloak
        .updateToken(70)
        .then()
        .catch(() => {
          console.log('Failed to refresh token');
        });
    }, 6000);
    if (auth) {
      axios.interceptors.request.use(
        (config) => {
          if (config.url?.includes(TENANT_API_URL) && keycloak.authenticated && config?.headers) {
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
    }

    const app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.use(i18n)
    app.use(LoadingPlugin)

    app.use(Vue3Toastify, {
      autoClose: 6000,
      theme: "colored"
    } as ToastContainerOptions);
    app.use(MatomoPlugin);
    app.mount('#app')
  })
    .catch(() => {
      console.log('Authenticated Failed');
      window.location.reload();
    });