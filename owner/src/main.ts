import { createApp } from 'vue'
import axios from 'axios'
import Toast from 'vue-toastification'
import { configure, defineRule } from 'vee-validate'
import { createPinia } from 'pinia'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import 'vue-toastification/dist/index.css'
import keycloak from './plugin/keycloak'
import { register } from 'df-shared-next/src/services/ConsentService'

const CRISP_ENABLED = import.meta.env.VITE_CRISP_ENABLED

declare global {
  interface Window {
    _paq?: (string | number | undefined)[][]
  }
}

defineRule('validateEmail', (value: unknown) => {
  if (!value) {
    return 'register.email-not-valid'
  }
  return true
})
defineRule('isTrue', (value: unknown) => {
  if (!value) {
    return 'field-required'
  }
  return true
})
defineRule('hasValue', (value: unknown) => {
  if (!value) {
    return 'field-required'
  }
  return true
})
defineRule('required', (value: unknown) => {
  if (typeof value === 'number') {
    if (!value && value !== 0) {
      return 'field-required'
    }
    return true
  }
  if (!value || (Array.isArray(value) && !value.length)) {
    return 'field-required'
  }
  return true
})
defineRule('email', (value: string | undefined | null) => {
  if (!value || !value.length) {
    return true
  }
  if (!/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/.test(value)) {
    return 'register.email-not-valid'
  }
  return true
})
defineRule('strength', (_value: unknown, [score]: number[]) => {
  if (score < 2) {
    return 'register.strength-not-valid'
  }
  return true
})
defineRule('confirm', (_value: unknown, [password, confirm]: string[]) => {
  if (password !== confirm) {
    return 'register.confirm-not-valid'
  }
  return true
})
defineRule('positive', (value: unknown) => {
  if (!value) {
    return true
  }
  if (Number(value) <= 0) {
    return 'number-not-positive'
  }
  return true
})
defineRule('positiveOrNull', (value: unknown) => {
  if (!value) {
    return true
  }
  if (Number(value) < 0) {
    return 'number-not-positive-or-null'
  }
  return true
})

configure({
  validateOnInput: true
})

const OWNER_API_URL = import.meta.env.VITE_OWNER_API_URL
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'dev'

function mountApp(ownerAuthenticated: boolean) {
  const app = createApp(App)

  Sentry.init({
    app,
    dsn: 'https://33392525504b4dfdaa6623cc1aa56df9@sentry.incubateur.net/99',
    environment: ENVIRONMENT,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: [
          'localhost',
          'proprietaire-dev.dossierfacile.fr',
          'proprietaire.dossierfacile.logement.gouv.fr',
          /^\//
        ]
      })
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.05
  })

  app.use(createPinia())
  app.use(router)
  app.use(i18n)
  app.use(Toast)
  register(app, { matomo: true, crisp: CRISP_ENABLED === 'true' })
  if (ownerAuthenticated) {
    keycloak
      .loadUserProfile()
      .then((user) => {
        window.$crisp?.push(['set', 'user:email', [user.email]])
      })
      .catch((error) => {
        console.error(new Error('Cannot load user profile', { cause: error }))
      })
  }
  app.mount('#app')
}

if (!window.location.href.includes('/validConnexion/')) {
  keycloak
    .init({ onLoad: 'check-sso', checkLoginIframe: true })
    .then((auth) => {
      if (auth) {
        axios.interceptors.request.use(
          (config) => {
            if (config.url?.includes(OWNER_API_URL) && keycloak.authenticated && config?.headers) {
              const localToken = keycloak.token
              config.headers.Authorization = `Bearer ${localToken}`
            }
            return config
          },

          (error) => Promise.reject(error)
        )

        axios.interceptors.response.use(
          (response) => response,
          (error) => {
            if (
              error.response &&
              (error.response.status === 401 || error.response.status === 403)
            ) {
              console.log('err')
            }
            return Promise.reject(error)
          }
        )

        // Token Refresh
        setInterval(() => {
          keycloak
            .updateToken(70)
            .then()
            .catch(() => {
              console.log('Failed to refresh token')
            })
        }, 6000)
      }

      mountApp(true)
    })
    .catch(() => {
      console.log('Authenticated Failed')
      window.location.reload()
    })
} else {
  mountApp(false)
}
