import VueMatomo from 'vue-matomo'
import type { App } from 'vue'

export const MatomoPlugin = {
  install(app: App) {
    const options = {
      host: 'https://stats.beta.gouv.fr',
      siteId: 32,
      trackerFileName: 'matomo',
      router: app.config.globalProperties.$router,
      domains: '*.dossierfacile.logement.gouv.fr',
      userId: undefined,
      enableLinkTracking: true,
      trackInitialView: true
    }

    app.use(VueMatomo, options)
  }
}
