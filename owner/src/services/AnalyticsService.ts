const AnalyticsService = {
  sendEvent(name: string, data: any) {
    if (import.meta.env.VITE_MATOMO_ENABLE) {
      return;
    }
    window._paq.push(['trackEvent', data.event_category, name, data.event_label]);
  },
  redirectFranceRenov() {
    this.sendEvent('france-renov', {
      event_category: 'property',
    });
  },
  registerWithTopVerticalForm() {
    this.sendEvent('register-top-form', {
      event_category: 'owner',
    });
  },
  registerWithBottomInlineForm() {
    this.sendEvent('register-bottom-form', {
      event_category: 'owner',
    });
  },
  onFranceConnectWithTopVerticalForm() {
    this.sendEvent('register-with-fc-top-form', {
      event_category: 'owner',
    });
  },
  onFranceConnectWithBottomInlineForm() {
    this.sendEvent('register-with-fc-bottom-form', {
      event_category: 'owner',
    });
  },
};

export default AnalyticsService;
