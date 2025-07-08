export const AnalyticsService = {
  sendEvent(name: string, data: { event_category: string }) {
    if (!window._paq) {
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
