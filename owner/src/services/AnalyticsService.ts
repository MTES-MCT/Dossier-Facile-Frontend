const AnalyticsService = {
  sendEvent(name: string, data: any) {
    if (!import.meta.env.VITE_MATOMO_ENABLE) {
      return
    }
    window._paq.push(['trackEvent', data.event_category, name, data.event_label])
  },
  dpeEvent(tag: string) {
    this.sendEvent(tag, {
      event_category: 'dpe'
    })
  },
  contactEvent(tag: string) {
    this.sendEvent(tag, {
      event_category: 'contact'
    })
  },
  redirectFranceRenov() {
    this.sendEvent('france-renov', {
      event_category: 'property'
    })
  },
  registerWithTopVerticalForm() {
    this.sendEvent('register-top-form', {
      event_category: 'owner'
    })
  },
  registerWithBottomInlineForm() {
    this.sendEvent('register-bottom-form', {
      event_category: 'owner'
    })
  },
  onFranceConnectWithTopVerticalForm() {
    this.sendEvent('register-with-fc-top-form', {
      event_category: 'owner'
    })
  },
  onFranceConnectWithBottomInlineForm() {
    this.sendEvent('register-with-fc-bottom-form', {
      event_category: 'owner'
    })
  },
  propertyData(data: string) {
    this.sendEvent('property_' + data, {
      event_category: 'property'
    })
  }
}

export default AnalyticsService
