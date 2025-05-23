import { CookiesService } from 'df-shared-next/src/services/CookiesService'
import { createPinia } from 'pinia'
import i18n from './i18n'
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import * as Sentry from '@sentry/vue'

import routes from './router/index'
import { ConsentPlugin } from 'df-shared-next/src/services/ConsentService'

const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT
const CRISP_ENABLED = import.meta.env.VITE_CRISP_ENABLED
const IS_CLIENT = !import.meta.env.SSR

declare global {
  interface Window {
    _paq?: (string | number | undefined)[][]
  }
}

export const createApp = ViteSSG(App, { routes }, ({ app, router }) => {
  const pinia = createPinia()
  if (IS_CLIENT && import.meta.env.PROD) {
    Sentry.init({
      app,
      dsn: 'https://6705728c765748949f37aead7a739c40@sentry.incubateur.net/97',
      integrations: [Sentry.browserTracingIntegration({ router })],
      environment: ENVIRONMENT,
      tracesSampleRate: 0.05,
      tracePropagationTargets: [
        'localhost',
        'www-preprod.dossierfacile.fr',
        'www.dossierfacile.logement.gouv.fr',
        /^\//
      ]
    })
  }
  app.use(pinia)
  app.use(i18n)
  app.use(Vue3Toastify, {
    autoClose: 6000,
    theme: 'colored',
    clearOnUrlChange: false
  } satisfies ToastContainerOptions)
  app.use(ConsentPlugin, { matomo: IS_CLIENT, crisp: IS_CLIENT && CRISP_ENABLED === 'true' })

  router.beforeEach((to, from, next) => {
    if (
      to.query.mtm_campaign !== undefined ||
      to.query.mtm_source !== undefined ||
      to.query.mtm_medium !== undefined
    ) {
      CookiesService.setJsonCookie(
        'acquisition',
        {
          campaign: to.query.mtm_campaign,
          source: to.query.mtm_source,
          medium: to.query.mtm_medium
        },
        CookiesService.datePlusDaysFromNow(1)
      )
    }

    next()
  })
})
