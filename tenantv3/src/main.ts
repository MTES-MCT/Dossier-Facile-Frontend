import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'
import { defineRegleOptions, RegleVuePlugin } from '@regle/core'
import '@gouvfr/dsfr/dist/core/core.main.min.css'
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'
import '@gouvfr/dsfr/dist/utility/colors/colors.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons.min.css'
import '@gouvfr/dsfr/dist/component/component.main.min.css'
import '@gouvminint/vue-dsfr/styles'

import { keycloak } from './plugin/keycloak'
import axios, { type AxiosError } from 'axios'
import { LoadingPlugin } from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { configure, defineRule } from 'vee-validate'
import * as Sentry from '@sentry/vue'
import { useUtils } from './composables/useUtils'

import { ConsentPlugin } from 'df-shared-next/src/services/ConsentService'
import {
  email,
  minLength,
  required,
  withMessage,
  maxLength,
  checked,
  alpha,
  maxFileSize,
  fileType
} from '@regle/rules'

const { getDocSize, getAllowedTypes } = useUtils()

const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT
const CRISP_ENABLED = import.meta.env.VITE_CRISP_ENABLED

defineRule('onlyAlpha', (value: string) => {
  const regex = /^[a-zA-Z \-'’àâäçéèêëîïôöùûüÿæœÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸÆŒ]*$/
  if (!regex.test(value)) {
    return 'only-alpha'
  }
  return true
})

defineRule('zipcode', (value: string | undefined | null) => {
  if (!value) {
    return true
  }
  const regex = /^\d{5}$/
  if (!regex.test(value)) {
    return 'zipcode-not-valid'
  }
  return true
})
defineRule('regex', (_value: number | string | undefined, [regex]: RegExp[]) => {
  if (!_value?.toString().match(regex)) {
    return 'regex-not-valid'
  }
  return true
})

defineRule('validateEmail', (value: unknown) => {
  if (!value) {
    return 'email-not-valid'
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
  if (!value?.length) {
    return true
  }
  if (!/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/.test(value)) {
    return 'email-not-valid'
  }
  return true
})
defineRule('strength', (_value: unknown, [score]: number[]) => {
  if (score < 2) {
    return 'strength-not-valid'
  }
  return true
})
defineRule('confirm', (_value: unknown, [password, confirm]: string[]) => {
  if (password !== confirm) {
    return 'confirm-not-valid'
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
defineRule('notBlank', (value: unknown) => {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return 'field-required'
  }
  return true
})

configure({
  validateOnInput: true
})

const TENANT_API_URL = import.meta.env.VITE_API_URL

// Custom i18n error messages for validators
const reglesOptions = defineRegleOptions({
  rules: () => ({
    required: withMessage(required, i18n.global.t('validation.required')),
    email: withMessage(email, i18n.global.t('validation.emailValidation')),
    alpha: withMessage(alpha, i18n.global.t('validation.alpha')),
    checked: withMessage(checked, i18n.global.t('validation.consent')),
    minLength: withMessage(minLength, ({ $value, $params: [min] }) => {
      return i18n.global.t('validation.min', { min, length: $value?.length })
    }),
    maxLength: withMessage(maxLength, ({ $value, $params: [max] }) => {
      return i18n.global.t('validation.max', { max, length: $value?.length })
    }),
    maxFileSize: withMessage(maxFileSize, ({ $value, $params: [max] }) => {
      return i18n.global.t('validation.maxFileSize', {
        max: getDocSize(max),
        n: getDocSize($value?.size)
      })
    }),
    fileType: withMessage(fileType, ({ $params: [accept] }) => {
      const allowedTypes = getAllowedTypes(accept)
      return i18n.global.t('validation.fileType', { accept: allowedTypes })
    })
  }),
  modifiers: {
    silent: true,
    autoDirty: false,
    rewardEarly: true
  }
})

keycloak
  .init({ onLoad: 'check-sso', checkLoginIframe: true })
  .then((auth) => {
    if (auth) {
      axios.interceptors.request.use(
        (config) => {
          if (config.url?.includes(TENANT_API_URL) && keycloak.authenticated && config?.headers) {
            const localToken = keycloak.token
            config.headers.Authorization = `Bearer ${localToken}`
          }
          return config
        },

        (error: Error) => Promise.reject(error)
      )

      axios.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
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

      keycloak
        .loadUserProfile()
        .then((user) => {
          window.$crisp?.push(['set', 'user:email', [user.email]])
        })
        .catch((error) => {
          console.error(new Error('Cannot load user profile', { cause: error }))
        })
    } else {
      console.log('Not authenticated')
    }

    const app = createApp(App)

    if (import.meta.env.PROD) {
      Sentry.init({
        app,
        dsn: 'https://7032afeb9b1740f68e01148573cff778@sentry.incubateur.net/98',
        environment: ENVIRONMENT,
        tracesSampleRate: 0.05,
        integrations: [Sentry.browserTracingIntegration({ router })]
      })
    }

    app.use(createPinia())
    app.use(router)
    app.use(i18n)
    app.use(RegleVuePlugin, reglesOptions)
    app.use(LoadingPlugin)
    app.use(ConsentPlugin, { matomo: true, crisp: CRISP_ENABLED === 'true' })
    app.mount('#app')
  })
  .catch((error: Error) => {
    console.dir(error)
    window.location.reload()
  })
