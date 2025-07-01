import VueMatomo from 'vue-matomo'
import type { App } from 'vue'

declare global {
  interface Window {
    _paq?: (string | number | undefined)[][]
  }
}

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
      trackInitialView: true,
    }

    app.use(VueMatomo, options)

    // Add global Matomo configurations
    if (typeof window !== 'undefined' && window._paq) {
      window._paq.push(['setConsentGiven'])
      window._paq.push(['HeatmapSessionRecording::enable'])
    }
  }
}
