import VueMatomo from 'vue-matomo'
import router from '../router'

export default {
  install(app: any) {
    const options = {
      host: import.meta.env.VITE_MATOMO_URL,
      siteId: import.meta.env.VITE_MATOMO_SITE_ID,
      trackerFileName: 'matomo',
      router,
      domains: import.meta.env.VITE_MATOMO_DOMAIN,
      cookieDomain: import.meta.env.VITE_MATOMO_DOMAIN,
      userId: undefined,
      enableLinkTracking: true,
      trackInitialView: true
    }

    app.use(VueMatomo, options)
  }
}
