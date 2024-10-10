export const AnalyticsService = {
  sendEvent(name: string, data: any) {
    if (import.meta.env.VITE_MATOMO_ENABLE === 'false') {
      return
    }
    window._paq.push(['trackEvent', data.event_category, name, ''])
  },

  contactEvent(tag: string) {
    this.sendEvent(tag, {
      event_category: 'contact'
    })
  }
}
